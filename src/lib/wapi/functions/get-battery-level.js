export function getBatteryLevel() {
  return Store.Me && Store.Me.battery ? Store.Me.battery : undefined
}
