import { JsonPipe } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButton } from "@angular/material/button";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import {
  Functions,
  getFunctions,
  HttpsCallable,
  httpsCallableFromURL,
} from "@firebase/functions";
import { lastValueFrom } from "rxjs";

import { SyncTeamsService } from "../services/sync-teams.service";
import {
  ConfirmDialogComponent,
  DialogData,
} from "../shared/confirm-dialog/confirm-dialog.component";
import { logError } from "../shared/utils/error";
import {
  PlayerTransaction,
  PostTransactionsResult,
  TransactionResults,
  TransactionsData,
} from "./interfaces/TransactionsData";
import { SortTeamsByTransactionsPipe } from "./sort-teams-by-transactions.pipe";
import { TeamComponent } from "./team/team.component";

@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.component.html",
  styleUrls: ["./transactions.component.scss"],
  imports: [
    TeamComponent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButton,
    MatProgressSpinner,
    JsonPipe,
    SortTeamsByTransactionsPipe,
  ],
})
export class TransactionsComponent {
  readonly allTeams = toSignal(this.sts.teams$, { initialValue: [] });
  readonly teams = computed(() =>
    this.allTeams().filter((team) => team.allow_transactions),
  );

  private readonly transactions = signal<TransactionsData | undefined>(
    undefined,
  );
  readonly flatTransactions = computed<PlayerTransaction[] | undefined>(() =>
    this.computeFlatTransactions(this.transactions()),
  );
  readonly selectedTransactions = computed(
    () => this.flatTransactions()?.filter((t) => t.selected) ?? [],
  );
  readonly numSelectedTransactions = computed(
    () => this.selectedTransactions().length,
  );

  readonly isProcessing = signal(false);
  readonly success = signal<boolean | undefined>(undefined);
  private readonly transactionResults = signal<TransactionResults | undefined>(
    undefined,
  );
  readonly successTransactions = computed(
    () => this.transactionResults()?.postedTransactions ?? [],
  );
  readonly failedReasons = computed(
    () => this.transactionResults()?.failedReasons ?? [],
  );

  private readonly functions: Functions;

  constructor(
    private readonly sts: SyncTeamsService,
    private readonly dialog: MatDialog,
  ) {
    this.functions = getFunctions();
  }

  ngOnInit(): void {
    this.fetchTransactions()
      .then((transactions) => this.transactions.set(transactions))
      .catch((err) =>
        logError(err, "Error fetching transactions from Firebase:"),
      );
  }

  private async fetchTransactions(): Promise<TransactionsData> {
    const fetchTransactions: HttpsCallable<null, TransactionsData> =
      httpsCallableFromURL(
        this.functions,
        "https://fantasyautocoach.com/api/gettransactions",
      );

    const result = await fetchTransactions();
    return mapPlayerTransactions(result.data, (t) => ({
      ...t,
      selected: false,
      // TOOD: ID should be assigned on the server
      id: `${t.teamKey}-${t.players.map((p) => p.playerKey).join("-")}`,
    }));
  }

  onSelectTransaction($event: { isSelected: boolean; transactionId: string }) {
    if (!this.transactions()) {
      return;
    }

    this.transactions.update((transactions) =>
      transactions
        ? mapPlayerTransactions(transactions, (t) =>
            t.id === $event.transactionId
              ? { ...t, selected: $event.isSelected }
              : t,
          )
        : undefined,
    );
  }

  private computeFlatTransactions(
    transactions: TransactionsData | undefined,
  ): PlayerTransaction[] | undefined {
    if (!transactions) {
      return undefined;
    }

    const { dropPlayerTransactions, addSwapTransactions } = transactions;

    return (dropPlayerTransactions ?? [])
      .concat(addSwapTransactions ?? [])
      .flat();
  }

  private getSelectedTransactionsData(): TransactionsData {
    const result: TransactionsData = {
      dropPlayerTransactions: null,
      lineupChanges: null,
      addSwapTransactions: null,
    };

    const transactions = this.transactions();
    if (!transactions) {
      return result;
    }

    const { dropPlayerTransactions, lineupChanges, addSwapTransactions } =
      transactions;

    result.dropPlayerTransactions = filterSelectedTransactionsData(
      dropPlayerTransactions,
    );

    result.addSwapTransactions =
      filterSelectedTransactionsData(addSwapTransactions);

    // Keep all the lineup changes for the teams that have selected transactions, even if we don't need them all
    const teamsWithTransactions = new Set(
      this.selectedTransactions().map((t) => t.teamKey),
    );
    result.lineupChanges =
      lineupChanges?.filter((lc) => teamsWithTransactions.has(lc.teamKey)) ??
      null;

    return result;
  }

  async submitTransactions(): Promise<void> {
    const userSelectionConfirmed = await this.confirmDialog();
    if (userSelectionConfirmed) {
      this.isProcessing.set(true);
      try {
        const transactions = this.getSelectedTransactionsData();
        await this.postTransactions(transactions);
      } finally {
        this.isProcessing.set(false);
      }
    }
  }

  private async postTransactions(
    transactions: TransactionsData,
  ): Promise<void> {
    const postTransactions = httpsCallableFromURL<
      { transactions: TransactionsData },
      PostTransactionsResult
    >(this.functions, "https://fantasyautocoach.com/api/posttransactions");

    try {
      const result = await postTransactions({ transactions });
      this.success.set(result.data.success);
      this.transactionResults.set(result.data.transactionResults);
    } catch (err) {
      logError(err, "Error posting transactions to Firebase:");
      this.success.set(false);
    }
  }

  confirmDialog(): Promise<boolean> {
    const numSelectedTransactions = this.numSelectedTransactions();

    const title = "WARNING: Permanent Action";
    const message = `These transactions will be permanent. Click Proceed to officially process your ${
      numSelectedTransactions !== 0 ? numSelectedTransactions : ""
    } selected transaction${
      numSelectedTransactions !== 1 ? "s" : ""
    } with Yahoo, or Cancel to return to the transactions page.`;
    const dialogData: DialogData = {
      title,
      message,
      trueButton: "Proceed",
      falseButton: "Cancel",
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: "350px",
      width: "90%",
      maxWidth: "500px",
      data: dialogData,
    });
    return lastValueFrom(dialogRef.afterClosed());
  }
}

function mapPlayerTransactions(
  transactionsData: TransactionsData,
  mapFn: (t: PlayerTransaction) => PlayerTransaction,
): TransactionsData {
  const { dropPlayerTransactions, addSwapTransactions, lineupChanges } =
    transactionsData;

  return {
    dropPlayerTransactions:
      dropPlayerTransactions?.map((tA) => tA.map((t) => mapFn(t))) ?? null,
    addSwapTransactions:
      addSwapTransactions?.map((tA) => tA.map((t) => mapFn(t))) ?? null,
    lineupChanges,
  };
}

function filterSelectedTransactionsData(
  playerTransactions: PlayerTransaction[][] | null,
): PlayerTransaction[][] | null {
  if (!playerTransactions) {
    return null;
  }

  return playerTransactions
    .map((teamTransactions) =>
      teamTransactions.filter((transaction) => transaction.selected),
    )
    .filter((selectedTransactions) => selectedTransactions.length > 0);
}
