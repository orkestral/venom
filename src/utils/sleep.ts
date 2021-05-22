export function sleep(time: number): Promise<void> {
  return new Promise((resolve: TimerHandler) => setTimeout(resolve, time));
}
