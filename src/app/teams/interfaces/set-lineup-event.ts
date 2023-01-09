import { Team } from './team';

export interface SetLineupEvent {
  team: Team;
  state: boolean;
}
