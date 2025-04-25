// src/pages/OrdersPage.tsx
import React from 'react';

const OrdersPage = () => {
  const orders = [
    { id: 'DH001', status: 'Đã giao', total: 500000 },
    { id: 'DH002', status: 'Đang xử lý', total: 320000 }
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Đơn hàng</h2>
      {orders.map(order => (
        <div key={order.id} className="border p-4 rounded mb-2 shadow">
          <p>ID: {order.id}</p>
          <p>Trạng thái: {order.status}</p>
          <p>Tổng tiền: {order.total}₫</p>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
