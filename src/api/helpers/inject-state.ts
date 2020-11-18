import { Page } from 'puppeteer';

declare global {
  interface Window {
	inject: any;
	eventeState: any;
	webpackJsonp: any;
  }
}

export async function injectState(page: Page): Promise<boolean>{
async function scrapeState(): Promise<boolean>{
	return new Promise((resolve, reject)=> {	
	async function getStore(modules: any): Promise<boolean>{
		return new Promise((resolve, reject)=> {	
		for (let idx in modules) {
			if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
				let first = Object.values(modules[idx])[0];
				if ((typeof first === "object") && (first["exports"])) {
					for(let idx2 in modules[idx]) {
						let module = modules(idx2);
							if (!module) {
								continue;
							}
							var evet = (module.STATE && module.STREAM)? module : null 
								if(evet){
									window.inject = evet;
									window.eventeState = function(callback: any) {
										window.inject.default.on('change:state', callback);
										return true;
									};
									resolve(true);
									break;
							}
						}
				}
			}
		}
			if(window.inject === undefined){
				reject(modules);
			}
		});
	}
	setTimeout(()=>{
		var Data = `${Date.now()}`;
		window.webpackJsonp.push([ [Data], { [Data]: async (x:any,y:any,z:any) =>{ 
				try{
					resolve(await getStore(z));
				}catch(e){
					reject(e);
				}
			}}, [[Data]] ]);	
		}, 1000);
	})

}

await page.addScriptTag({ content: `${scrapeState}`});
	var value = await page.evaluate(async () => {
					try{
						return await scrapeState();
					}catch{
						return false;
					}			
	});
	return value;

}


