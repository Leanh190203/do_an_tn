import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import '../styles/CustomerList.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerPets, setCustomerPets] = useState([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await apiService.getAllCustomers();
      setCustomers(data);
    } catch (err) {
      setError('Không thể tải danh sách khách hàng');
    }
  };

  const loadCustomerPets = async (customerId) => {
    try {
      const data = await apiService.getCustomerPets(customerId);
      setCustomerPets(data);
    } catch (err) {
      setError('Không thể tải danh sách thú cưng của khách hàng');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingCustomer) {
      setEditingCustomer({ ...editingCustomer, [name]: value });
    } else {
      setNewCustomer({ ...newCustomer, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await apiService.updateCustomer(editingCustomer.id, editingCustomer);
        setEditingCustomer(null);
      } else {
        await apiService.createCustomer(newCustomer);
        setNewCustomer({ name: '', phone: '', email: '' });
      }
      await loadCustomers();
    } catch (err) {
      setError('Không thể lưu thông tin khách hàng');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa khách hàng này?')) {
      try {
        await apiService.deleteCustomer(id);
        await loadCustomers();
      } catch (err) {
        setError('Không thể xóa khách hàng');
      }
    }
  };

  const handleViewPets = async (customer) => {
    setSelectedCustomer(customer);
    await loadCustomerPets(customer.id);
  };

  return (
    <div className="customer-list-container">
      <h2>Quản lý khách hàng</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="customer-form">
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Tên khách hàng"
            value={editingCustomer ? editingCustomer.name : newCustomer.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={editingCustomer ? editingCustomer.phone : newCustomer.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={editingCustomer ? editingCustomer.email : newCustomer.email}
            onChange={handleChange}
          />
        </div>
        <button type="submit">
          {editingCustomer ? 'Cập nhật' : 'Thêm mới'}
        </button>
        {editingCustomer && (
          <button type="button" onClick={() => setEditingCustomer(null)}>
            Hủy
          </button>
        )}
      </form>

      <div className="customer-list">
        {customers.map(customer => (
          <div key={customer.id} className="customer-item">
            <div className="customer-info">
              <h3>{customer.name}</h3>
              <p>SĐT: {customer.phone}</p>
              <p>Email: {customer.email}</p>
            </div>
            <div className="customer-actions">
              <button onClick={() => setEditingCustomer(customer)}>Sửa</button>
              <button onClick={() => handleDelete(customer.id)}>Xóa</button>
              <button onClick={() => handleViewPets(customer)}>Xem thú cưng</button>
            </div>
          </div>
        ))}
      </div>

      {selectedCustomer && (
        <div className="customer-pets-modal">
          <div className="modal-content">
            <h3>Thú cưng của {selectedCustomer.name}</h3>
            <div className="pets-list">
              {customerPets.map(pet => (
                <div key={pet.id} className="pet-item">
                  <p>Tên: {pet.name}</p>
                  <p>Loài: {pet.species}</p>
                  <p>Tuổi: {pet.age}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedCustomer(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;