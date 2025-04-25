// src/pages/ShopOrdersPage.tsx
import React from 'react';

const ShopOrdersPage = () => {
  const orders = [
    { id: 'SP001', product: 'Giày sneaker', status: 'Chờ giao' },
    { id: 'SP002', product: 'Túi xách', status: 'Đã giao' }
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Đơn hàng từ shop</h2>
      {orders.map(order => (
        <div key={order.id} className="border p-2 rounded shadow mb-2">
          <p>Sản phẩm: {order.product}</p>
          <p>Trạng thái: {order.status}</p>
        </div>
      ))}
    </div>
  );
};

export default ShopOrdersPage;
