// src/hooks/useCoupleId.ts
import { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const useCoupleId = () => {
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentUser } = useAuth()!;

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchCoupleId = async () => {
      try {
        // Query per cercare una coppia in cui l'utente corrente è presente
        const couplesCollection = collection(db, 'couples');
        const q = query(couplesCollection, where('userIds', 'array-contains', currentUser.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const coupleDoc = querySnapshot.docs[0];
          setCoupleId(coupleDoc.id);  // Imposta l'ID della coppia
        } else {
          setCoupleId(null);  // Nessuna coppia trovata per l'utente
        }
      } catch (error) {
        console.error('Errore durante il recupero dell\'ID della coppia:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupleId();
  }, [currentUser]);

  return { coupleId, loading };
};

export default useCoupleId;
