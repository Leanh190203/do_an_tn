import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  RefreshControl, 
  TextInput,
  Image,
  StatusBar,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import medicalRecordService from '../services/medicalRecordService';
import { styles } from '../styles/benh_an.styles';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import customerService from '../services/customerService';
import { commonColors } from '../styles/common.styles';

interface MedicalRecordItem {
  id: number;
  pet_id: number;
  customer_id: number;
  date: string;
  diagnosis: string;
  service: string;
  clinic: string;
  notes: string;
  status: string;
  // Thông tin đầy đủ
  pet?: {
    id: number;
    name: string;
    species: string;
  };
  customer?: {
    id: number;
    name: string;
    phone: string;
  };
  // Thông tin dự phòng
  petName?: string;
  customerName?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function MedicalRecordsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecordItem[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<{ id: number } | null>(null);
  
  // Animation value for search bar
  const searchBarHeight = useState(new Animated.Value(0))[0];

  const loadMedicalRecords = async () => {
    try {
      setLoading(true);
      
      // Nếu người dùng đã đăng nhập, lấy thông tin customer
      if (user) {
        try {
          const customerData = await customerService.getCustomerByUserId(user.id);
          if (customerData) {
            setCurrentCustomer(customerData);
            
            // Lấy bệnh án theo customer_id trực tiếp từ API
            const customerRecords = await medicalRecordService.getMedicalRecordsByCustomerId(customerData.id);
            setMedicalRecords(customerRecords);
            setFilteredRecords(customerRecords);
          } else {
            // Không tìm thấy thông tin khách hàng
            const records = await medicalRecordService.getAllMedicalRecords();
            setMedicalRecords(records);
            setFilteredRecords(records);
          }
        } catch (error) {
          console.error('Lỗi khi tải thông tin khách hàng:', error);
          // Trong trường hợp lỗi, lấy tất cả bệnh án
          const records = await medicalRecordService.getAllMedicalRecords();
          setMedicalRecords(records);
          setFilteredRecords(records);
        }
      } else {
        // Nếu chưa đăng nhập, lấy tất cả bệnh án
        const records = await medicalRecordService.getAllMedicalRecords();
        setMedicalRecords(records);
        setFilteredRecords(records);
      }
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

  useEffect(() => {
    filterRecords();
  }, [searchQuery, selectedStatusFilter, medicalRecords]);

  useEffect(() => {
    Animated.timing(searchBarHeight, {
      toValue: isSearchVisible ? 60 : 0,
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [isSearchVisible]);

  const filterRecords = () => {
    let filtered = [...medicalRecords];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record => 
        (record.pet?.name?.toLowerCase().includes(query)) ||
        (record.petName?.toLowerCase().includes(query)) ||
        (record.customer?.name?.toLowerCase().includes(query)) ||
        (record.customerName?.toLowerCase().includes(query)) ||
        (record.diagnosis?.toLowerCase().includes(query)) ||
        (record.service?.toLowerCase().includes(query))
      );
    }
    
    // Filter by status
    if (selectedStatusFilter !== 'all') {
      if (selectedStatusFilter === 'appointments') {
        // Lịch hẹn: bao gồm các trạng thái pending và confirmed, 
        // hoặc nếu không có status thì dựa vào ngày
        filtered = filtered.filter(record => 
          record.status === 'pending' || 
          record.status === 'confirmed' || 
          (
            !record.status && 
            new Date(record.date) > new Date()
          )
        );
      } else if (selectedStatusFilter === 'completed') {
        // Đã khám: bao gồm trạng thái completed,
        // hoặc nếu không có status thì dựa vào ngày
        filtered = filtered.filter(record => 
          record.status === 'completed' || 
          (
            !record.status && 
            new Date(record.date) <= new Date()
          )
        );
      }
    }
    
    setFilteredRecords(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMedicalRecords();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const toggleSearchBar = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
    }
  };

  const getStatusColor = (record: MedicalRecordItem) => {
    // Sử dụng status để xác định màu sắc thay vì dựa vào ngày
    switch (record.status) {
      case 'completed':
        return commonColors.success;
      case 'confirmed':
        return commonColors.primary;
      case 'pending':
        return commonColors.warning;
      case 'cancelled':
        return commonColors.error;
      default:
        // Nếu không có status, kiểm tra theo ngày như cũ
        const recordDate = new Date(record.date);
        const today = new Date();
        return recordDate > today ? commonColors.warning : commonColors.success;
    }
  };

  const getStatusText = (record: MedicalRecordItem) => {
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
        // Nếu không có status, kiểm tra theo ngày như cũ
        const recordDate = new Date(record.date);
        const today = new Date();
        return recordDate > today ? 'Lịch hẹn' : 'Hoàn thành';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={commonColors.primary} />
        <Text style={styles.loadingText}>Đang tải danh sách bệnh án...</Text>
      </View>
    );
  }

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="light-content" backgroundColor={commonColors.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[commonColors.primary, commonColors.primaryLight]}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={commonColors.textInverted} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử khám & Lịch hẹn</Text>
        <TouchableOpacity onPress={toggleSearchBar}>
          <Ionicons name={isSearchVisible ? "close" : "search"} size={24} color={commonColors.textInverted} />
        </TouchableOpacity>
      </LinearGradient>
      
      <Animated.View style={[styles.searchContainer, { height: searchBarHeight }]}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={commonColors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên thú cưng hoặc dịch vụ..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={commonColors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
      
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedStatusFilter === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedStatusFilter('all')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedStatusFilter === 'all' && styles.filterButtonTextActive
            ]}>Tất cả</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedStatusFilter === 'appointments' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedStatusFilter('appointments')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedStatusFilter === 'appointments' && styles.filterButtonTextActive
            ]}>Lịch hẹn</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedStatusFilter === 'completed' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedStatusFilter('completed')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedStatusFilter === 'completed' && styles.filterButtonTextActive
            ]}>Đã khám</Text>
          </TouchableOpacity>
        </View>
        
        {filteredRecords.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={80} color={commonColors.primaryLight} />
            <Text style={styles.emptyTitle}>Không có bệnh án nào</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => router.push('/home/them_benh_an')}
            >
              <Text style={styles.emptyButtonText}>Đặt lịch khám</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredRecords}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => {
              const statusColor = getStatusColor(item);
              const statusText = getStatusText(item);
              
              return (
                <AnimatedTouchable 
                  style={styles.card}
                  onPress={() => router.push(`/home/benh_an/${item.id}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.petInfoContainer}>
                      <Text style={styles.petName}>
                        {item.pet?.name || item.petName || 'Không có tên'}
                      </Text>
                      <Text style={styles.petOwner}>
                        {item.customer?.name || item.customerName || 'Không có thông tin'}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                      <Text style={styles.statusText}>{statusText}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.cardDivider} />
                  
                  <View style={styles.cardContent}>
                    <View style={styles.infoMainRow}>
                      <View style={styles.dateContainer}>
                        <MaterialCommunityIcons name="calendar" size={16} color={commonColors.primary} />
                        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                      </View>
                      <View style={styles.serviceBadge}>
                        <MaterialCommunityIcons name="medical-bag" size={14} color={commonColors.primary} />
                        <Text style={styles.serviceText} numberOfLines={2}>
                          {`Dịch vụ: ${item.service}`}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.diagnosisRow}>
                      <View style={styles.diagnosisContainer}>
                        <MaterialCommunityIcons 
                          name="stethoscope" 
                          size={16} 
                          color={item.status === 'completed' ? commonColors.success : commonColors.warning} 
                        />
                        <Text style={styles.diagnosisLabel}>Chẩn đoán:</Text>
                        <Text style={[
                          styles.diagnosisText, 
                          {
                            color: item.status === 'completed' ? commonColors.success : commonColors.warning,
                            fontStyle: item.status === 'completed' ? 'normal' : 'italic'
                          }
                        ]}>
                          {item.status === 'completed' ? 
                            'Đã hoàn thành' : 
                            (item.diagnosis || 'Đang chuẩn đoán')
                          }
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.cardActions}>
                    <Text style={styles.viewDetailsText}>Xem chi tiết</Text>
                    <Ionicons name="chevron-forward" size={16} color={commonColors.primary} />
                  </View>
                </AnimatedTouchable>
              );
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[commonColors.primary]}
              />
            }
          />
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => router.push('/home/them_benh_an')}
      >
        <Ionicons name="add" size={24} color={commonColors.textInverted} />
      </TouchableOpacity>
    </View>
  );
}
