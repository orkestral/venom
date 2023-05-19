import { filterObjects } from './filter-object';
import { injectConfig, filterModule } from '../../help';

export async function addChatWapi() {
  window[injectConfig.webpack].push([
    [injectConfig.parasite],
    {},
    async function (o) {
      let modules = [];
      for (let idx in o.m) {
        modules.push(o(idx));
      }

      const filterMod = await filterModule(filterObjects, modules);

      filterMod.forEach((needObj) => {
        if (needObj.yesModule) {
          if (!Store[needObj.type]) {
            Store[needObj.type] = needObj.yesModule;
          }
        }
      });

      if (Store && Store.BusinessProfile) {
        Store.Chat._findAndParse = Store.BusinessProfile._findAndParse;
        Store.Chat._find = Store.BusinessProfile._find;
      }
    }
  ]);
}
