import { CommentEvent } from './CommentEvent';

export enum OffChainEvent {
  POST_COMMENT = 'POST_COMMENT',
}

export type OffChainMessage = {
  type: OffChainEvent;
  msg: CommentEvent;
};
