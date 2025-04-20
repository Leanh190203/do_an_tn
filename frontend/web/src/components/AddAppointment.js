// src/pages/AddAppointment.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddAppointment.css';  // Import file CSS vào đây

const AddAppointment = () => {
    const [petId, setPetId] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [status, setStatus] = useState('Pending');

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            pet_id: petId,
            customer_id: customerId,
            appointment_date: appointmentDate,
            status: status,
        };

        axios.post('/appointments', data)
            .then(response => {
                alert('Lịch khám hẹn đã được thêm!');
                // Reset form fields
                setPetId('');
                setCustomerId('');
                setAppointmentDate('');
                setStatus('Pending');
            })
            .catch(error => {
                console.error("Có lỗi khi thêm lịch khám hẹn!", error);
            });
    };

    return (
        <div className="add-appointment-container">
            <h2>Thêm lịch khám hẹn</h2>
            <form onSubmit={handleSubmit}>
                <label>Pet ID:</label>
                <input type="text" value={petId} onChange={(e) => setPetId(e.target.value)} required />
                
                <label>Customer ID:</label>
                <input type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required />
                
                <label>Ngày giờ:</label>
                <input
                    type="datetime-local"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                />
                
                <label>Trạng thái:</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                    <option value="Pending">Chờ</option>
                    <option value="Completed">Hoàn thành</option>
                    <option value="Canceled">Hủy bỏ</option>
                </select>
                
                <button type="submit">Thêm lịch khám hẹn</button>
            </form>
        </div>
    );
};

export default AddAppointment;
