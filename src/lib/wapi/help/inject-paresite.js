import { injectConfig, filterObjects, filterModule } from './index';
export const injectParasiteSnake = async () => {
  window[injectConfig.webpack].push([
    [injectConfig.parasite],
    {},
    async function (e) {
      const modules = []; // modules whatsapp array
      Object.keys(e.m).forEach(function (mod) {
        modules[mod] = e(mod);
      });

      const filterMod = await filterModule(filterObjects, modules);

      filterMod.forEach((needObj) => {
        if (needObj.yesModule) {
          if (needObj.type !== 'Module') {
            if (!window.Store[needObj.type]) {
              window.Store[needObj.type] = needObj.yesModule;
            }
          }
        }
      });

      const module = filterMod.filter((e) => e.type === 'Module')[0].yesModule;
      Object.keys(module).forEach((key) => {
        if (!['Chat'].includes(key)) {
          if (window.Store[key]) {
            window.Store[key + '_'] = module[key];
          } else {
            window.Store[key] = module[key];
          }
        }
      });
    }
  ]);
};
