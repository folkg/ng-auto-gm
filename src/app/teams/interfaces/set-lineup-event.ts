import { Team } from '../../services/interfaces/team';

export interface SetLineupEvent {
  team: Team;
  state: boolean;
}
