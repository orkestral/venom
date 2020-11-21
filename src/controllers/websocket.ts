import { ConnectionTransport } from 'puppeteer';
import * as WebSocket from 'ws';

export class WebSocketTransport implements ConnectionTransport {
  static create(url: string, timeout?: number): Promise<WebSocketTransport> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url, [], {
        perMessageDeflate: false,
        maxPayload: 256 * 1024 * 1024, // 256Mb
        handshakeTimeout: timeout,
      });

      ws.addEventListener('open', () => resolve(new WebSocketTransport(ws)));
      ws.addEventListener('error', reject);
    });
  }

  private _ws: WebSocket;
  onmessage?: (message: string) => void;
  onclose?: () => void;

  constructor(ws: WebSocket) {
    this._ws = ws;
    this._ws.addEventListener('message', (event) => {
      if (this.onmessage) this.onmessage.call(null, event.data);
    });
    this._ws.addEventListener('close', () => {
      if (this.onclose) this.onclose.call(null);
    });
    // Silently ignore all errors - we don't know what to do with them.
    this._ws.addEventListener('error', () => {});
    this.onmessage = null;
    this.onclose = null;
  }

  send(message: string): void {
    this._ws.send(message);
  }

  close(): void {
    this._ws.close();
  }
}
