import { Pipe, PipeTransform } from '@angular/core';

import { Team } from '../services/interfaces/team';
import { PlayerTransaction } from './interfaces/TransactionsData';

@Pipe({
  name: 'sortTeamsByTransactions',
})
export class SortTeamsByTransactionsPipe implements PipeTransform {
  transform(teams: Team[], allTransactions: PlayerTransaction[]): Team[] {
    return teams.sort((a, b) => {
      const aHasTransactions =
        allTransactions.filter((t) => t.teamKey === a.team_key).length > 0;
      const bHasTransactions =
        allTransactions.filter((t) => t.teamKey === b.team_key).length > 0;
      if (aHasTransactions && !bHasTransactions) {
        return -1;
      } else if (!aHasTransactions && bHasTransactions) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}
