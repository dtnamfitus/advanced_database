// src/pages/CustomerPage.tsx
import React from 'react';

const CustomerPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Thông tin khách hàng</h2>
      <form className="space-y-4">
        <input className="w-full border p-2 rounded" placeholder="Tên khách hàng" />
        <input className="w-full border p-2 rounded" placeholder="Địa chỉ" />
        <select className="w-full border p-2 rounded">
          <option>Hạng Bạc</option>
          <option>Hạng Vàng</option>
          <option>Hạng Kim Cương</option>
        </select>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Lưu</button>
      </form>
    </div>
  );
};

export default CustomerPage;
