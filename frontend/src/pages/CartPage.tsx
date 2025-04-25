// src/pages/CartPage.tsx
import React from 'react';

const CartPage = () => {
  const cartItems = [
    { name: 'Áo thun', quantity: 2, price: 150000 },
    { name: 'Quần jeans', quantity: 1, price: 250000 }
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Giỏ hàng</h2>
      {cartItems.map((item, idx) => (
        <div key={idx} className="flex justify-between border p-2 mb-2 rounded shadow">
          <span>{item.name} x {item.quantity}</span>
          <span>{item.price * item.quantity}₫</span>
        </div>
      ))}
    </div>
  );
};

export default CartPage;
