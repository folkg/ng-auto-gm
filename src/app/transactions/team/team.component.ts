import { DecimalPipe, NgFor, NgIf } from "@angular/common";
import { Component, Input, SimpleChanges } from "@angular/core";
import { MatIconButton } from "@angular/material/button";
import {
  MatCard,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { Team } from "src/app/services/interfaces/team";

import { NthPipe } from "../../shared/pipes/nth.pipe";
import { PlayerTransaction } from "../interfaces/TransactionsData";
import { TransactionComponent } from "../transaction/transaction.component";

@Component({
  selector: "app-team[team][allTransactions]",
  templateUrl: "./team.component.html",
  styleUrls: ["./team.component.scss"],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardAvatar,
    MatCardTitle,
    MatCardSubtitle,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatDivider,
    MatCardContent,
    NgIf,
    NgFor,
    TransactionComponent,
    DecimalPipe,
    NthPipe,
  ],
})
export class TeamComponent {
  @Input({ required: true }) team!: Team;
  @Input({ required: true }) allTransactions: PlayerTransaction[] = [];
  public transactions: PlayerTransaction[] = [];
  public scoringType: { [key: string]: string } = {
    head: "Head to Head Scoring",
    roto: "Rotisserie Scoring",
    point: "Points Scoring",
    headpoint: "Head to Head (Points) Scoring",
    headone: "Head to Head (One Win) Scoring",
  };

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes["allTransactions"].currentValue !==
      changes["allTransactions"].previousValue
    ) {
      this.transactions = this.allTransactions.filter(
        (transaction) => transaction.teamKey === this.team.team_key,
      );
    }
  }

  gotoExternalDomain(url: string) {
    if (url) {
      window.open(url, "_blank");
    }
  }
}
