from flask import Blueprint, request, jsonify
from models import db
from models.appointment import Appointment
from models.pet import Pet
from models.customer import Customer
from auth import token_required
import logging
from datetime import datetime, timedelta
from sqlalchemy import or_, and_, func

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

appointment_bp = Blueprint('appointment', __name__, url_prefix='/api/appointments')

@appointment_bp.route('/', methods=['GET'])
@token_required
def get_appointments(current_user_id):
    try:
        # Check for query parameters
        status = request.args.get('status')
        pet_id = request.args.get('pet_id')
        customer_id = request.args.get('customer_id')
        search = request.args.get('search')
        limit = request.args.get('limit', type=int)
        
        # Start with base query
        query = Appointment.query
        
        # Apply filters
        if status:
            query = query.filter(Appointment.status == status)
        if pet_id:
            query = query.filter(Appointment.pet_id == pet_id)
        if customer_id:
            query = query.filter(Appointment.customer_id == customer_id)
        
        # Apply search if provided
        if search:
            search_term = f"%{search}%"
            query = query.join(Pet).join(Customer).filter(
                or_(
                    Pet.name.ilike(search_term),
                    Customer.name.ilike(search_term),
                    Appointment.service.ilike(search_term)
                )
            )
        
        # Apply limit if specified
        if limit:
            query = query.limit(limit)
            
        # Order by appointment date descending (newest first)
        query = query.order_by(Appointment.appointment_date.desc())
        
        appointments = query.all()
        return jsonify([appointment.to_dict() for appointment in appointments]), 200
    except Exception as e:
        logger.error(f"Error getting appointments: {str(e)}")
        return jsonify({'message': f'Lỗi khi lấy danh sách lịch hẹn: {str(e)}'}), 500

@appointment_bp.route('/upcoming', methods=['GET'])
@token_required
def get_upcoming_appointments(current_user_id):
    try:
        # Get today's date (start of day)
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Optional parameters
        days = request.args.get('days', default=30, type=int)
        customer_id = request.args.get('customer_id', type=int)
        pet_id = request.args.get('pet_id', type=int)
        
        # Calculate end date
        end_date = today + timedelta(days=days)
        
        # Build query
        query = Appointment.query.filter(
            and_(
                Appointment.appointment_date >= today,
                Appointment.appointment_date <= end_date,
                Appointment.status.in_(['pending', 'confirmed'])
            )
        )
        
        # Apply additional filters if provided
        if customer_id:
            query = query.filter(Appointment.customer_id == customer_id)
        if pet_id:
            query = query.filter(Appointment.pet_id == pet_id)
            
        # Order by date (ascending) to get soonest appointments first
        query = query.order_by(Appointment.appointment_date.asc())
        
        appointments = query.all()
        return jsonify([appointment.to_dict() for appointment in appointments]), 200
    except Exception as e:
        logger.error(f"Error getting upcoming appointments: {str(e)}")
        return jsonify({'message': f'Lỗi khi lấy danh sách lịch hẹn sắp tới: {str(e)}'}), 500

@appointment_bp.route('/completed', methods=['GET'])
@token_required
def get_completed_appointments(current_user_id):
    try:
        # Optional parameters
        customer_id = request.args.get('customer_id', type=int)
        pet_id = request.args.get('pet_id', type=int)
        limit = request.args.get('limit', default=20, type=int)
        
        # Build query for completed appointments
        query = Appointment.query.filter(Appointment.status == 'completed')
        
        # Apply additional filters if provided
        if customer_id:
            query = query.filter(Appointment.customer_id == customer_id)
        if pet_id:
            query = query.filter(Appointment.pet_id == pet_id)
            
        # Order by date (descending) to get most recent completions first
        query = query.order_by(Appointment.appointment_date.desc()).limit(limit)
        
        appointments = query.all()
        return jsonify([appointment.to_dict() for appointment in appointments]), 200
    except Exception as e:
        logger.error(f"Error getting completed appointments: {str(e)}")
        return jsonify({'message': f'Lỗi khi lấy danh sách lịch hẹn đã hoàn thành: {str(e)}'}), 500

@appointment_bp.route('/status/<int:id>', methods=['PATCH'])
@token_required
def update_appointment_status(current_user_id, id):
    try:
        appointment = Appointment.query.get_or_404(id)
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'message': 'Thiếu trạng thái mới'}), 400
            
        new_status = data['status']
        allowed_statuses = ['pending', 'confirmed', 'cancelled', 'completed']
        
        if new_status not in allowed_statuses:
            return jsonify({'message': f'Trạng thái không hợp lệ. Cho phép: {", ".join(allowed_statuses)}'}), 400
            
        # Update status
        appointment.status = new_status
        
        # Add comments if provided
        if 'notes' in data and data['notes']:
            # Append new note with timestamp
            timestamp = datetime.now().strftime("%d/%m/%Y %H:%M")
            new_note = f"[{timestamp}] [{new_status.upper()}] {data['notes']}"
            
            if appointment.notes:
                appointment.notes = appointment.notes + "\n\n" + new_note
            else:
                appointment.notes = new_note
        
        db.session.commit()
        logger.info(f"Successfully updated appointment {id} status to {new_status}")
        return jsonify(appointment.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating appointment status {id}: {str(e)}")
        return jsonify({'message': f'Lỗi khi cập nhật trạng thái lịch hẹn: {str(e)}'}), 500

@appointment_bp.route('/stats', methods=['GET'])
@token_required
def get_appointment_stats(current_user_id):
    try:
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Get counts by status
        status_counts = db.session.query(
            Appointment.status, 
            func.count(Appointment.id)
        ).group_by(Appointment.status).all()
        
        # Get upcoming appointments count (next 7 days)
        next_week = today + timedelta(days=7)
        upcoming_count = Appointment.query.filter(
            and_(
                Appointment.appointment_date >= today,
                Appointment.appointment_date <= next_week,
                Appointment.status.in_(['pending', 'confirmed'])
            )
        ).count()
        
        # Get today's appointments
        todays_appointments = Appointment.query.filter(
            and_(
                func.date(Appointment.appointment_date) == func.date(today),
                Appointment.status.in_(['pending', 'confirmed'])
            )
        ).count()
        
        # Format results
        status_dict = {status: count for status, count in status_counts}
        
        stats = {
            'total': sum(count for _, count in status_counts),
            'pending': status_dict.get('pending', 0),
            'confirmed': status_dict.get('confirmed', 0),
            'completed': status_dict.get('completed', 0),
            'cancelled': status_dict.get('cancelled', 0),
            'upcoming_week': upcoming_count,
            'today': todays_appointments
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        logger.error(f"Error getting appointment stats: {str(e)}")
        return jsonify({'message': f'Lỗi khi lấy thống kê lịch hẹn: {str(e)}'}), 500

@appointment_bp.route('/search', methods=['GET'])
@token_required
def search_appointments(current_user_id):
    try:
        # Get search query
        query = request.args.get('q', '')
        if not query or len(query) < 2:
            return jsonify({'message': 'Từ khóa tìm kiếm phải có ít nhất 2 ký tự'}), 400
            
        search_term = f"%{query}%"
        
        # Search across related entities
        appointments = Appointment.query.join(Pet).join(Customer).filter(
            or_(
                Pet.name.ilike(search_term),
                Customer.name.ilike(search_term),
                Customer.phone.ilike(search_term),
                Appointment.service.ilike(search_term),
                Appointment.notes.ilike(search_term)
            )
        ).order_by(Appointment.appointment_date.desc()).limit(20).all()
        
        return jsonify([appointment.to_dict() for appointment in appointments]), 200
        
    except Exception as e:
        logger.error(f"Error searching appointments: {str(e)}")
        return jsonify({'message': f'Lỗi khi tìm kiếm lịch hẹn: {str(e)}'}), 500

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

        # Tạo appointment với các trường cơ bản trước
        new_appointment = Appointment(
            pet_id=data['pet_id'],
            customer_id=data['customer_id'],
            appointment_date=appointment_date,
            service=data['service'],
            notes=data.get('notes', ''),
            status=data.get('status', 'pending')
        )
        
        # Thêm các trường cửa sổ tử nếu chúng tồn tại trong schema
        # Bọc trong try-except để tránh lỗi khi cột chưa được tạo
        try:
            if hasattr(Appointment, 'diagnosis'):
                new_appointment.diagnosis = data.get('diagnosis')
            if hasattr(Appointment, 'clinic'):
                new_appointment.clinic = data.get('clinic')
            if hasattr(Appointment, 'reminder_sent'):
                new_appointment.reminder_sent = data.get('reminder_sent', False)
            if hasattr(Appointment, 'follow_up_date'):
                follow_up = data.get('follow_up_date')
                if follow_up:
                    new_appointment.follow_up_date = datetime.fromisoformat(follow_up.replace('Z', '+00:00'))
            if hasattr(Appointment, 'completed_by'):
                new_appointment.completed_by = data.get('completed_by')
        except Exception as e:
            logger.warning(f"Some appointment fields are not available: {str(e)}")

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

        # Cập nhật các trường cơ bản
        appointment.appointment_date = data.get('appointment_date', appointment.appointment_date)
        appointment.service = data.get('service', appointment.service)
        appointment.notes = data.get('notes', appointment.notes)
        appointment.status = data.get('status', appointment.status)
        
        # Cập nhật các trường mới
        try:
            if hasattr(appointment, 'diagnosis') and 'diagnosis' in data:
                appointment.diagnosis = data.get('diagnosis')
                
            if hasattr(appointment, 'clinic') and 'clinic' in data:
                appointment.clinic = data.get('clinic')
                
            if hasattr(appointment, 'follow_up_date') and 'follow_up_date' in data:
                follow_up = data.get('follow_up_date')
                if follow_up:
                    appointment.follow_up_date = datetime.fromisoformat(follow_up.replace('Z', '+00:00'))
                else:
                    appointment.follow_up_date = None
                    
            if hasattr(appointment, 'reminder_sent') and 'reminder_sent' in data:
                appointment.reminder_sent = data.get('reminder_sent', False)
                
            if hasattr(appointment, 'completed_by') and 'completed_by' in data:
                appointment.completed_by = data.get('completed_by')
        except Exception as e:
            logger.warning(f"Error updating additional fields: {str(e)}")

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

@appointment_bp.route('/send-reminders', methods=['POST'])
@token_required
def send_appointment_reminders(current_user_id):
    try:
        # Lấy tham số từ request (nếu có)
        data = request.get_json() or {}
        days_ahead = data.get('days_ahead', 1)  # Mặc định nhắc trước 1 ngày
        
        # Tính ngày cần gửi nhắc nhở
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        target_date = today + timedelta(days=days_ahead)
        end_of_target_date = target_date.replace(hour=23, minute=59, second=59)
        
        # Tìm các lịch hẹn trong khoảng thời gian cần gửi nhắc
        appointments_to_remind = Appointment.query.filter(
            and_(
                Appointment.appointment_date >= target_date,
                Appointment.appointment_date <= end_of_target_date,
                Appointment.status.in_(['pending', 'confirmed']),
                Appointment.reminder_sent == False  # Chỉ gửi cho những lịch hẹn chưa được nhắc
            )
        ).all()
        
        # Đếm số lượng lịch hẹn cần nhắc
        count = len(appointments_to_remind)
        
        # Lặp qua từng lịch hẹn và đánh dấu đã gửi nhắc
        for appointment in appointments_to_remind:
            # Ở đây sẽ thêm logic gửi email/SMS trong ứng dụng thực tế
            # Ví dụ: send_reminder_email(appointment)
            
            # Cập nhật trạng thái đã gửi nhắc
            appointment.reminder_sent = True
            
            # Nếu trạng thái còn 'pending', cập nhật thành 'confirmed'
            if appointment.status == 'pending':
                appointment.status = 'confirmed'
                # Thêm ghi chú về việc xác nhận tự động
                timestamp = datetime.now().strftime("%d/%m/%Y %H:%M")
                new_note = f"[{timestamp}] [SYSTEM] Tự động xác nhận lịch hẹn và gửi nhắc nhở."
                
                if appointment.notes:
                    appointment.notes = appointment.notes + "\n\n" + new_note
                else:
                    appointment.notes = new_note
        
        # Lưu các thay đổi vào CSDL
        db.session.commit()
        
        return jsonify({
            'message': f'Đã gửi nhắc nhở cho {count} lịch hẹn sắp đến',
            'reminder_date': target_date.strftime("%d/%m/%Y"),
            'appointments_reminded': count
        }), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error sending appointment reminders: {str(e)}")
        return jsonify({'message': f'Lỗi khi gửi nhắc nhở lịch hẹn: {str(e)}'}), 500

@appointment_bp.route('/auto-update-status', methods=['POST'])
@token_required
def auto_update_appointment_status(current_user_id):
    try:
        now = datetime.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = now.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        # Tự động hoàn thành các lịch hẹn đã qua
        # Lấy các lịch hẹn đã qua ngày nhưng chưa được cập nhật trạng thái
        past_appointments = Appointment.query.filter(
            and_(
                Appointment.appointment_date < today_start,
                Appointment.status.in_(['pending', 'confirmed'])
            )
        ).all()
        
        count_completed = 0
        for appointment in past_appointments:
            appointment.status = 'completed'
            count_completed += 1
            
            # Thêm ghi chú tự động
            timestamp = datetime.now().strftime("%d/%m/%Y %H:%M")
            new_note = f"[{timestamp}] [SYSTEM] Tự động cập nhật trạng thái thành 'Hoàn thành' vì lịch hẹn đã qua."
            
            if appointment.notes:
                appointment.notes = appointment.notes + "\n\n" + new_note
            else:
                appointment.notes = new_note
        
        # Tự động xác nhận các lịch hẹn trong ngày
        today_appointments = Appointment.query.filter(
            and_(
                Appointment.appointment_date >= today_start,
                Appointment.appointment_date <= today_end,
                Appointment.status == 'pending'
            )
        ).all()
        
        count_confirmed = 0
        for appointment in today_appointments:
            appointment.status = 'confirmed'
            count_confirmed += 1
            
            # Thêm ghi chú tự động
            timestamp = datetime.now().strftime("%d/%m/%Y %H:%M")
            new_note = f"[{timestamp}] [SYSTEM] Tự động xác nhận lịch hẹn trong ngày."
            
            if appointment.notes:
                appointment.notes = appointment.notes + "\n\n" + new_note
            else:
                appointment.notes = new_note
        
        db.session.commit()
        
        return jsonify({
            'message': 'Đã cập nhật trạng thái lịch hẹn tự động',
            'completed': count_completed,
            'confirmed': count_confirmed
        }), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error auto-updating appointment status: {str(e)}")
        return jsonify({'message': f'Lỗi khi tự động cập nhật trạng thái lịch hẹn: {str(e)}'}), 500