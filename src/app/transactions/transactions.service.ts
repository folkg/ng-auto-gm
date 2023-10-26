import { Injectable } from '@angular/core';
import {
  Functions,
  HttpsCallable,
  httpsCallableFromURL,
} from '@angular/fire/functions';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';
import {
  PlayerTransaction,
  PostTransactionsResult,
  TransactionsData,
} from './interfaces/TransactionsData';
import { Player } from './interfaces/Player';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private originalTransactions: TransactionsData | undefined;
  private transactionsSubject = new BehaviorSubject<PlayerTransaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();

  constructor(private fns: Functions) {
    this.fetchTransactions();
  }

  private async fetchTransactions(): Promise<void> {
    const fetchTransactions: HttpsCallable<null, TransactionsData> =
      httpsCallableFromURL(
        this.fns,
        // 'https://transactions-gettransactions-nw73xubluq-uc.a.run.app'
        'https://fantasyautocoach.com/api/gettransactions'
      );
    try {
      const result = await fetchTransactions();
      const transactions = result.data;

      console.log('transactions: ', transactions);

      this.originalTransactions = transactions;
      this.setTransactions(transactions);
    } catch (err: any) {
      console.error(
        'Error fetching transactions from Firebase: ' + err.message
      );
    }
  }

  private setTransactions(transactions: TransactionsData) {
    const { dropPlayerTransactions, addSwapTransactions } = transactions;

    const flatTransactions: PlayerTransaction[] = (dropPlayerTransactions ?? [])
      .concat(addSwapTransactions ?? [])
      .flat();

    flatTransactions.forEach((t) => {
      t.selected = false;
      t.id = uuid();
    });

    this.transactionsSubject.next(flatTransactions);
  }

  public updateTransaction(transaction: PlayerTransaction): void {
    const updatedTransaction = { ...transaction };

    const newTransactions = this.transactionsSubject.value.map((t) => {
      if (t.id === updatedTransaction.id) {
        return updatedTransaction;
      }
      return t;
    });

    this.transactionsSubject.next(newTransactions);
  }

  public getTopAddCandidatesList(teamKey: string): Player[] {
    return (
      this.originalTransactions?.topAddCandidatesList[teamKey].sort(
        (a, b) => b.ownership_score - a.ownership_score
      ) ?? []
    );
  }

  public getTopDropCandidatesList(teamKey: string): Player[] {
    return (
      this.originalTransactions?.topDropCandidatesList[teamKey].sort(
        (a, b) => a.ownership_score - b.ownership_score
      ) ?? []
    );
  }

  private get selectedTransactions(): PlayerTransaction[] {
    return this.transactionsSubject.value.filter((t) => t.selected);
  }

  public get numSelectedTransactions(): number {
    return this.selectedTransactions.length;
  }

  private selectedTransactionsData(): TransactionsData {
    const result: TransactionsData = {
      dropPlayerTransactions: null,
      lineupChanges: null,
      addSwapTransactions: null,
      topAddCandidatesList: {},
      topDropCandidatesList: {},
      playersAtPositionList: {},
    };

    if (!this.originalTransactions) {
      return result;
    }

    // TODO: When we get to changing transactions, this will need to be updated.
    // We won't want to use the originalTransactions, we'll want to use the
    // latestTransactions object an reconstruct.
    const { dropPlayerTransactions, lineupChanges, addSwapTransactions } =
      this.originalTransactions;

    result.dropPlayerTransactions = this.filterSelectedTransactionsData(
      dropPlayerTransactions
    );

    result.addSwapTransactions =
      this.filterSelectedTransactionsData(addSwapTransactions);

    // Keep all the lineup changes for the teams that have selected transactions, even if we don't need them all
    const teamsWithTransactions: Set<string> = new Set(
      this.selectedTransactions.map((t) => t.teamKey)
    );
    result.lineupChanges =
      lineupChanges?.filter((lc) => teamsWithTransactions.has(lc.teamKey)) ??
      null;

    return result;
  }

  private filterSelectedTransactionsData(
    playerTransactions: PlayerTransaction[][] | null
  ): PlayerTransaction[][] | null {
    if (!playerTransactions) {
      return null;
    }

    return playerTransactions
      .map((teamTransactions) =>
        teamTransactions.filter((transaction) => transaction.selected)
      )
      .filter((selectedTransactions) => selectedTransactions.length > 0);
  }

  public async postTransactions(): Promise<PostTransactionsResult> {
    const postTransactions: HttpsCallable<
      { transactions: TransactionsData },
      PostTransactionsResult
    > = httpsCallableFromURL(
      this.fns,
      // 'https://transactions-posttransactions-nw73xubluq-uc.a.run.app'
      'https://fantasyautocoach.com/api/posttransactions'
    );
    const transactions = this.selectedTransactionsData();

    try {
      const result = await postTransactions({ transactions });

      // refresh the transactions data
      this.fetchTransactions();

      return result.data;
    } catch (err: any) {
      const errorMessage = `Error posting transactions to Firebase: ${err.message}`;
      console.error(errorMessage);
      return {
        success: false,
        transactionResults: {
          postedTransactions: [],
          failedReasons: [errorMessage],
        },
      };
    }
  }
}
