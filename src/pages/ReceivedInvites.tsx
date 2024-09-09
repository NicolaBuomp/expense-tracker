// src/pages/ReceivedInvites.tsx
import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

interface Invite {
  id: string;
  senderId: string;
  receiverEmail: string;
  status: string;
}

const ReceivedInvites: React.FC = () => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const { currentUser } = useAuth()!;

  useEffect(() => {
    if (!currentUser) return;

    const fetchInvites = async () => {
      const invitesCollection = collection(db, 'invites');
      const q = query(invitesCollection, where('receiverEmail', '==', currentUser.email), where('status', '==', 'pending'));
      const querySnapshot = await getDocs(q);

      const fetchedInvites = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Invite[];

      setInvites(fetchedInvites);
    };

    fetchInvites();
  }, [currentUser]);

  const handleAcceptInvite = async (invite: Invite) => {
    if (!currentUser) return;

    try {
      // Crea una nuova coppia nella raccolta "couples"
      const coupleRef = await addDoc(collection(db, 'couples'), {
        userIds: [invite.senderId, currentUser.uid],  // Assicura che entrambi gli utenti siano inclusi
        createdAt: new Date(),
      });

      // Aggiorna lo stato dell'invito a "accepted"
      await updateDoc(doc(db, 'invites', invite.id), { status: 'accepted' });

      setInvites((prevInvites) => prevInvites.filter((i) => i.id !== invite.id));

      toast.success('Invito accettato! La coppia è stata creata.');

      // Opzionale: Aggiorna lo stato globale o ridireziona l'utente
    } catch (error) {
      console.error('Errore durante l\'accettazione dell\'invito:', error);
      toast.error('Errore durante l\'accettazione dell\'invito. Riprova.');
    }
  };

  const handleDeclineInvite = async (invite: Invite) => {
    try {
      // Elimina l'invito dalla raccolta "invites"
      await deleteDoc(doc(db, 'invites', invite.id));

      setInvites((prevInvites) => prevInvites.filter((i) => i.id !== invite.id));
      toast.info('Invito rifiutato.');
    } catch (error) {
      console.error('Errore durante il rifiuto dell\'invito:', error);
    }
  };

  return (
    <div>
      <h2>Inviti Ricevuti</h2>
      {invites.length > 0 ? (
        invites.map((invite) => (
          <div key={invite.id}>
            <p>Invito ricevuto da: {invite.receiverEmail}</p>
            <button onClick={() => handleAcceptInvite(invite)}>Accetta</button>
            <button onClick={() => handleDeclineInvite(invite)}>Rifiuta</button>
          </div>
        ))
      ) : (
        <p>Non hai inviti in sospeso.</p>
      )}
    </div>
  );
};

export default ReceivedInvites;
