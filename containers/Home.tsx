import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useEventSubscription from '@/hooks/useEventSubscription';

interface Data {
  some: string;
  timestamp: string;
}

const Home = () => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth');
    },
  });
  const [myData, setMyData] = useState<Data[]>([]);

  const data = useEventSubscription({ channel: 'default/channel' });
  useEffect(() => {
    if (data) {
      setMyData([...myData, data]);
    }
  }, [data]);

  if (status !== 'authenticated') return null;

  return (
    <main>
      Receive data from App Sync:
      <ul>
        {myData.map((event, index) => (
          <li key={index}>{JSON.stringify(event)}</li>
        ))}
      </ul>
      <button onClick={() => signOut()}>Log out</button>
    </main>
  );
};

export default Home;
