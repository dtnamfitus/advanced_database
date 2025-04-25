// src/pages/WalletPage.tsx
import React from 'react';

const WalletPage = () => {
  const balance = 1230000;
  const transactions = [
    { id: 'GD01', type: 'Nạp', amount: 500000 },
    { id: 'GD02', type: 'Chi tiêu', amount: -100000 }
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Ví của tôi</h2>
      <p>Số dư hiện tại: {balance}₫</p>
      <h3 className="mt-4 font-semibold">Giao dịch gần đây</h3>
      {transactions.map(tx => (
        <div key={tx.id} className="border p-2 rounded my-2 shadow">
          <p>{tx.type}: {tx.amount}₫</p>
        </div>
      ))}
    </div>
  );
};

export default WalletPage;
