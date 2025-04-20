import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const PetForm = ({ onSubmit, initialData }) => {
    const [pet, setPet] = useState(initialData || { name: '', age: '', species: '', color: '', description: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPet({ ...pet, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(pet);
        setPet({ name: '', age: '', species: '', color: '', description: '' }); // Reset form
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Tên thú cưng" name="name" value={pet.name} onChange={handleChange} fullWidth />
            <TextField label="Tuổi" name="age" type="number" value={pet.age} onChange={handleChange} fullWidth />
            <TextField label="Loài" name="species" value={pet.species} onChange={handleChange} fullWidth />
            <TextField label="Màu sắc" name="color" value={pet.color} onChange={handleChange} fullWidth />
            <TextField
                label="Mô tả"
                name="description"
                value={pet.description}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
            />
            <Button variant="contained" color="primary" type="submit">
                {initialData ? 'Cập nhật' : 'Thêm thú cưng'}
            </Button>
        </Box>
    );
};

export default PetForm;
