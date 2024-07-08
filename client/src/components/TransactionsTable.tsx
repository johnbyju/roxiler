import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HostConnection from '../HostConnection';

interface Transaction {
  id: string;
  title: string;
  description: string;
  price: number;
  dateOfSale: string;
  sold: boolean;
  category: string;
}

const TransactionsTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [month, setMonth] = useState<string>('03');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`http://localhost:5000/roxiler/listtransaction`, {
        params: { month,page,search,},
      });
      setTransactions(data.transactions);
    };

    fetchData();
  }, [month, search, page]);

  return (
    <div>
      <select value={month} onChange={(e) => setMonth(e.target.value)}>
        {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => (
          <option key={m} value={m}>{new Date(2023, parseInt(m) - 1, 1).toLocaleString('default', { month: 'long' })}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Previous
      </button>
      <button onClick={() => setPage(page + 1)}>
        Next
      </button>
    </div>
  );
};

export default TransactionsTable;
