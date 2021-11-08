export interface CN_O {
  CN_RM?: boolean;
  CN_OB?: boolean;
  CN_CKN?: string[];
}
export declare type FindModules = (M: any, ID?: string) => boolean;
declare class getStore {
  CN_INO(): void;
  CN_RFM(): Promise<boolean>;
  private mutationObserver;
  private _modules;
  get size(): number;
  on(topic: string, cb: Function): boolean;
  off(topic: string, cb?: Function): boolean;
  private _events;
  private _options;
  protected emit(topic: string, ...args: any[]): void;
  constructor(options?: CN_O);
  CN_SMID(condition: FindModules, reverse?: boolean): string;
  CN_SEM<T = any>(condition: FindModules, reverse?: boolean): T;
  get<T = any>(moduleId: string): T;
  forEach(
    callbackfn: (value: any, key: string, map: Map<string, any>) => void
  ): void;
  dispose(): void;
  waitForModule<T = any>(
    condition: FindModules,
    reverse?: boolean,
    timeout?: number | false
  ): Promise<T>;
}
export default getStore;

export {};
