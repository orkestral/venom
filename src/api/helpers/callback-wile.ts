export class callbackWile {
  obj: Object;
  constructor() {
    this.obj = [];
  }
  addObjects(ids: string, serializeds: string) {
    let checkFilter = this.obj['filter'](
      (order) => order.serialized === serializeds
    );
    let add = null;
    if (!checkFilter.length) {
      add = {
        id: ids,
        serialized: serializeds,
      };
      this.obj['push'](add);
      return true;
    }
    return false;
  }

  getObjKey(serialized: string) {
    for (let i in this.obj) {
      if (this.obj[i].serialized === serialized) {
        return i;
      }
    }
    return false;
  }

  checkObj(id: string, serialized: string) {
    let checkFilter = this.obj['filter'](
      (order) => order.id === id && order.serialized === serialized
    );
    if (checkFilter.length) {
      return true;
    }
    return false;
  }

  get module() {
    return this.obj;
  }
}
