import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  teamid!: number;
  constructor(private router: ActivatedRoute) {}

  ngOnInit(): void {
    this.teamid = this.router.snapshot.params['teamid'];
  }
}
