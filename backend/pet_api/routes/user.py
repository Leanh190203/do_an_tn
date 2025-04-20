from flask import Blueprint, request, jsonify, current_app
from models import db
from models.user import User
from models.customer import Customer
from flask_bcrypt import Bcrypt
import jwt, datetime
import logging
from auth import token_required, admin_required

# Thiết lập logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

user_bp = Blueprint('user', __name__, url_prefix='/api/user')  # Prefix route: /api/user/...
bcrypt = Bcrypt()

# -------- ĐĂNG KÝ --------
@user_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        logger.info(f"Received registration data: {data}")

        # Kiểm tra dữ liệu đầu vào
        required_fields = ['name', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'Thiếu trường {field}!'}), 400

        # Kiểm tra email tồn tại
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email đã tồn tại!'}), 400

        # Mã hóa mật khẩu
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

        # Tạo user mới
        new_user = User(
            name=data['name'],
            email=data['email'],
            password=hashed_password,
            role='user',  # Mặc định là user thường
            phone=data.get('phone', ''),
            address=data.get('address', '')
        )

        db.session.add(new_user)
        db.session.flush()  # Để lấy được ID của user vừa tạo
        
        # Tạo customer tương ứng cho người dùng đăng ký
        new_customer = Customer(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone', ''),
            address=data.get('address', '')
        )
        
        db.session.add(new_customer)
        db.session.commit()
        logger.info(f"Created new user with email: {data['email']} and corresponding customer record")

        return jsonify({
            'message': 'Đăng ký thành công!',
            'user': new_user.to_dict()
        }), 201

    except Exception as e:
        logger.error(f"Error in registration: {str(e)}")
        db.session.rollback()
        return jsonify({'message': f'Lỗi khi đăng ký: {str(e)}'}), 500

# -------- ĐĂNG NHẬP --------
@user_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        logger.info(f"Received login request with data: {data}")

        if not data or not data.get('email') or not data.get('password'):
            logger.warning("Missing email or password in login request")
            return jsonify({'message': 'Thiếu email hoặc mật khẩu!'}), 400

        user = User.query.filter_by(email=data['email']).first()
        logger.info(f"User found: {user is not None}")

        if user and bcrypt.check_password_hash(user.password, data['password']):
            try:
                # Tạo token
                token = jwt.encode({
                    'user_id': user.id,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=99)  
                }, current_app.config['SECRET_KEY'], algorithm='HS256')
                
                logger.info(f"Login successful for user: {user.email}")
                return jsonify({
                    'message': 'Đăng nhập thành công!',
                    'token': token,
                    'user': user.to_dict()
                }), 200
            except Exception as e:
                logger.error(f"Error generating token: {str(e)}")
                return jsonify({'message': 'Không thể tạo token', 'error': str(e)}), 500
        else:
            logger.warning(f"Invalid login attempt for email: {data.get('email')}")
            return jsonify({'message': 'Email hoặc mật khẩu không đúng!'}), 401
    except Exception as e:
        logger.error(f"Unexpected error in login: {str(e)}")
        return jsonify({'message': f'Lỗi server: {str(e)}'}), 500

@user_bp.route('/me', methods=['GET'])
@token_required
def get_user_info(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'Người dùng không tồn tại!'}), 404

    return jsonify(user.to_dict()), 200

@user_bp.route('/set-admin/<int:target_user_id>', methods=['POST'])
@admin_required
def set_admin(current_user_id, target_user_id):
    # Kiểm tra người dùng hiện tại có phải admin không
    current_user = User.query.get(current_user_id)
    if not current_user or not current_user.is_admin():
        return jsonify({'message': 'Không có quyền thực hiện thao tác này!'}), 403

    # Tìm user cần set quyền admin
    target_user = User.query.get(target_user_id)
    if not target_user:
        return jsonify({'message': 'Không tìm thấy người dùng!'}), 404

    # Set quyền admin
    target_user.role = 'admin'
    db.session.commit()

    return jsonify({
        'message': 'Đã cấp quyền admin thành công!',
        'user': target_user.to_dict()
    }), 200

@user_bp.route('/remove-admin/<int:target_user_id>', methods=['POST'])
@admin_required
def remove_admin(current_user_id, target_user_id):
    # Kiểm tra người dùng hiện tại có phải admin không
    current_user = User.query.get(current_user_id)
    if not current_user or not current_user.is_admin():
        return jsonify({'message': 'Không có quyền thực hiện thao tác này!'}), 403

    # Tìm user cần remove quyền admin
    target_user = User.query.get(target_user_id)
    if not target_user:
        return jsonify({'message': 'Không tìm thấy người dùng!'}), 404

    # Remove quyền admin
    target_user.role = 'user'
    db.session.commit()

    return jsonify({
        'message': 'Đã thu hồi quyền admin thành công!',
        'user': target_user.to_dict()
    }), 200

# ------- CẬP NHẬT THÔNG TIN NGƯỜI DÙNG -------
@user_bp.route('/<int:user_id>', methods=['PUT'])
@token_required
def update_user(current_user_id, user_id):
    # Kiểm tra quyền: người dùng chỉ được cập nhật thông tin của chính mình
    # hoặc admin có thể cập nhật thông tin của bất kỳ ai
    try:
        # Kiểm tra xem người dùng hiện tại có phải là admin hoặc đang cập nhật thông tin của chính mình
        if current_user_id != user_id:
            current_user = User.query.get(current_user_id)
            if not current_user or not current_user.is_admin():
                return jsonify({'message': 'Không có quyền cập nhật thông tin người dùng khác!'}), 403

        # Tìm user cần cập nhật
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'Không tìm thấy người dùng!'}), 404

        data = request.get_json()
        logger.info(f"Updating user {user_id} with data: {data}")

        # Cập nhật các trường được phép
        if 'name' in data:
            user.name = data['name']
        if 'phone' in data:
            user.phone = data['phone'] or ''  # Ensure empty string not None
        if 'address' in data:
            user.address = data['address'] or ''  # Ensure empty string not None

        user.updated_at = datetime.datetime.utcnow()
        
        # Tìm và cập nhật thông tin customer tương ứng (sử dụng email để tìm)
        customer = Customer.query.filter_by(email=user.email).first()
        if customer:
            logger.info(f"Updating corresponding customer record {customer.id} for user {user_id}")
            if 'name' in data:
                customer.name = data['name']
            if 'phone' in data:
                customer.phone = data['phone'] or ''  # Ensure empty string not None
            if 'address' in data:
                customer.address = data['address'] or ''  # Ensure empty string not None
            customer.updated_at = datetime.datetime.utcnow()
            logger.info(f"Updated customer data: name={customer.name}, phone={customer.phone}, address={customer.address}")
        else:
            logger.warning(f"No corresponding customer record found for user {user_id} with email {user.email}")
            # Create new customer record if it doesn't exist
            if user.email:
                try:
                    new_customer = Customer(
                        name=user.name,
                        email=user.email,
                        phone=user.phone or '',
                        address=user.address or ''
                    )
                    db.session.add(new_customer)
                    logger.info(f"Created new customer record for user {user_id}")
                except Exception as e:
                    logger.error(f"Failed to create customer record for user {user_id}: {str(e)}")
        
        db.session.commit()
        
        updated_user = user.to_dict()
        logger.info(f"User {user_id} updated successfully: {updated_user}")

        return jsonify({
            'message': 'Cập nhật thông tin thành công!',
            'user': updated_user
        }), 200
    except Exception as e:
        logger.error(f"Error updating user {user_id}: {str(e)}")
        db.session.rollback()
        return jsonify({'message': f'Lỗi khi cập nhật thông tin: {str(e)}'}), 500

# ------- ĐỔI MẬT KHẨU -------
@user_bp.route('/<int:user_id>/change-password', methods=['PUT'])
@token_required
def change_password(current_user_id, user_id):
    # Người dùng chỉ được đổi mật khẩu của chính mình
    try:
        if current_user_id != user_id:
            return jsonify({'message': 'Không có quyền đổi mật khẩu của người dùng khác!'}), 403

        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'Không tìm thấy người dùng!'}), 404

        data = request.get_json()
        logger.info(f"Changing password for user {user_id}")

        # Kiểm tra dữ liệu đầu vào
        if not data or not data.get('currentPassword') or not data.get('newPassword') or not data.get('confirmPassword'):
            return jsonify({'message': 'Thiếu thông tin bắt buộc!'}), 400

        # Kiểm tra mật khẩu hiện tại
        if not bcrypt.check_password_hash(user.password, data['currentPassword']):
            return jsonify({'message': 'Mật khẩu hiện tại không đúng!'}), 400

        # Kiểm tra mật khẩu mới và xác nhận mật khẩu mới
        if data['newPassword'] != data['confirmPassword']:
            return jsonify({'message': 'Mật khẩu mới và xác nhận mật khẩu không khớp!'}), 400

        # Kiểm tra độ dài mật khẩu mới
        if len(data['newPassword']) < 6:
            return jsonify({'message': 'Mật khẩu mới phải có ít nhất 6 ký tự!'}), 400

        # Cập nhật mật khẩu
        user.password = bcrypt.generate_password_hash(data['newPassword']).decode('utf-8')
        user.updated_at = datetime.datetime.utcnow()
        db.session.commit()

        return jsonify({'message': 'Đổi mật khẩu thành công!'}), 200
    except Exception as e:
        logger.error(f"Error changing password: {str(e)}")
        db.session.rollback()
        return jsonify({'message': f'Lỗi khi đổi mật khẩu: {str(e)}'}), 500