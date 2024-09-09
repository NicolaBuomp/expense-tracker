// src/components/ExpensesList.tsx
import React, { useEffect, useState } from 'react';
import { db } from '..//services/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface Expense {
  id: string;
  amount: number;
  description: string;
  payerId: string;
  createdAt: any;
}

interface ExpensesListProps {
  coupleId: string;  // L'ID della coppia a cui appartengono le spese
}

const ExpensesList: React.FC<ExpensesListProps> = ({ coupleId }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minAmount, setMinAmount] = useState<number | undefined>();
  const [maxAmount, setMaxAmount] = useState<number | undefined>();
  const { currentUser } = useAuth()!;

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expensesCollection = collection(db, 'expenses');
        const q = query(expensesCollection, where('coupleId', '==', coupleId), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const fetchedExpenses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Expense[];

        console.log('Spese recuperate:', fetchedExpenses);  // Log per confermare il recupero delle spese
        setExpenses(fetchedExpenses);
        setFilteredExpenses(fetchedExpenses);
      } catch (error) {
        console.error('Errore durante il recupero delle spese:', error);
      }
    };

    fetchExpenses();
  }, [coupleId]);

  // Funzione per filtrare le spese in base ai criteri di ricerca
  useEffect(() => {
    const filterExpenses = () => {
      let filtered = expenses;

      if (searchTerm) {
        filtered = filtered.filter((expense) =>
          expense.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (minAmount !== undefined) {
        filtered = filtered.filter((expense) => expense.amount >= minAmount);
      }

      if (maxAmount !== undefined) {
        filtered = filtered.filter((expense) => expense.amount <= maxAmount);
      }

      setFilteredExpenses(filtered);
    };

    filterExpenses();
  }, [searchTerm, minAmount, maxAmount, expenses]);

  const calculateBalances = () => {
    if (!currentUser) return { userTotal: 0, partnerTotal: 0 };

    let userTotal = 0;
    let partnerTotal = 0;

    filteredExpenses.forEach((expense) => {
      console.log(expense);
      
      if (expense.payerId === currentUser.uid) {
        userTotal += expense.amount;
      } else {
        partnerTotal += expense.amount;
      }
    });

    return { userTotal, partnerTotal };
  };

  const { userTotal, partnerTotal } = calculateBalances();
  const balance = (userTotal - partnerTotal) / 2;  // Calcolo di quanto ciascuno deve all'altro

  return (
    <div>
      <h3>Spese Condivise</h3>

      {/* Filtri di Ricerca */}
      <div>
        <input
          type="text"
          placeholder="Cerca per descrizione..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          placeholder="Importo minimo"
          value={minAmount || ''}
          onChange={(e) => setMinAmount(Number(e.target.value) || undefined)}
        />
        <input
          type="number"
          placeholder="Importo massimo"
          value={maxAmount || ''}
          onChange={(e) => setMaxAmount(Number(e.target.value) || undefined)}
        />
      </div>

      {filteredExpenses.length > 0 ? (
        <ul>
          {filteredExpenses.map((expense) => (
            <li key={expense.id}>
              {expense.description}: ${expense.amount} pagato da {expense.payerId === currentUser?.uid ? 'te' : 'il partner'}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nessuna spesa trovata.</p>
      )}
      
      <h4>Riepilogo</h4>
      <p>Hai pagato: ${userTotal}</p>
      <p>Il partner ha pagato: ${partnerTotal}</p>
      <p>{balance > 0 ? `Devi ricevere $${balance}` : `Devi $${Math.abs(balance)}`}</p>
    </div>
  );
};

export default ExpensesList;
