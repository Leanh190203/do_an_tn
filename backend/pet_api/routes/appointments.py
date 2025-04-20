from flask import Blueprint, request, jsonify
from models import db
from models.appointment import Appointment
from models.pet import Pet
from models.customer import Customer
from auth import token_required
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

appointment_bp = Blueprint('appointment', __name__, url_prefix='/api/appointments')

@appointment_bp.route('/', methods=['GET'])
@token_required
def get_appointments(current_user_id):
    try:
        appointments = Appointment.query.all()
        return jsonify([appointment.to_dict() for appointment in appointments]), 200
    except Exception as e:
        logger.error(f"Error getting appointments: {str(e)}")
        return jsonify({'message': f'Lỗi khi lấy danh sách lịch hẹn: {str(e)}'}), 500

@appointment_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_appointment(current_user_id, id):
    try:
        appointment = Appointment.query.get_or_404(id)
        return jsonify(appointment.to_dict()), 200
    except Exception as e:
        logger.error(f"Error getting appointment {id}: {str(e)}")
        return jsonify({'message': f'Lỗi khi lấy thông tin lịch hẹn: {str(e)}'}), 500

@appointment_bp.route('/', methods=['POST'])
@token_required
def create_appointment(current_user_id):
    try:
        data = request.get_json()
        logger.info(f"Creating appointment with data: {data}")

        # Validate required fields
        required_fields = ['pet_id', 'customer_id', 'appointment_date', 'service']
        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Thiếu thông tin bắt buộc'}), 400

        # Validate pet and customer exist
        pet = Pet.query.get(data['pet_id'])
        if not pet:
            return jsonify({'message': 'Không tìm thấy thú cưng'}), 404

        customer = Customer.query.get(data['customer_id'])
        if not customer:
            return jsonify({'message': 'Không tìm thấy khách hàng'}), 404

        # Parse datetime from string
        try:
            appointment_date = datetime.fromisoformat(data['appointment_date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'message': 'Định dạng ngày giờ không hợp lệ'}), 400

        new_appointment = Appointment(
            pet_id=data['pet_id'],
            customer_id=data['customer_id'],
            appointment_date=appointment_date,
            service=data['service'],
            notes=data.get('notes', ''),
            status=data.get('status', 'pending')
        )

        db.session.add(new_appointment)
        db.session.commit()
        logger.info(f"Successfully created appointment with id: {new_appointment.id}")
        return jsonify(new_appointment.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating appointment: {str(e)}")
        return jsonify({'message': f'Lỗi khi tạo lịch hẹn: {str(e)}'}), 500

@appointment_bp.route('/<int:id>', methods=['PUT'])
@token_required
def update_appointment(current_user_id, id):
    try:
        appointment = Appointment.query.get_or_404(id)
        data = request.get_json()
        logger.info(f"Updating appointment {id} with data: {data}")

        if 'appointment_date' in data:
            try:
                data['appointment_date'] = datetime.fromisoformat(data['appointment_date'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'message': 'Định dạng ngày giờ không hợp lệ'}), 400

        if 'pet_id' in data:
            if not Pet.query.get(data['pet_id']):
                return jsonify({'message': 'Không tìm thấy thú cưng'}), 404
            appointment.pet_id = data['pet_id']

        if 'customer_id' in data:
            if not Customer.query.get(data['customer_id']):
                return jsonify({'message': 'Không tìm thấy khách hàng'}), 404
            appointment.customer_id = data['customer_id']

        appointment.appointment_date = data.get('appointment_date', appointment.appointment_date)
        appointment.service = data.get('service', appointment.service)
        appointment.notes = data.get('notes', appointment.notes)
        appointment.status = data.get('status', appointment.status)

        db.session.commit()
        logger.info(f"Successfully updated appointment {id}")
        return jsonify(appointment.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating appointment {id}: {str(e)}")
        return jsonify({'message': f'Lỗi khi cập nhật lịch hẹn: {str(e)}'}), 500

@appointment_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_appointment(current_user_id, id):
    try:
        appointment = Appointment.query.get_or_404(id)
        db.session.delete(appointment)
        db.session.commit()
        logger.info(f"Successfully deleted appointment {id}")
        return jsonify({'message': 'Xóa lịch hẹn thành công'}), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting appointment {id}: {str(e)}")
        return jsonify({'message': f'Lỗi khi xóa lịch hẹn: {str(e)}'}), 500