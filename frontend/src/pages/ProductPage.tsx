// src/pages/ProductPage.tsx
import React from 'react';

const ProductPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quản lý sản phẩm</h2>
      <form className="space-y-4">
        <input className="w-full border p-2 rounded" placeholder="Tên sản phẩm" />
        <input className="w-full border p-2 rounded" placeholder="Giá bán" />
        <input className="w-full border p-2 rounded" placeholder="Mô tả" />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Tạo sản phẩm</button>
      </form>
    </div>
  );
};

export default ProductPage;
