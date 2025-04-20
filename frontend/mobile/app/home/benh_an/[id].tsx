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

export default function MedicalRecordDetailScreen() {
  const { id } = useLocalSearchParams();
  const recordId = typeof id === 'string' ? parseInt(id, 10) : 0;
  const router = useRouter();
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecordDetails = async () => {
      if (!recordId) {
        Alert.alert('Lỗi', 'ID bệnh án không hợp lệ');
        router.back();
        return;
      }

      try {
        const recordData = await medicalRecordService.getMedicalRecordById(recordId);
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
  }, [recordId, router]);

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
            <Text style={styles.value}>{record.petName}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="person" size={20} color="#1976D2" />
            <Text style={styles.label}>Chủ:</Text>
            <Text style={styles.value}>{record.owner}</Text>
          </View>
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
            <Text style={styles.value}>{record.diagnosis}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="business" size={20} color="#1976D2" />
            <Text style={styles.label}>Phòng khám:</Text>
            <Text style={styles.value}>{record.clinic}</Text>
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
    </ScrollView>
  );
} 