// =====================================================
// useHistoryData Hook
// Fetches /energy_history for chart & table display
// =====================================================

import { useState, useEffect } from 'react';
import { ref, onValue, query, limitToLast } from 'firebase/database';
import { db } from '../config/firebase';
import { DB_PATHS } from '../utils/constants';

export default function useHistoryData(limit = 50) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dbRef = query(
      ref(db, DB_PATHS.ENERGY_HISTORY),
      limitToLast(limit)
    );

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const raw = snapshot.val();
          // Convert object to sorted array
          const arr = Object.entries(raw)
            .map(([key, val]) => ({
              id: key,
              ...val,
            }))
            .sort((a, b) => {
              // Sort by timestamp ascending
              const tA = new Date(a.timestamp || 0).getTime();
              const tB = new Date(b.timestamp || 0).getTime();
              return tA - tB;
            });
          setHistory(arr);
        } else {
          setHistory([]);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('[useHistoryData] Error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limit]);

  return { history, loading, error };
}
