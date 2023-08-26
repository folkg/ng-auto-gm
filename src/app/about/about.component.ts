import { Component } from '@angular/core';
import { Team } from '../services/interfaces/team';
import spacetime from 'spacetime';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  sampleTimestamps: number[] = [this.getNextUpdate()];
  sampleTeam: Team = {
    game_name: 'Baseball',
    game_code: 'mlb',
    game_season: new Date().getFullYear().toString(),
    game_is_over: false,
    team_key: '',
    team_name: 'Bat Attitudes',
    team_url: '',
    team_logo: 'https://s.yimg.com/cv/apiv2/default/mlb/mlb_12_j.png',
    league_name: 'Dyanasty League',
    num_teams: 12,
    rank: 1,
    points_for: null,
    points_against: null,
    points_back: null,
    outcome_totals: {
      wins: '107',
      losses: '58',
      ties: '24',
      percentage: '.630',
    },
    scoring_type: 'head',
    start_date: 0,
    end_date: 9999999999999,
    weekly_deadline: 'intraday',
    waiver_rule: 'all',
    faab_balance: -1,
    current_weekly_adds: 0,
    current_season_adds: 0,
    max_weekly_adds: -1,
    max_season_adds: -1,
    max_games_played: -1,
    max_innings_pitched: -1,
    edit_key: '',
    is_subscribed: true,
    is_setting_lineups: true,
    last_updated: this.getLastUpdate(),
    allow_transactions: false,
    allow_dropping: false,
    allow_adding: false,
    allow_add_drops: false,
    allow_waiver_adds: false,
  };

  getLastUpdate(): number {
    const now = spacetime.now('Canada/Pacific');
    const update = now.time('15:55');
    if (now.isAfter(update)) {
      return update.epoch;
    } else {
      return now.time('01:55').epoch;
    }
  }

  getNextUpdate(): number {
    const now = spacetime.now('Canada/Pacific');
    const update = now.time('15:55');
    if (now.isAfter(update)) {
      return now.add(1, 'day').time('01:55').epoch;
    } else {
      return update.epoch;
    }
  }
}
