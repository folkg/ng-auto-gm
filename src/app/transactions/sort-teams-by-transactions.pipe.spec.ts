import { SortTeamsByTransactionsPipe } from "./sort-teams-by-transactions.pipe";

describe("SortTeamsByTransactionsPipe", () => {
  it("create an instance", () => {
    const pipe = new SortTeamsByTransactionsPipe();
    expect(pipe).toBeTruthy();
  });
});
