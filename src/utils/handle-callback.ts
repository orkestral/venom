export function handleCallBack(
  callback: (...args: any[]) => void,
  ...args: any[]
): void {
  if (typeof callback === 'function') {
    callback(...args)
  }
}
