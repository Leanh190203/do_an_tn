import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const PetTable = ({ pets, onEdit, onDelete }) => (
    <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Tên Thú Cưng</TableCell>
                    <TableCell>Loài</TableCell>
                    <TableCell>Tuổi</TableCell>
                    <TableCell>Hành Động</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {pets.map((pet) => (
                    <TableRow key={pet.id}>
                        <TableCell>{pet.id}</TableCell>
                        <TableCell>{pet.name}</TableCell>
                        <TableCell>{pet.species}</TableCell>
                        <TableCell>{pet.age}</TableCell>
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

export default PetTable;
