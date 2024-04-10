export function sleep(time: number): Promise<void> {
  try {
    return new Promise((resolve: TimerHandler) => setTimeout(resolve, time))
  } catch (e) {}
}
