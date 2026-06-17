import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './firebase-init'; // Adjust path to your firebase config

export function useFirestoreCollection(collectionName, orderByField = 'createdAt', orderDir = 'desc') {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy(orderByField, orderDir));
    
    // onSnapshot sets up a real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(docs);
      setLoading(false);
    }, (err) => {
      console.error(`Error fetching ${collectionName}:`, err);
      setError(err);
      setLoading(false);
    });

    // Cleanup listener on unmount (guard in case unsubscribe is undefined)
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [collectionName, orderByField, orderDir]);

  return { data, loading, error };
}