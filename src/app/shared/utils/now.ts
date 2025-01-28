import spacetime, { Spacetime } from "spacetime";

export function spacetimeNow(): Spacetime {
  return spacetime.now("Canada/Pacific");
}
