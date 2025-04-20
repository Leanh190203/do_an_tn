import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Pet Clinic
      </Link>
      <div className="nav-links">
        <Link to="/pets" className="nav-link">
          Quản lý thú cưng
        </Link>
        <Link to="/customers" className="nav-link">
          Quản lý khách hàng
        </Link>
        <button onClick={handleLogout} className="nav-link" style={{ border: 'none', background: 'none' }}>
          Đăng xuất
        </button>
      </div>
    </nav>
  );
};

export default Navigation;