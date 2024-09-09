// src/pages/InvitePartner.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

const InvitePartner: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const { currentUser } = useAuth()!;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    try {
      // Aggiungi un invito alla raccolta "invites"
      await addDoc(collection(db, 'invites'), {
        senderId: currentUser.uid,
        receiverEmail: email,
        status: 'pending',
      });

      setMessage('Invito inviato con successo!');
    } catch (error) {
      console.error('Errore durante l\'invio dell\'invito:', error);
      setMessage('Errore durante l\'invio dell\'invito. Riprova.');
    }
  };

  return (
    <div>
      <h2>Invita il tuo partner</h2>
      <form onSubmit={handleInvite}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email del partner"
          required
        />
        <button type="submit">Invia Invito</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default InvitePartner;
