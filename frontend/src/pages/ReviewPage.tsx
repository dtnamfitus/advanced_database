// src/pages/ReviewPage.tsx
import React from 'react';

const ReviewPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Đánh giá sản phẩm</h2>
      <form className="space-y-4">
        <textarea className="w-full border p-2 rounded" placeholder="Nhận xét của bạn" />
        <select className="w-full border p-2 rounded">
          <option>1 sao</option>
          <option>2 sao</option>
          <option>3 sao</option>
          <option>4 sao</option>
          <option>5 sao</option>
        </select>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded">Gửi đánh giá</button>
      </form>
    </div>
  );
};

export default ReviewPage;
