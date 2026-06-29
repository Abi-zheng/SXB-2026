import { useCallback, useEffect, useState } from 'react';
import { fetchOrderHall } from '../api';

/** 提醒中心角标：待跟进提醒数 */
export function useOrderHallBadge() {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchOrderHall();
      setCount(data.reminder_count);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 8000);
    return () => clearInterval(timer);
  }, [refresh]);

  return count;
}
