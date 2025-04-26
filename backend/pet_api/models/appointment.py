from models import db
from datetime import datetime

class Appointment(db.Model):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id', ondelete='CASCADE'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id', ondelete='CASCADE'), nullable=False)
    appointment_date = db.Column(db.DateTime, nullable=False)
    service = db.Column(db.String(100), nullable=False)
    notes = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, cancelled, completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Thêm các trường mới
    diagnosis = db.Column(db.Text)  # Chẩn đoán/triệu chứng
    clinic = db.Column(db.String(100))  # Phòng khám được chỉ định
    reminder_sent = db.Column(db.Boolean, default=False)  # Đã gửi nhắc nhở chưa
    follow_up_date = db.Column(db.DateTime)  # Ngày tái khám tiếp theo
    completed_by = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'))  # Người hoàn thành lịch hẹn

    # Relationships
    pet = db.relationship('Pet', backref='appointments')
    customer = db.relationship('Customer', backref='appointments')
    staff = db.relationship('User', foreign_keys=[completed_by], backref='completed_appointments')

    def to_dict(self):
        # Lấy thông tin về chủ thú và thú cưng
        pet_info = {
            'id': self.pet.id,
            'name': self.pet.name,
            'species': self.pet.species,
            'age': self.pet.age
        } if self.pet else None
        
        customer_info = {
            'id': self.customer.id,
            'name': self.customer.name,
            'phone': self.customer.phone
        } if self.customer else None
        
        # Xác định trạng thái thời gian (quá khứ hay tương lai)
        now = datetime.now()
        is_upcoming = self.appointment_date > now if self.appointment_date else False
        
        # Định dạng thời gian cụ thể
        formatted_date = None
        if self.appointment_date:
            formatted_date = self.appointment_date.strftime("%d/%m/%Y")
        formatted_time = None
        if self.appointment_date:
            formatted_time = self.appointment_date.strftime("%H:%M")
            
        return {
            'id': self.id,
            'pet_id': self.pet_id,
            'customer_id': self.customer_id,
            'petName': self.pet.name if self.pet else None,
            'customerName': self.customer.name if self.customer else None,
            'phone': self.customer.phone if self.customer else None,
            'appointment_date': self.appointment_date.isoformat() if self.appointment_date else None,
            'formatted_date': formatted_date,
            'formatted_time': formatted_time,
            'service': self.service,
            'notes': self.notes,
            'status': self.status,
            'is_upcoming': is_upcoming,
            'diagnosis': self.diagnosis,
            'clinic': self.clinic,
            'follow_up_date': self.follow_up_date.isoformat() if self.follow_up_date else None,
            'pet': pet_info,
            'customer': customer_info,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }