import { Leagues } from "src/app/shared/interfaces/Leagues";
import { Infer, array, number, object, record, string } from "superstruct";

export const Schedule = object({
  date: string(),
  games: record(Leagues, array(number())),
});

export type Schedule = Infer<typeof Schedule>;
