import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const PetTable = ({ pets, onEdit, onDelete }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Tên</TableCell>
                        <TableCell>Tuổi</TableCell>
                        <TableCell>Loài</TableCell>
                        <TableCell>Màu sắc</TableCell>
                        <TableCell>Mô tả</TableCell>
                        <TableCell>Thao tác</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pets.map((pet) => (
                        <TableRow key={pet.id}>
                            <TableCell>{pet.name}</TableCell>
                            <TableCell>{pet.age}</TableCell>
                            <TableCell>{pet.species}</TableCell>
                            <TableCell>{pet.color}</TableCell>
                            <TableCell>{pet.description}</TableCell>
                            <TableCell>
                                <Button color="primary" onClick={() => onEdit(pet)}>Sửa</Button>
                                <Button color="error" onClick={() => onDelete(pet.id)}>Xóa</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PetTable;
