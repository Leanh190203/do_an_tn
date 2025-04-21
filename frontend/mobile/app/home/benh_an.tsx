import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import medicalRecordService from '../services/medicalRecordService';
import { styles } from '../styles/benh_an.styles';

interface MedicalRecordItem {
  id: number;
  petName: string;
  owner: string;
  date: string;
  diagnosis: string;
  phone?: string;
  service: string;
  clinic: string;
  notes: string;
}

export default function MedicalRecordsScreen() {
  const router = useRouter();
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMedicalRecords = async () => {
    try {
      const records = await medicalRecordService.getAllMedicalRecords();
      setMedicalRecords(records);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Lỗi', 'Không thể tải danh sách bệnh án: ' + errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMedicalRecords();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadMedicalRecords();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Đang tải danh sách bệnh án...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Danh Sách Bệnh Án</Text>
      
      {medicalRecords.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="medical" size={60} color="#BBDEFB" />
          <Text style={styles.emptyText}>Chưa có bệnh án nào</Text>
        </View>
      ) : (
        <FlatList
          data={medicalRecords}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push(`/home/benh_an/${item.id}`)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.petName}>{item.petName}</Text>
                <Ionicons name="paw" size={24} color="#1976D2" />
              </View>
              <Text style={styles.cardText}>👤 Chủ: {item.owner} {item.phone ? `(${item.phone})` : ''}</Text>
              <Text style={styles.cardText}>📅 Ngày khám: {formatDate(item.date)}</Text>
              <Text style={styles.cardText}>🩺 Chẩn đoán: {item.diagnosis}</Text>
              <Text style={styles.cardText}>🛠️ Dịch vụ: {item.service}</Text>
              <Text style={styles.cardText}>🏥 Phòng khám: {item.clinic}</Text>
              {item.notes && <Text style={styles.cardText} numberOfLines={2}>📝 Ghi chú: {item.notes}</Text>}
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#1976D2"]}
            />
          }
        />
      )}
      
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => router.push('/home/them_benh_an')}
      >
        <Ionicons name="add-circle" size={28} color="#fff" />
        <Text style={styles.addButtonText}>Thêm Bệnh Án</Text>
      </TouchableOpacity>
    </View>
  );
}
