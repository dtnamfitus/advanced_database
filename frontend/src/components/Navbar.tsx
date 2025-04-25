// src/components/Navbar.tsx
import { Link } from "react-router-dom";

const Navbar = () => {
  const links = [
    { path: "/customer", label: "Khách hàng" },
    { path: "/orders", label: "Đơn hàng" },
    { path: "/cart", label: "Giỏ hàng" },
    { path: "/products", label: "Sản phẩm" },
    { path: "/review", label: "Đánh giá" },
    { path: "/wallet", label: "Ví" },
    { path: "/checkout", label: "Thanh toán" },
    { path: "/shop-orders", label: "Đơn shop" },
  ];

  return (
    <nav className="w-full bg-gray-100 border-b border-gray-300 px-4 py-3 flex shadow fixed top-0 left-0 z-10 justify-center">
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className="text-gray-800 hover:bg-gray-800 hover:text-white px-2 py-1 rounded mx-2"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;