from flask import Blueprint, jsonify
from models import db
from models.pet import Pet
from models.customer import Customer
from models.appointment import Appointment
from auth import token_required
import logging
from datetime import datetime, timedelta
from sqlalchemy import func, extract, desc
from collections import defaultdict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('/stats', methods=['GET'])
@token_required
def get_dashboard_stats(current_user_id):
    try:
        # Lấy tổng số thú cưng
        total_pets = Pet.query.count()
        
        # Lấy tổng số khách hàng
        total_customers = Customer.query.count()
        
        # Lấy tổng số lịch hẹn
        total_appointments = Appointment.query.count()
        
        # Lấy lịch hẹn gần đây (tối đa 5 lịch)
        recent_appointments = []
        appointments = Appointment.query.order_by(Appointment.appointment_date.desc()).limit(5).all()
        for appointment in appointments:
            pet = Pet.query.get(appointment.pet_id)
            customer = Customer.query.get(appointment.customer_id)
            
            recent_appointments.append({
                'id': appointment.id,
                'petName': pet.name if pet else 'Unknown',
                'petId': appointment.pet_id,
                'ownerName': customer.name if customer else 'Unknown',
                'ownerId': appointment.customer_id,
                'date': appointment.appointment_date.strftime('%Y-%m-%d %H:%M'),
                'service': appointment.service,
                'status': appointment.status
            })
        
        # Lấy dữ liệu biểu đồ cho 7 ngày qua
        today = datetime.now().date()
        one_week_ago = today - timedelta(days=6)
        
        chart_data = []
        for i in range(7):
            day = one_week_ago + timedelta(days=i)
            next_day = day + timedelta(days=1)
            
            # Đếm số lịch hẹn trong ngày
            count = Appointment.query.filter(
                func.date(Appointment.appointment_date) == day
            ).count()
            
            # Tên ngày trong tuần theo tiếng Việt
            day_names = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
            day_of_week = day.weekday()  # 0 = Monday, 6 = Sunday
            day_name = day_names[day_of_week]
            
            chart_data.append({
                'name': day_name,
                'date': day.strftime('%Y-%m-%d'),
                'visits': count
            })
        
        # Tạo một số thông báo mẫu (thực tế bạn sẽ lấy từ CSDL)
        notifications = []
        today_appointments = Appointment.query.filter(
            func.date(Appointment.appointment_date) == today
        ).all()
        
        if today_appointments:
            notifications.append({
                'id': 1,
                'message': f'Có {len(today_appointments)} lịch hẹn trong ngày hôm nay',
                'time': 'Hôm nay'
            })
        
        tomorrow_appointments = Appointment.query.filter(
            func.date(Appointment.appointment_date) == today + timedelta(days=1)
        ).all()
        
        if tomorrow_appointments:
            notifications.append({
                'id': 2,
                'message': f'Có {len(tomorrow_appointments)} lịch hẹn vào ngày mai',
                'time': 'Ngày mai'
            })
        
        # Kết hợp tất cả dữ liệu
        dashboard_data = {
            'totalPets': total_pets,
            'totalCustomers': total_customers,
            'totalAppointments': total_appointments,
            'recentAppointments': recent_appointments,
            'chartData': chart_data,
            'notifications': notifications
        }
        
        return jsonify(dashboard_data), 200
    
    except Exception as e:
        logger.error(f"Error getting dashboard stats: {str(e)}")
        return jsonify({'message': f'Lỗi khi lấy thống kê: {str(e)}'}), 500

@dashboard_bp.route('/reports', methods=['GET'])
@token_required
def get_reports(current_user_id):
    try:
        # 1. Lượt khám theo tháng trong năm hiện tại
        current_year = datetime.now().year
        monthly_data = []
        
        for month in range(1, 13):
            count = Appointment.query.filter(
                extract('year', Appointment.appointment_date) == current_year,
                extract('month', Appointment.appointment_date) == month
            ).count()
            
            month_names = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
            monthly_data.append({
                'month': month_names[month-1],
                'visits': count
            })
        
        # 2. Phân bổ dịch vụ
        services = db.session.query(
            Appointment.service,
            func.count(Appointment.id).label('count')
        ).group_by(Appointment.service).all()
        
        service_data = []
        for service, count in services:
            service_data.append({
                'name': service,
                'value': count
            })
        
        # 3. Phân bổ loại thú cưng
        pet_types = db.session.query(
            Pet.species,
            func.count(Pet.id).label('count')
        ).group_by(Pet.species).all()
        
        pet_type_data = []
        for species, count in pet_types:
            pet_type_data.append({
                'name': species,
                'count': count
            })
        
        # 4. Thống kê trạng thái lịch hẹn
        status_stats = db.session.query(
            Appointment.status,
            func.count(Appointment.id).label('count')
        ).group_by(Appointment.status).all()
        
        status_data = []
        for status, count in status_stats:
            status_data.append({
                'name': status,
                'count': count
            })
        
        reports_data = {
            'monthlyData': monthly_data,
            'serviceData': service_data,
            'petTypeData': pet_type_data,
            'statusData': status_data
        }
        
        return jsonify(reports_data), 200
    
    except Exception as e:
        logger.error(f"Error getting reports data: {str(e)}")
        return jsonify({'message': f'Lỗi khi lấy dữ liệu báo cáo: {str(e)}'}), 500 