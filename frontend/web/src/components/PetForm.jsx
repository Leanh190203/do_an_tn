import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';

const PetForm = ({ onSubmit, initialData }) => {
    // Khởi tạo state cho thông tin thú cưng với các trường phù hợp model
    const [pet, setPet] = useState({ name: '', species: '', age: '' });

    useEffect(() => {
        if (initialData) {
            setPet(initialData);  // Cập nhật giá trị cho form khi có dữ liệu chỉnh sửa
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPet({ ...pet, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gọi hàm onSubmit để thêm hoặc cập nhật thú cưng
        onSubmit(pet);
        setPet({ name: '', species: '', age: '' }); // Reset form sau khi submit
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
                label="Tên Thú Cưng" 
                name="name" 
                value={pet.name} 
                onChange={handleChange} 
                required 
            />
            <TextField 
                label="Loài" 
                name="species" 
                value={pet.species} 
                onChange={handleChange} 
                required 
            />
            <TextField 
                label="Tuổi" 
                name="age" 
                value={pet.age} 
                onChange={handleChange} 
                type="number" // Đảm bảo giá trị tuổi là số
                required 
            />
            <Button type="submit" variant="contained" color="primary">
                {initialData ? 'Cập Nhật' : 'Thêm'}
            </Button>
        </Box>
    );
};

export default PetForm;
