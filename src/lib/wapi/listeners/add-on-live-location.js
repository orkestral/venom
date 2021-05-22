export function addOnLiveLocation() {
  window.WAPI.onLiveLocation = async function (chatId, callback) {
    return await window.WAPI.waitForStore(['LiveLocation'], () => {
      var lLChat = Store.LiveLocation.get(chatId);
      if (lLChat) {
        var validLocs = lLChat.participants.validLocations();
        validLocs.map((x) =>
          x.on('change:lastUpdated', (x, y, z) => {
            console.log(x, y, z);
            const { id, lat, lng, accuracy, degrees, speed, lastUpdated } = x;
            const l = {
              id: id.toString(),
              lat,
              lng,
              accuracy,
              degrees,
              speed,
              lastUpdated,
            };
            // console.log('newloc',l)
            callback(l);
          })
        );
        return true;
      } else {
        return false;
      }
    });
  };
}
