from flask import Flask
from sqlalchemy_utils import database_exists, create_database, drop_database
from models import db
from config import Config
import logging
from models.user import User
from models.customer import Customer
from models.pet import Pet
from models.appointment import Appointment
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
import random

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    bcrypt.init_app(app)
    return app

def init_database():
    app = create_app()
    with app.app_context():
        try:
            # Xóa database cũ nếu tồn tại
            url = app.config['SQLALCHEMY_DATABASE_URI']
            if database_exists(url):
                drop_database(url)
                logger.info("Đã xóa database cũ")
            
            # Tạo database mới
            create_database(url)
            logger.info("Đã tạo database mới")
            
            # Tạo tất cả các bảng
            db.create_all()
            logger.info("Đã tạo các bảng thành công!")

            # Tạo tài khoản admin mặc định
            admin = User(
                name='Admin',
                phone='0909000111',
                email='admin@example.com',
                address='Thường Tín, Hà Nội`',
                password=bcrypt.generate_password_hash('admin123').decode('utf-8'),
                role='admin'
            )
            db.session.add(admin)
            db.session.commit()
            logger.info("Đã tạo tài khoản admin mặc định")

            # Tạo dữ liệu mẫu
            customer1 = Customer(
                name='Nguyễn Văn A',
                phone='0912345678',
                email='a@example.com',
                address='123 Đường XYZ'
            )
            db.session.add(customer1)
            
            customer2 = Customer(
                name='Trần Thị B',
                phone='0987654321',
                email='b@example.com',
                address='456 Đường ABC'
            )
            db.session.add(customer2)
            db.session.commit()
            logger.info("Đã tạo dữ liệu mẫu cho khách hàng")

            # Tạo thú cưng mẫu
            pet1 = Pet(
                name='Mèo',
                species='Mèo',
                age=3,
                weight=4.5,
                medical_description='Khỏe mạnh',
                symptoms='Không có triệu chứng',
                customer_id=customer1.id
            )
            db.session.add(pet1)
            
            pet2 = Pet(
                name='Chó',
                species='Chó',
                age=2,
                weight=10.2,
                medical_description='Tình trạng tốt',
                symptoms='Không có triệu chứng',
                customer_id=customer2.id
            )
            db.session.add(pet2)
            db.session.commit()
            logger.info("Đã tạo dữ liệu mẫu cho thú cưng")

            # Tạo lịch hẹn mẫu
            appointment1 = Appointment(
                pet_id=pet1.id,
                customer_id=customer1.id,
                appointment_date=datetime.now() + timedelta(days=1),
                service='Khám tổng quát',
                notes='Lịch hẹn định kỳ',
                status='pending'
            )
            db.session.add(appointment1)
            
            appointment2 = Appointment(
                pet_id=pet2.id,
                customer_id=customer2.id,
                appointment_date=datetime.now() + timedelta(days=2),
                service='Tiêm phòng',
                notes='Tiêm vaccine định kỳ',
                status='confirmed'
            )
            db.session.add(appointment2)
            db.session.commit()
            logger.info("Đã tạo dữ liệu mẫu cho lịch hẹn")

            # Kiểm tra các bảng đã tạo
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            logger.info(f"Các bảng đã tạo: {tables}")

            # Danh sách dữ liệu mẫu
            pet_names = ['Kitty', 'Buddy', 'Rocky', 'Molly', 'Bailey', 'Daisy', 'Lucky', 'Lucy', 'Milo', 'Lola']
            pet_species = ['Chó', 'Mèo', 'Chim', 'Chuột', 'Thỏ']
            pet_symptoms = [
                'Ho', 'Sốt', 'Tiêu chảy', 'Khó thở', 'Chán ăn', 'Nôn mửa', 
                'Mệt mỏi', 'Đau chân', 'Chảy nước mắt', 'Rụng lông', 'Bỏ ăn',
            ]
            pet_descriptions = [
                'Cần khám tổng quát', 'Kiểm tra sức khỏe định kỳ', 
                'Đã tiêm vaccine', 'Cần tiêm vaccine', 'Mới nhận nuôi',
                'Điều trị nội trú', 'Cần phẫu thuật', 'Tái khám sau điều trị',
            ]

            customer_names = [
                'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Văn Cường', 'Phạm Thị Dung', 
                'Hoàng Văn Em', 'Ngô Thị Phương', 'Đỗ Văn Giáp', 'Vũ Thị Hoa',
            ]

            def create_sample_data():
                # Tạo tài khoản mẫu
                admin_user = User(
                    name="Admin",
                    email="admin@example.com",
                    password=bcrypt.generate_password_hash("admin123").decode('utf-8'),
                    role="admin"
                )
                
                test_user = User(
                    name="Test User",
                    email="test@example.com",
                    password=bcrypt.generate_password_hash("test123").decode('utf-8'),
                    role="user"
                )
                
                db.session.add(admin_user)
                db.session.add(test_user)
                db.session.commit()
                
                print("Đã tạo tài khoản mẫu:")
                print(f"- Admin: email=admin@example.com, password=admin123")
                print(f"- User: email=test@example.com, password=test123")
                
                # Tạo khách hàng

            # Tạo bảng nếu chưa tồn tại
            with app.app_context():
                db.create_all()
                tables = db.metadata.tables.keys()
                logger.info(f"Các bảng đã tạo: {tables}")

                # Tạo dữ liệu mẫu bao gồm tài khoản để test
                create_sample_data()
                
                logger.info("Database đã được khởi tạo thành công!")

        except Exception as e:
            logger.error(f"Lỗi khi khởi tạo database: {str(e)}")

if __name__ == "__main__":
    init_database()