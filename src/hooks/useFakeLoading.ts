import { useEffect, useState } from 'react';

export const useFakeLoading = (delay = 350) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return loading;
};

export default useFakeLoading;
