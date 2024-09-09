// src/components/ExpenseReport.tsx
import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Expense {
  id: string;
  amount: number;
  description: string;
  payerId: string;
  createdAt: any;
}

interface ExpenseReportProps {
  coupleId: string;  // L'ID della coppia
}

const ExpenseReport: React.FC<ExpenseReportProps> = ({ coupleId }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reportExpenses, setReportExpenses] = useState<Expense[]>([]);

  const generateReport = async () => {
    if (!startDate || !endDate) {
      return;
    }

    const expensesCollection = collection(db, 'expenses');
    const q = query(
      expensesCollection,
      where('coupleId', '==', coupleId),
      where('createdAt', '>=', new Date(startDate)),
      where('createdAt', '<=', new Date(endDate))
    );

    const querySnapshot = await getDocs(q);

    const fetchedExpenses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Expense[];

    setReportExpenses(fetchedExpenses);
  };

  return (
    <div>
      <h3>Genera Report delle Spese</h3>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button onClick={generateReport}>Genera Report</button>

      <h4>Report delle Spese</h4>
      {reportExpenses.length > 0 ? (
        <ul>
          {reportExpenses.map((expense) => (
            <li key={expense.id}>
              {expense.description}: ${expense.amount}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nessuna spesa trovata per il periodo selezionato.</p>
      )}
    </div>
  );
};

export default ExpenseReport;
