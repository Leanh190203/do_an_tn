from flask import Blueprint, request, jsonify
from models import db
from models.customer import Customer
from models.pet import Pet
from models.user import User
from auth import token_required
import logging

# Thiết lập logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

customer_bp = Blueprint('customer', __name__, url_prefix='/api/customers')

@customer_bp.route('/', methods=['GET'])
@token_required
def get_all_customers(current_user_id):
    try:
        customers = Customer.query.all()
        logger.info(f"Fetched {len(customers)} customers")
        for customer in customers:
            logger.debug(f"Customer data: {customer.to_dict()}")
        return jsonify([customer.to_dict() for customer in customers]), 200
    except Exception as e:
        logger.error(f"Error fetching customers: {str(e)}")
        return jsonify({"message": f"Error fetching customers: {str(e)}"}), 500

@customer_bp.route('/<int:customer_id>', methods=['GET'])
@token_required
def get_customer(current_user_id, customer_id):
    customer = Customer.query.get_or_404(customer_id)
    logger.info(f"Fetched customer {customer_id}: {customer.to_dict()}")
    return jsonify(customer.to_dict()), 200

@customer_bp.route('/', methods=['POST'])
@token_required
def create_customer(current_user_id):
    data = request.get_json()

    if not data.get('name'):
        return jsonify({'message': 'Tên khách hàng là bắt buộc!'}), 400

    new_customer = Customer(
        name=data['name'],
        phone=data.get('phone', ''),
        email=data.get('email', ''),
        address=data.get('address', '')
    )

    try:
        db.session.add(new_customer)
        db.session.commit()
        logger.info(f"Created new customer: {new_customer.to_dict()}")
        return jsonify(new_customer.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating customer: {str(e)}")
        return jsonify({'message': f'Lỗi khi tạo khách hàng: {str(e)}'}), 500

@customer_bp.route('/<int:customer_id>', methods=['PUT'])
@token_required
def update_customer(current_user_id, customer_id):
    customer = Customer.query.get_or_404(customer_id)
    data = request.get_json()
    logger.info(f"Updating customer {customer_id} with data: {data}")

    if not data.get('name'):
        return jsonify({'message': 'Tên khách hàng là bắt buộc!'}), 400

    try:
        # Update customer fields
        customer.name = data['name']
        customer.phone = data.get('phone', '') or ''  # Ensure empty string not None
        customer.email = data.get('email', '') or ''
        customer.address = data.get('address', '') or ''

        # If customer has email, update corresponding user if exists
        if customer.email:
            user = User.query.filter_by(email=customer.email).first()
            if user:
                logger.info(f"Updating corresponding user {user.id} for customer {customer_id}")
                user.name = customer.name
                user.phone = customer.phone
                user.address = customer.address
                logger.info(f"Updated user data: name={user.name}, phone={user.phone}, address={user.address}")
            else:
                logger.info(f"No corresponding user found for customer {customer_id} with email {customer.email}")

        db.session.commit()
        updated_customer = customer.to_dict()
        logger.info(f"Customer {customer_id} updated successfully: {updated_customer}")
        return jsonify(updated_customer), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating customer {customer_id}: {str(e)}")
        return jsonify({'message': f'Lỗi khi cập nhật khách hàng: {str(e)}'}), 500

@customer_bp.route('/<int:customer_id>', methods=['DELETE'])
@token_required
def delete_customer(current_user_id, customer_id):
    try:
        customer = Customer.query.get_or_404(customer_id)
        
        # Tìm và xóa tất cả appointments liên quan đến pets của customer
        from models.appointment import Appointment
        from sqlalchemy import or_
        
        # Lấy danh sách pet ids của customer
        pet_ids = [pet.id for pet in customer.pets]
        
        if pet_ids:
            # Tìm và xóa tất cả appointments liên quan
            appointments = Appointment.query.filter(
                or_(
                    Appointment.customer_id == customer_id,
                    Appointment.pet_id.in_(pet_ids)
                )
            ).all()
            
            for appointment in appointments:
                db.session.delete(appointment)
            logger.info(f"Deleted {len(appointments)} related appointments for customer {customer_id}")
        
        # Pets sẽ tự động bị xóa do có cascade='all, delete-orphan' trong model Customer
        
        # Xóa user tương ứng nếu có
        if customer.email:
            user = User.query.filter_by(email=customer.email).first()
            if user and not user.is_admin():  # Không xóa tài khoản admin
                db.session.delete(user)
                logger.info(f"Deleted corresponding user account for customer {customer_id}")
        
        # Xóa customer
        db.session.delete(customer)
        db.session.commit()
        
        logger.info(f"Customer {customer_id} and all related records deleted successfully")
        return jsonify({
            'message': 'Xóa khách hàng và các dữ liệu liên quan thành công!',
            'debug_info': {
                'customer_id': customer_id,
                'pet_count': len(pet_ids),
                'appointment_count': len(appointments) if pet_ids else 0,
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting customer {customer_id}: {str(e)}")
        return jsonify({'message': f'Lỗi khi xóa khách hàng: {str(e)}'}), 500

@customer_bp.route('/<int:customer_id>/pets', methods=['GET'])
@token_required
def get_customer_pets(current_user_id, customer_id):
    customer = Customer.query.get_or_404(customer_id)
    logger.info(f"Fetched {len(customer.pets)} pets for customer {customer_id}")
    return jsonify([pet.to_dict() for pet in customer.pets]), 200
