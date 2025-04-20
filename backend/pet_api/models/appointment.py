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

    # Relationships
    pet = db.relationship('Pet', backref='appointments')
    customer = db.relationship('Customer', backref='appointments')

    def to_dict(self):
        return {
            'id': self.id,
            'pet_id': self.pet_id,
            'customer_id': self.customer_id,
            'petName': self.pet.name,
            'customerName': self.customer.name,
            'appointment_date': self.appointment_date.isoformat(),
            'service': self.service,
            'notes': self.notes,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }