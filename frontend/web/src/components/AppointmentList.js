// src/pages/AppointmentList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        // Gọi API để lấy danh sách lịch khám hẹn
        axios.get('/appointments')
            .then(response => {
                setAppointments(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the appointments!", error);
            });
    }, []);

    return (
        <div>
            <h2>Lịch khám hẹn</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Thú cưng</th>
                        <th>Khách hàng</th>
                        <th>Ngày giờ</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map(appointment => (
                        <tr key={appointment.id}>
                            <td>{appointment.id}</td>
                            <td>{appointment.pet_id}</td>
                            <td>{appointment.customer_id}</td>
                            <td>{appointment.appointment_date}</td>
                            <td>{appointment.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentList;
