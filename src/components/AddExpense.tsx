// src/components/AddExpense.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

interface AddExpenseProps {
  coupleId: string;  // L'ID della coppia a cui aggiungere la spesa
}

const AddExpense: React.FC<AddExpenseProps> = ({ coupleId }) => {
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const { currentUser } = useAuth()!;

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    try {
      const docRef = await addDoc(collection(db, 'expenses'), {
        coupleId,
        payerId: currentUser.uid,
        amount,
        description,
        createdAt: Timestamp.fromDate(new Date()),
      });

      console.log('Spesa aggiunta con ID:', docRef.id); // Log per confermare l'aggiunta
      toast.success('Spesa aggiunta con successo!');

      setMessage('Spesa aggiunta con successo!');
      setAmount(0);
      setDescription('');
    } catch (error) {
      console.error('Errore durante l\'aggiunta della spesa:', error);
      setMessage('Errore durante l\'aggiunta della spesa. Riprova.');
    }
  };

  return (
    <div>
      <h3>Aggiungi una Spesa</h3>
      <form onSubmit={handleAddExpense}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Importo"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrizione"
          required
        />
        <button type="submit">Aggiungi Spesa</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddExpense;
