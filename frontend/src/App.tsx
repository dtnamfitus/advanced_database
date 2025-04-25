// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CustomerPage from './pages/CustomerPage';
import OrdersPage from './pages/OrdersPage';
import CartPage from './pages/CartPage';
import ProductPage from './pages/ProductPage';
import ReviewPage from './pages/ReviewPage';
import WalletPage from './pages/WalletPage';
import CheckoutPage from './pages/CheckoutPage';
import ShopOrdersPage from './pages/ShopOrdersPage';

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<div className="text-center p-6 text-xl">Chọn đường dẫn bằng menu phía trên</div>} />
      <Route path="/customer" element={<CustomerPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/shop-orders" element={<ShopOrdersPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
