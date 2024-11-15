type Listener<T> = (event: T) => void;

export class EventEmitter<T = any> {
  private listeners: Map<string, Listener<T>[]> = new Map();

  on(event: string, listener: Listener<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.push(listener);
    }
  }

  off(event: string, listener: Listener<T>): void {
    if (!this.listeners.has(event)) {
      console.log('no listeners');
      return;
    }

    const listeners = this.listeners.get(event);
    if (listeners) {
      const filteredListeners = listeners.filter((cb) => cb !== listener);
      this.listeners.set(event, filteredListeners);
    }
  }

  emit(event: string, data: T): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }
}

export interface SocketEvent {
  msg: object;
}

export interface AppSyncEvent {
  type: AppSyncEventType;
  data: TokenEventData | TradeEventData | CommentEventData;
}

export enum AppSyncEventType {
  TOKEN_CREATED = 'TokenCreated',
  TOKEN_MIGRATED = 'TokenMigrated',
  TRADE = 'Trade',
  COMMENT = 'Comment',
}

export interface TokenEventData {
  id: number;
  name: string;
  ticker: string;
  description: string;
  address: string;
  createdBy: string;
  lastBuy: number;
  lastComment: number;
  lastFeatured: number;
  totalComments: number;
  lastPrice: number;
  initPrice: number;
  initMcap: number;
  poolId: string;
  lastMcap: number;
  imageUrl: string;
  telegramUrl: string;
  websiteUrl: string;
  twitterUrl: string;
  createdAt: number;
  creator: any;
}

export interface TradeEventData {
  token: TokenEventData;
  lastMcap: number;
  lastPrice: number;
  senderAddress: any;
  isBuy: boolean;
  amountIn: number;
  amountOut: number;
  txHash: string;
  timestamp: number;
}

export interface CommentEventData {
  token: TokenEventData;
  message: string;
  imageUrl?: string;
  senderAddress: any;
  timestamp: number;
}
export const socketEmitter = new EventEmitter<any>();
