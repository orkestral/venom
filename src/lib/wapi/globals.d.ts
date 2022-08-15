//  * Credits for WPPConnect Team
//  * Author: <Edgard Messias>
//  * wppconnect-team/wa-js
//  * https://github.com/wppconnect-team/wa-js
import type * as wajs from '@wppconnect/wa-js';

declare global {
  interface Window {
    WPP: typeof wajs;
  }
  const WPP: typeof wajs;
}

declare global {
  interface Window {
    Store: any;
  }
}
//*******************************************
