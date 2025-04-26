#!/usr/bin/env python3
import os
import sys
from flask import Flask
import sqlalchemy as sa
from sqlalchemy.sql import text
import logging

# Thêm thư mục gốc vào PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Import sau khi thêm path
from pet_api.models import db
from pet_api.config import Config

# Thiết lập logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    return app

def run_migration():
    try:
        logger.info("Bắt đầu cập nhật cấu trúc bảng appointments...")
        
        app = create_app()
        with app.app_context():
            # Kiểm tra xem bảng appointments có tồn tại không
            try:
                inspector = db.inspect(db.engine)
                tables = inspector.get_table_names()
                if 'appointments' not in tables:
                    logger.error("Bảng appointments không tồn tại!")
                    return False
                    
                logger.info(f"Đã tìm thấy bảng appointments, tiếp tục cập nhật cấu trúc...")
            except Exception as e:
                logger.error(f"Lỗi khi kiểm tra bảng: {str(e)}")
                return False
                
            # Thêm các cột mới nếu chưa tồn tại
            columns = [column['name'] for column in inspector.get_columns('appointments')]
            logger.info(f"Các cột hiện tại: {', '.join(columns)}")
            
            # Tạo danh sách các cột cần thêm
            columns_to_add = []
            
            if 'diagnosis' not in columns:
                columns_to_add.append({
                    'name': 'diagnosis',
                    'sql': "ALTER TABLE appointments ADD COLUMN diagnosis TEXT NULL"
                })
                
            if 'clinic' not in columns:
                columns_to_add.append({
                    'name': 'clinic',
                    'sql': "ALTER TABLE appointments ADD COLUMN clinic VARCHAR(100) NULL"
                })
                
            if 'reminder_sent' not in columns:
                columns_to_add.append({
                    'name': 'reminder_sent',
                    'sql': "ALTER TABLE appointments ADD COLUMN reminder_sent BOOLEAN NOT NULL DEFAULT FALSE"
                })
                
            if 'follow_up_date' not in columns:
                columns_to_add.append({
                    'name': 'follow_up_date',
                    'sql': "ALTER TABLE appointments ADD COLUMN follow_up_date DATETIME NULL"
                })
                
            if 'completed_by' not in columns:
                columns_to_add.append({
                    'name': 'completed_by',
                    'sql': "ALTER TABLE appointments ADD COLUMN completed_by INT NULL"
                })
            
            # Thêm các cột mới
            connection = db.engine.connect()
            try:
                for column in columns_to_add:
                    try:
                        connection.execute(text(column['sql']))
                        logger.info(f"Đã thêm cột '{column['name']}' vào bảng appointments")
                    except Exception as e:
                        logger.error(f"Lỗi khi thêm cột {column['name']}: {str(e)}")
                        # Tiếp tục thêm các cột khác ngay cả khi một cột lỗi
            finally:
                connection.close()
            
            # Kiểm tra và tạo foreign key cho completed_by nếu cần
            if 'completed_by' in [c['name'] for c in columns_to_add]:
                try:
                    connection = db.engine.connect()
                    try:
                        sql = """
                        ALTER TABLE appointments 
                        ADD CONSTRAINT fk_appointments_users 
                        FOREIGN KEY (completed_by) REFERENCES users(id) 
                        ON DELETE SET NULL
                        """
                        connection.execute(text(sql))
                        logger.info("Đã thêm foreign key cho cột completed_by")
                    except Exception as e:
                        logger.error(f"Lỗi khi thêm foreign key: {str(e)}")
                    finally:
                        connection.close()
                except Exception as e:
                    logger.error(f"Lỗi khi thêm foreign key: {str(e)}")
            
            # Kết quả
            if not columns_to_add:
                logger.info("Tất cả các cột đã tồn tại, không cần cập nhật.")
            else:
                logger.info(f"Đã thêm {len(columns_to_add)} cột vào bảng appointments")
            
            return True
            
    except Exception as e:
        logger.error(f"Lỗi khi chạy migration: {str(e)}")
        return False

if __name__ == "__main__":
    result = run_migration()
    if result:
        logger.info("Migration hoàn tất thành công!")
    else:
        logger.error("Migration thất bại!")
        sys.exit(1) 