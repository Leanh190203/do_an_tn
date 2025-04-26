import sys
import os
from alembic import op
import sqlalchemy as sa
from datetime import datetime

# Thêm thư mục gốc của dự án vào đường dẫn để có thể import các module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# revision identifiers
revision = 'add_appointment_fields'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    """
    Thêm các trường mới vào bảng appointments
    """
    # Thêm trường diagnosis
    op.add_column('appointments', sa.Column('diagnosis', sa.Text(), nullable=True))
    
    # Thêm trường clinic
    op.add_column('appointments', sa.Column('clinic', sa.String(100), nullable=True))
    
    # Thêm trường reminder_sent
    op.add_column('appointments', sa.Column('reminder_sent', sa.Boolean(), 
                                           server_default=sa.false(), 
                                           nullable=False))
    
    # Thêm trường follow_up_date
    op.add_column('appointments', sa.Column('follow_up_date', sa.DateTime(), nullable=True))
    
    # Thêm trường completed_by
    op.add_column('appointments', sa.Column('completed_by', sa.Integer(), nullable=True))
    
    # Tạo foreign key cho completed_by
    op.create_foreign_key(
        'fk_appointments_users',
        'appointments', 'users',
        ['completed_by'], ['id'],
        ondelete='SET NULL'
    )
    
    # Cập nhật các giá trị mặc định hợp lý cho dữ liệu hiện có
    op.execute("UPDATE appointments SET reminder_sent = false")
    
    # Log thông tin migration
    print("Đã thêm các trường mới vào bảng appointments")

def downgrade():
    """
    Rollback migration (xóa các trường đã thêm)
    """
    # Xóa foreign key
    op.drop_constraint('fk_appointments_users', 'appointments', type_='foreignkey')
    
    # Xóa các trường đã thêm
    op.drop_column('appointments', 'completed_by')
    op.drop_column('appointments', 'follow_up_date')
    op.drop_column('appointments', 'reminder_sent')
    op.drop_column('appointments', 'clinic')
    op.drop_column('appointments', 'diagnosis')
    
    # Log thông tin rollback
    print("Đã xóa các trường đã thêm khỏi bảng appointments") 