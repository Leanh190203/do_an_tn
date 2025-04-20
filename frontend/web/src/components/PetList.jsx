import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import '../styles/PetList.css';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [newPet, setNewPet] = useState({ name: '', species: '', age: '' });
  const [editingPet, setEditingPet] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const data = await apiService.getAllPets();
      setPets(data);
    } catch (err) {
      setError('Không thể tải danh sách thú cưng');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingPet) {
      setEditingPet({ ...editingPet, [name]: value });
    } else {
      setNewPet({ ...newPet, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPet) {
        await apiService.updatePet(editingPet.id, editingPet);
        setEditingPet(null);
      } else {
        await apiService.createPet(newPet);
        setNewPet({ name: '', species: '', age: '' });
      }
      await loadPets();
    } catch (err) {
      setError('Không thể lưu thông tin thú cưng');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa thú cưng này?')) {
      try {
        await apiService.deletePet(id);
        await loadPets();
      } catch (err) {
        setError('Không thể xóa thú cưng');
      }
    }
  };

  return (
    <div className="pet-list-container">
      <h2>Quản lý thú cưng</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="pet-form">
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Tên thú cưng"
            value={editingPet ? editingPet.name : newPet.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="species"
            placeholder="Loài"
            value={editingPet ? editingPet.species : newPet.species}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="age"
            placeholder="Tuổi"
            value={editingPet ? editingPet.age : newPet.age}
            onChange={handleChange}
          />
        </div>
        <button type="submit">
          {editingPet ? 'Cập nhật' : 'Thêm mới'}
        </button>
        {editingPet && (
          <button type="button" onClick={() => setEditingPet(null)}>
            Hủy
          </button>
        )}
      </form>

      <div className="pet-list">
        {pets.map(pet => (
          <div key={pet.id} className="pet-item">
            <div className="pet-info">
              <h3>{pet.name}</h3>
              <p>Loài: {pet.species}</p>
              <p>Tuổi: {pet.age}</p>
            </div>
            <div className="pet-actions">
              <button onClick={() => setEditingPet(pet)}>Sửa</button>
              <button onClick={() => handleDelete(pet.id)}>Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetList;