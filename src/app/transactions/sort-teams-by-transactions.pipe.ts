import { Pipe, PipeTransform } from '@angular/core';
import { Team } from '../services/interfaces/team';

@Pipe({
  name: 'sortTeamsByTransactions',
})
export class SortTeamsByTransactionsPipe implements PipeTransform {
  transform(
    teams: Team[],
    displayTransactions: { [teamKey: string]: any }
  ): Team[] {
    return teams.sort((a, b) => {
      const aHasTransactions =
        displayTransactions[a.team_key] !== undefined &&
        displayTransactions[a.team_key].length > 0;
      const bHasTransactions =
        displayTransactions[b.team_key] !== undefined &&
        displayTransactions[b.team_key].length > 0;
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
