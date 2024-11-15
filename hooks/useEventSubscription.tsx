import { useEffect, useState } from 'react';
import { EventsChannel } from 'aws-amplify/api';
import { events } from 'aws-amplify/data';

interface Data {
  some: string;
  timestamp: string;
}

interface Event {
  id: string;
  type: string;
  event: Data;
}

const useEventSubscription = ({ channel }: { channel: string }) => {
  const [event, setEvent] = useState<Event>();

  useEffect(() => {
    if (!channel) return;
    let eventsChannel: EventsChannel;
    const connectAndSubscribe = async () => {
      eventsChannel = await events.connect(channel);

      eventsChannel.subscribe({
        next: (data) => {
          const now = Date.now();
          setEvent({ ...data, now });
        },
        error: (err) => console.error('error', err),
      });
    };

    connectAndSubscribe();

    return () => {
      eventsChannel && eventsChannel.close();
    };
  }, [channel]);

  return event?.event;
};

export default useEventSubscription;
