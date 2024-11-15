import { useEffect, useState } from 'react';
import { EventsChannel } from 'aws-amplify/api';
import { events } from 'aws-amplify/data';

import {
  socketEmitter,
  AppSyncEvent,
} from '@/lib-client/EventEmitter';

interface Data {
  some: string;
  timestamp: string;
}

interface Event {
  id: string;
  type: string;
  event: Data;
}

const DEFAULT_CHANNEL = 'default/channel';

const useEventSubscription = () => {
  useEffect(() => {
    let eventsChannel: EventsChannel;
    const connectAndSubscribe = async () => {
      eventsChannel = await events.connect(DEFAULT_CHANNEL);

      eventsChannel.subscribe({
        next: (data: { event: AppSyncEvent }) => {
          try {
            const parsedData = JSON.parse(data.event.data as unknown as string);
            socketEmitter.emit(data.event.type, parsedData);
          } catch (err) {
            console.error('error', err);
          }
        },
        error: (err) => console.error('error', err),
      });
    };

    connectAndSubscribe();

    return () => {
      eventsChannel && eventsChannel.close();
    };
  }, []);
};

export default useEventSubscription;
