import { useState, useEffect } from 'react';

interface RelativeTimeProps {
  timestamp: number;
}

const RelativeTime: React.FC<RelativeTimeProps> = ({ timestamp }) => {
  const calculateRelativeTime = () => {
    const now = new Date().getTime();
    const targetTime = new Date(timestamp).getTime();
    const difference = now - targetTime;

    if (difference < 0) return 'In the future';

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years}y ago`;
    if (months > 0) return `${months}m ago`;
    if (weeks > 0) return `${weeks}w ago`;
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  const [relativeTime, setRelativeTime] = useState(calculateRelativeTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setRelativeTime(calculateRelativeTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [timestamp]);

  return <span>{relativeTime}</span>;
};

export default RelativeTime;
