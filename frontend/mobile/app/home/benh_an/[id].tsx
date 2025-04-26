import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import medicalRecordService from '../../services/medicalRecordService';
import { styles } from '../../styles/benh_an_detail.styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import customerService from '../../services/customerService';

export default function MedicalRecordDetailScreen() {
  const { id } = useLocalSearchParams();
  const recordId = typeof id === 'string' ? parseInt(id, 10) : 0;
  const router = useRouter();
  const { user } = useAuth();
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentCustomer, setCurrentCustomer] = useState<{ id: number } | null>(null);

  useEffect(() => {
    const loadRecordDetails = async () => {
      if (!recordId) {
        Alert.alert('Lỗi', 'ID bệnh án không hợp lệ');
        router.back();
        return;
      }

      try {
        // Nếu người dùng đã đăng nhập, lấy thông tin customer
        let customerData = null;
        if (user) {
          try {
            customerData = await customerService.getCustomerByUserId(user.id);
            if (customerData) {
              setCurrentCustomer(customerData);
            }
          } catch (error) {
            console.error('Lỗi khi tải thông tin khách hàng:', error);
          }
        }

        const recordData = await medicalRecordService.getMedicalRecord(recordId);
        
        // Kiểm tra xem người dùng có quyền xem bệnh án này không
        if (user && customerData && recordData.customer_id !== customerData.id) {
          Alert.alert(
            'Không có quyền truy cập', 
            'Bạn không có quyền xem bệnh án này.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
          return;
        }
        
        setRecord(recordData);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        Alert.alert('Lỗi', 'Không thể tải chi tiết bệnh án: ' + errorMessage);
        router.back();
      } finally {
        setLoading(false);
      }
    };

    loadRecordDetails();
  }, [recordId, router, user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Hàm xác định màu sắc dựa vào trạng thái
  const getStatusColor = (record: any) => {
    // Sử dụng status để xác định màu sắc thay vì dựa vào ngày
    switch (record.status) {
      case 'completed':
        return '#4CAF50'; // Đã hoàn thành (xanh lá)
      case 'confirmed':
        return '#1976D2'; // Đã xác nhận (xanh dương)
      case 'pending':
        return '#FF9800'; // Đang chờ (cam)
      case 'cancelled':
        return '#F44336'; // Đã hủy (đỏ)
      default:
        // Nếu không có status, kiểm tra theo ngày
        const recordDate = new Date(record.date);
        const today = new Date();
        return recordDate > today ? '#FF9800' : '#4CAF50';
    }
  };

  // Hàm xác định text hiển thị dựa vào trạng thái
  const getStatusText = (record: any) => {
    // Sử dụng status để xác định text hiển thị
    switch (record.status) {
      case 'completed':
        return 'Đã khám';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      default:
        // Nếu không có status, kiểm tra theo ngày
        const recordDate = new Date(record.date);
        const today = new Date();
        return recordDate > today ? 'Lịch hẹn' : 'Hoàn thành';
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa bệnh án này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await medicalRecordService.deleteMedicalRecord(recordId);
              Alert.alert('Thành công', 'Đã xóa bệnh án', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error: unknown) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error';
              Alert.alert('Lỗi', 'Không thể xóa bệnh án: ' + errorMessage);
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Đang tải thông tin bệnh án...</Text>
      </View>
    );
  }

  if (!record) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#FF5252" />
        <Text style={styles.errorText}>Không tìm thấy bệnh án</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi Tiết Bệnh Án</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin thú cưng</Text>
          <View style={styles.row}>
            <Ionicons name="paw" size={20} color="#1976D2" />
            <Text style={styles.label}>Tên:</Text>
            <Text style={styles.value}>{record.pet?.name || record.petName || 'Không có thông tin'}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="person" size={20} color="#1976D2" />
            <Text style={styles.label}>Chủ:</Text>
            <Text style={styles.value}>{record.customer?.name || record.customerName || 'Không có thông tin'}</Text>
          </View>
          {record.pet?.species && (
            <View style={styles.row}>
              <MaterialCommunityIcons name="paw" size={20} color="#1976D2" />
              <Text style={styles.label}>Loài:</Text>
              <Text style={styles.value}>{record.pet.species}</Text>
            </View>
          )}
          {record.customer?.phone && (
            <View style={styles.row}>
              <Ionicons name="call" size={20} color="#1976D2" />
              <Text style={styles.label}>Liên hệ:</Text>
              <Text style={styles.value}>{record.customer.phone}</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khám</Text>
          <View style={styles.row}>
            <Ionicons name="calendar" size={20} color="#1976D2" />
            <Text style={styles.label}>Ngày khám:</Text>
            <Text style={styles.value}>{formatDate(record.date)}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="medkit" size={20} color="#1976D2" />
            <Text style={styles.label}>Dịch vụ:</Text>
            <Text style={styles.value}>{record.service}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="medical" size={20} color="#1976D2" />
            <Text style={styles.label}>Chẩn đoán:</Text>
            <Text style={styles.value}>{record.diagnosis || 'Chưa có chẩn đoán'}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="business" size={20} color="#1976D2" />
            <Text style={styles.label}>Phòng khám:</Text>
            <Text style={styles.value}>{record.clinic}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="hourglass" size={20} color="#1976D2" />
            <Text style={styles.label}>Trạng thái:</Text>
            <View style={[
              styles.statusBadge, 
              { 
                backgroundColor: getStatusColor(record),
                marginLeft: 8
              }
            ]}>
              <Text style={styles.statusBadgeText}>{getStatusText(record)}</Text>
            </View>
          </View>
        </View>

        {record.notes && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ghi chú</Text>
              <Text style={styles.notesText}>{record.notes}</Text>
            </View>
          </>
        )}
      </View>

      {/* Chỉ hiển thị nút xóa và chỉnh sửa nếu đây là bệnh án của khách hàng đang đăng nhập */}
      {(!user || (currentCustomer && record.customer_id === currentCustomer.id)) && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]} 
            onPress={() => router.push(`/home/edit_benh_an/${recordId}` as any)}
          >
            <Ionicons name="create" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Chỉnh sửa</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={handleDelete}
          >
            <Ionicons name="trash" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Thêm nút xem thú cưng */}
      {record.pet_id && currentCustomer && record.customer_id === currentCustomer.id && (
        <TouchableOpacity 
          style={styles.viewPetButton}
          onPress={() => router.push(`/home/my_pets?edit=${record.pet_id}` as any)}
        >
          <MaterialCommunityIcons name="paw" size={20} color="#1976D2" />
          <Text style={styles.viewPetButtonText}>Sửa thông tin thú cưng</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
} 