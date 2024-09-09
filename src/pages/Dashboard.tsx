import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import useCoupleId from '../hooks/useCoupleId';
import AddExpense from '../components/AddExpense';
import ExpensesList from '../components/ExpensesList';

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth()!;
  const navigate = useNavigate();
  const { coupleId, loading } = useCoupleId();  // Utilizzo dell'hook per ottenere l'ID della coppia

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');  // Reindirizza alla pagina di login dopo il logout
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  useEffect(() => {
    if (!loading && !coupleId) {
      // Aggiungi logica per gestire il caso in cui non ci sia una coppia
      console.log('Non fai parte di nessuna coppia. Invita un partner.');
    }
  }, [loading, coupleId]);

  if (loading) {
    return <div>Loading...</div>;  // Mostra uno stato di caricamento mentre l'ID della coppia viene recuperato
  }

  return (
    <div>
      <h1>Benvenuto, {currentUser?.email}</h1>
      <button onClick={() => navigate('/invite-partner')}>Invita un partnet</button>
      <button onClick={() => navigate('/received-invites')}>Visualizza inviti</button>
      <button onClick={handleLogout}>Logout</button>

      {/* Mostra i componenti solo se la coppia esiste */}
      {coupleId ? (
        <>
          {/* Aggiungi Spese */}
          <AddExpense coupleId={coupleId} />

          {/* Lista delle Spese Condivise */}
          <ExpensesList coupleId={coupleId} />
        </>
      ) : (
        <p>Non fai parte di nessuna coppia. Invita un partner per iniziare a condividere le spese!</p>
      )}
    </div>
  );
};

export default Dashboard;
