export interface tokenSession {
  WABrowserId: string;
  WAToken1: string;
  WAToken2: string;
  WASecretBundle: string;
}

export const defaultTokenSession: tokenSession = {
  WABrowserId: '',
  WASecretBundle: '',
  WAToken1: '',
  WAToken2: '',
};
