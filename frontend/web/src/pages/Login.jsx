import React, { useState } from 'react';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('⚠️ Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Lưu token vào localStorage
        localStorage.setItem('token', data.token);

        alert(`🎉 Đăng nhập thành công! Xin chào, ${data.user.name}`);
        // Optional: chuyển hướng sau khi đăng nhập
        // window.location.href = '/dashboard';
      } else {
        setError(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      setError('❌ Không thể kết nối tới máy chủ!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Đăng Nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn">Đăng Nhập</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
