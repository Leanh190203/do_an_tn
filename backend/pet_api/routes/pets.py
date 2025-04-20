from flask import Blueprint, request, jsonify
from models import db
from models.pet import Pet
from models.customer import Customer
from auth import token_required
import logging

# Thiết lập logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

pet_bp = Blueprint('pet', __name__, url_prefix='/api/pets')

@pet_bp.route('/', methods=['GET'])
@token_required
def get_pets(current_user_id):
    try:
        pets = Pet.query.all()
        return jsonify([pet.to_dict() for pet in pets]), 200
    except Exception as e:
        logger.error(f"Error getting pets: {str(e)}")
        return jsonify({'message': f'Lỗi khi lấy danh sách thú cưng: {str(e)}'}), 500

@pet_bp.route('/<int:id>', methods=['GET'])
@token_required
def get_pet(current_user_id, id):
    try:
        pet = Pet.query.get_or_404(id)
        return jsonify(pet.to_dict()), 200
    except Exception as e:
        logger.error(f"Error getting pet {id}: {str(e)}")
        return jsonify({'message': f'Lỗi khi lấy thông tin thú cưng: {str(e)}'}), 500

@pet_bp.route('/', methods=['POST'])
@token_required
def create_pet(current_user_id):
    try:
        data = request.get_json()
        logger.info(f"Received data for creating pet: {data}")

        # Kiểm tra các trường bắt buộc
        if not data.get('name') or not data.get('species') or not data.get('customer_id'):
            return jsonify({'message': 'Thiếu thông tin bắt buộc (tên, loài, ID khách hàng)'}), 400

        # Kiểm tra khách hàng tồn tại
        customer = Customer.query.get(data['customer_id'])
        if not customer:
            return jsonify({'message': 'Không tìm thấy khách hàng!'}), 404

        # Tạo thú cưng mới
        new_pet = Pet(
            name=data['name'],
            species=data['species'],
            customer_id=data['customer_id'],
            age=data.get('age'),
            weight=data.get('weight'),
            medical_description=data.get('description', ''),  # Use empty string as default
            symptoms=data.get('symptoms', '')  # Thêm trường triệu chứng
        )

        db.session.add(new_pet)
        db.session.commit()

        logger.info(f"Successfully created pet with id: {new_pet.id}")
        return jsonify(new_pet.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating pet: {str(e)}")
        return jsonify({'message': f'Lỗi khi tạo thú cưng: {str(e)}'}), 500

@pet_bp.route('/<int:id>', methods=['PUT'])
@token_required
def update_pet(current_user_id, id):
    try:
        pet = Pet.query.get_or_404(id)
        data = request.get_json()
        logger.info(f"Updating pet {id} with data: {data}")

        if not data.get('name') or not data.get('species'):
            return jsonify({'message': 'Thiếu thông tin bắt buộc (tên, loài)'}), 400

        # Cập nhật thông tin
        pet.name = data['name']
        pet.species = data['species']
        pet.age = data.get('age', pet.age)
        pet.weight = data.get('weight', pet.weight)
        pet.medical_description = data.get('description', pet.medical_description)  # Keep existing if not provided
        pet.symptoms = data.get('symptoms', pet.symptoms)  # Cập nhật trường triệu chứng

        if 'customer_id' in data:
            customer = Customer.query.get(data['customer_id'])
            if not customer:
                return jsonify({'message': 'Không tìm thấy khách hàng!'}), 404
            pet.customer_id = data['customer_id']

        db.session.commit()
        logger.info(f"Successfully updated pet {id}")
        return jsonify(pet.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating pet {id}: {str(e)}")
        return jsonify({'message': f'Lỗi khi cập nhật thú cưng: {str(e)}'}), 500

@pet_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_pet(current_user_id, id):
    try:
        pet = Pet.query.get_or_404(id)
        db.session.delete(pet)
        db.session.commit()
        logger.info(f"Successfully deleted pet {id}")
        return jsonify({'message': 'Xóa thú cưng thành công'}), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting pet {id}: {str(e)}")
        return jsonify({'message': f'Lỗi khi xóa thú cưng: {str(e)}'}), 500
