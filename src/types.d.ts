import { WebSocket } from '@advanced-rest-client/arc-types';

export declare interface ViewConnectionResult extends WebSocket.WebsocketConnectionResult {
  sizeLabel: string;
  logs: ViewWebsocketLog[];
}

export declare interface ViewWebsocketLog extends WebSocket.WebsocketLog {
  isBinary: boolean;
  sizeLabel: string;
  isoTime: string;
}
