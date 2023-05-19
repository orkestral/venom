/**
 * Pauses the execution for a specified amount of time.
 * @param time The duration to sleep in milliseconds.
 */
export function sleep(time: number) {
  try {
    // Create a promise that resolves after the specified time
    return new Promise((resolve) => setTimeout(resolve, time));
  } catch {}
}
