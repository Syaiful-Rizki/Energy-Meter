// =====================================================
// useRealtimeData Hook
// Subscribes to /energy_meter for live sensor readings
// =====================================================

import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import { DB_PATHS } from '../utils/constants';

export default function useRealtimeData() {
  const [data, setData] = useState({
    voltage: null,
    current: null,
    power: null,
    energy: null,
    status: 'offline',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const dbRef = ref(db, DB_PATHS.ENERGY_METER);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          setData({
            voltage: val.voltage ?? null,
            current: val.current ?? null,
            power: val.power ?? null,
            energy: val.energy ?? null,
            status: val.status ?? 'offline',
          });
          setLastUpdated(new Date().toISOString());
        } else {
          setData({
            voltage: null,
            current: null,
            power: null,
            energy: null,
            status: 'offline',
          });
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('[useRealtimeData] Error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { data, loading, error, lastUpdated };
}
