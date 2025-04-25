// src/pages/CheckoutPage.tsx
import React from 'react';

const CheckoutPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Thanh toán</h2>
      <form className="space-y-4">
        <input className="w-full border p-2 rounded" placeholder="Địa chỉ giao hàng" />
        <select className="w-full border p-2 rounded">
          <option>COD</option>
          <option>Ví ShopeePay</option>
        </select>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Xác nhận thanh toán</button>
      </form>
    </div>
  );
};

export default CheckoutPage;
