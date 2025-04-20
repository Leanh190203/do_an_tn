import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/dat_lich.styles';

// Danh sách dịch vụ
const services = [
  { id: '1', name: 'Khám Tổng Quát', icon: 'stethoscope', price: '200.000 VND' },
  { id: '2', name: 'Tiêm Phòng', icon: 'needle', price: '250.000 VND' },
  { id: '3', name: 'Điều Trị Bệnh', icon: 'medical-bag', price: '300.000 VND' },
  { id: '4', name: 'Tắm & Spa', icon: 'shower', price: '180.000 VND' },
  { id: '5', name: 'Cắt Tỉa Lông', icon: 'content-cut', price: '150.000 VND' },
];

export default function AppointmentScreen() {
  const router = useRouter();
  const { isSignedIn, user } = useAuth();
  
  // State cho thông tin lịch hẹn
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [appointmentTime, setAppointmentTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [loading, setLoading] = useState(false);
  const [ownerName, setOwnerName] = useState(user?.name || '');
  const [ownerPhone, setOwnerPhone] = useState(user?.phone || '');

  // Format date để hiển thị
  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Format time để hiển thị
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Xử lý khi thay đổi ngày
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setAppointmentDate(selectedDate);
    }
  };

  // Xử lý khi thay đổi giờ
  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setAppointmentTime(selectedTime);
    }
  };

  // Xử lý khi chọn dịch vụ
  const selectService = (serviceId: string) => {
    setSelectedService(serviceId === selectedService ? '' : serviceId);
  };

  // Xử lý khi gửi thông tin lịch hẹn
  const handleSubmit = () => {
    // Kiểm tra thông tin bắt buộc
    if (!petName.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên thú cưng');
      return;
    }
    
    if (!petType.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập loại thú cưng');
      return;
    }
    
    if (!selectedService) {
      Alert.alert('Thông báo', 'Vui lòng chọn dịch vụ');
      return;
    }
    
    if (!ownerName.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên chủ thú cưng');
      return;
    }
    
    if (!ownerPhone.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập số điện thoại liên hệ');
      return;
    }

    // Hiển thị loading
    setLoading(true);

    // Mô phỏng API call
    setTimeout(() => {
      setLoading(false);
      
      // Tạo thông tin chi tiết lịch hẹn
      const selectedServiceObj = services.find(s => s.id === selectedService);
      const appointmentDetails = {
        petName,
        petType,
        symptoms,
        date: formatDate(appointmentDate),
        time: formatTime(appointmentTime),
        service: selectedServiceObj?.name || '',
        ownerName,
        ownerPhone
      };
      
      // Log thông tin lịch hẹn
      console.log('Thông tin lịch hẹn:', appointmentDetails);
      
      // Hiển thị thông báo thành công
      Alert.alert(
        'Đặt lịch thành công',
        `Lịch hẹn khám của bạn đã được đặt thành công vào ngày ${formatDate(appointmentDate)} lúc ${formatTime(appointmentTime)}. Chúng tôi sẽ liên hệ với bạn qua số điện thoại ${ownerPhone} để xác nhận.`,
        [
          {
            text: 'OK',
            onPress: () => router.push('/' as never),
          },
        ]
      );
    }, 1500);
  };

  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#1976D2" barStyle="light-content" />
        <View style={styles.notLoggedInContainer}>
          <Image 
            source={require('@/assets/images/Logo_DAI_NAM.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={styles.notLoggedInTitle}>Đăng nhập để đặt lịch</Text>
          <Text style={styles.notLoggedInText}>
            Vui lòng đăng nhập để sử dụng chức năng đặt lịch khám.
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/home/dang_nhap')}
          >
            <MaterialCommunityIcons name="login" size={20} color="#FFFFFF" />
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar backgroundColor="#1976D2" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt Lịch Khám</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="information-outline" size={24} color="#1976D2" />
          <Text style={styles.infoText}>
            Vui lòng nhập đầy đủ thông tin để đặt lịch khám cho thú cưng của bạn.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Thông tin thú cưng</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên thú cưng <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="paw" size={20} color="#1976D2" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập tên thú cưng"
                value={petName}
                onChangeText={setPetName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Loại thú cưng <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="dog" size={20} color="#1976D2" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: Chó, Mèo, Hamster,..."
                value={petType}
                onChangeText={setPetType}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Triệu chứng / Lý do khám</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <MaterialCommunityIcons name="text-box" size={20} color="#1976D2" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Mô tả triệu chứng hoặc lý do khám"
                value={symptoms}
                onChangeText={setSymptoms}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <Text style={[styles.sectionTitle, styles.serviceSection]}>Chọn dịch vụ <Text style={styles.required}>*</Text></Text>

          <View style={styles.serviceList}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceItem,
                  selectedService === service.id && styles.selectedService,
                ]}
                onPress={() => selectService(service.id)}
              >
                <View style={styles.serviceIconContainer}>
                  <MaterialCommunityIcons 
                    name={service.icon as any} 
                    size={24} 
                    color={selectedService === service.id ? '#FFFFFF' : '#1976D2'} 
                  />
                </View>
                <View style={styles.serviceInfo}>
                  <Text 
                    style={[
                      styles.serviceName,
                      selectedService === service.id && styles.selectedServiceText,
                    ]}
                  >
                    {service.name}
                  </Text>
                  <Text 
                    style={[
                      styles.servicePrice,
                      selectedService === service.id && styles.selectedServiceText,
                    ]}
                  >
                    {service.price}
                  </Text>
                </View>
                {selectedService === service.id && (
                  <MaterialCommunityIcons name="check-circle" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionTitle, styles.dateTimeSection]}>Thời gian khám</Text>

          <View style={styles.dateTimeContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.label}>Ngày khám <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <MaterialCommunityIcons name="calendar" size={20} color="#1976D2" />
                <Text style={styles.dateTimeText}>{formatDate(appointmentDate)}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#1976D2" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={appointmentDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.timeContainer}>
              <Text style={styles.label}>Giờ khám <Text style={styles.required}>*</Text></Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowTimePicker(true)}
              >
                <MaterialCommunityIcons name="clock-outline" size={20} color="#1976D2" />
                <Text style={styles.dateTimeText}>{formatTime(appointmentTime)}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#1976D2" />
              </TouchableOpacity>
              {showTimePicker && (
                <DateTimePicker
                  value={appointmentTime}
                  mode="time"
                  display="default"
                  onChange={onTimeChange}
                />
              )}
            </View>
          </View>

          <Text style={[styles.sectionTitle, styles.contactSection]}>Thông tin liên hệ</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên chủ thú cưng <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account" size={20} color="#1976D2" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập tên chủ thú cưng"
                value={ownerName}
                onChangeText={setOwnerName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="phone" size={20} color="#1976D2" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại liên hệ"
                value={ownerPhone}
                onChangeText={setOwnerPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="calendar-check" size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Đặt lịch</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>Lưu ý:</Text>
          <View style={styles.noteItem}>
            <MaterialCommunityIcons name="circle-medium" size={16} color="#1976D2" />
            <Text style={styles.noteText}>Vui lòng đến trước giờ hẹn 15 phút</Text>
          </View>
          <View style={styles.noteItem}>
            <MaterialCommunityIcons name="circle-medium" size={16} color="#1976D2" />
            <Text style={styles.noteText}>Phòng khám hoạt động từ 7:30 - 17:30 (T2-CN)</Text>
          </View>
          <View style={styles.noteItem}>
            <MaterialCommunityIcons name="circle-medium" size={16} color="#1976D2" />
            <Text style={styles.noteText}>Chúng tôi sẽ gọi điện xác nhận lịch hẹn</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 