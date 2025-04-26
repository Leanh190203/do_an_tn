import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import petService from '../services/petService';
import customerService from '../services/customerService';
import medicalRecordService, { MedicalRecord } from '../services/medicalRecordService';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from '../styles/add_benh_an.styles';
import { LinearGradient } from 'expo-linear-gradient';

interface Pet {
  id: number;
  name: string;
  species: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
}

// Danh sách dịch vụ mẫu để hiển thị UI đẹp hơn
const serviceOptions = [
  { id: '1', name: 'Khám nội', icon: 'stethoscope' },
  { id: '2', name: 'Điều trị nội khoa', icon: 'medical-bag' },
  { id: '3', name: 'Theo dõi bệnh lý', icon: 'clipboard-pulse' },
  { id: '4', name: 'Xét nghiệm máu', icon: 'test-tube' },
  { id: '5', name: 'Siêu âm', icon: 'heart-pulse' },
  { id: '6', name: 'Tắm & Spa', icon: 'shower-head' },
  { id: '7', name: 'Cắt tỉa lông', icon: 'content-cut' },
  { id: '8', name: 'Khám răng', icon: 'tooth' },
];

export default function ThemBenhAnScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [service, setService] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [clinic, setClinic] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Load pets and customers
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const petsData = await petService.getAllPets();
        setPets(petsData);
        
        const customersData = await customerService.getAllCustomers();
        setCustomers(customersData);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        Alert.alert('Lỗi', 'Không thể tải dữ liệu: ' + errorMessage);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const selectService = (id: string, name: string) => {
    setSelectedServiceId(id);
    setService(name);
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!selectedPet || !selectedCustomer) {
        Alert.alert('Thông tin thiếu', 'Vui lòng chọn chủ thú cưng và thú cưng trước khi tiếp tục');
        return;
      }
    }
    if (currentStep === 2) {
      if (!service || !date) {
        Alert.alert('Thông tin thiếu', 'Vui lòng chọn dịch vụ và ngày hẹn trước khi tiếp tục');
        return;
      }
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!selectedPet || !selectedCustomer || !service) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc: Chủ thú cưng, Thú cưng và Dịch vụ');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const medicalRecordData: MedicalRecord = {
        pet_id: Number(selectedPet),
        customer_id: Number(selectedCustomer),
        date: date.toISOString(),
        diagnosis,
        service,
        clinic,
        notes
      };
      
      await medicalRecordService.createMedicalRecord(medicalRecordData);
      Alert.alert('Thành công', 'Đã đặt lịch khám thành công. Chúng tôi sẽ liên hệ lại để xác nhận lịch hẹn của bạn.', [
        { 
          text: 'OK', 
          onPress: () => router.push('/home/benh_an') 
        }
      ]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Lỗi', 'Không thể đặt lịch khám: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <View style={styles.stepIndicator}>
              <View style={styles.stepNumberActive}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
            </View>

            <Text style={styles.stepTitle}>Thông tin cơ bản</Text>

            <View style={styles.formCard}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  <Ionicons name="person" size={18} color="#1976D2" /> Chủ thú cưng:
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    style={styles.picker}
                    selectedValue={selectedCustomer}
                    onValueChange={(itemValue: string) => setSelectedCustomer(itemValue)}
                  >
                    <Picker.Item label="-- Chọn chủ thú cưng --" value="" />
                    {customers.map(customer => (
                      <Picker.Item 
                        key={customer.id} 
                        label={`${customer.name} (${customer.phone})`} 
                        value={customer.id.toString()} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  <MaterialCommunityIcons name="dog" size={18} color="#1976D2" /> Thú cưng:
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    style={styles.picker}
                    selectedValue={selectedPet}
                    onValueChange={(itemValue: string) => setSelectedPet(itemValue)}
                  >
                    <Picker.Item label="-- Chọn thú cưng --" value="" />
                    {pets.map(pet => (
                      <Picker.Item 
                        key={pet.id} 
                        label={`${pet.name} (${pet.species})`} 
                        value={pet.id.toString()} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
          </>
        );

      case 2:
        return (
          <>
            <View style={styles.stepIndicator}>
              <View style={[styles.stepNumber, styles.stepCompleted]}>
                <Ionicons name="checkmark" size={16} color="#FFF" />
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepNumberActive}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
            </View>

            <Text style={styles.stepTitle}>Chọn dịch vụ & Thời gian</Text>

            <View style={styles.formCard}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  <Ionicons name="calendar" size={18} color="#1976D2" /> Ngày đặt lịch:
                </Text>
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateText}>
                    {date.toLocaleDateString('vi-VN')}
                  </Text>
                  <Ionicons name="calendar" size={24} color="#1976D2" />
                </TouchableOpacity>
                
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  <MaterialCommunityIcons name="hospital" size={18} color="#1976D2" /> Dịch vụ cần sử dụng:
                </Text>

                <View style={styles.serviceOptionsContainer}>
                  {serviceOptions.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.serviceOption,
                        selectedServiceId === item.id && styles.serviceOptionSelected
                      ]}
                      onPress={() => selectService(item.id, item.name)}
                    >
                      <MaterialCommunityIcons 
                        name={item.icon as any} 
                        size={24} 
                        color={selectedServiceId === item.id ? "#FFF" : "#1976D2"} 
                      />
                      <Text 
                        style={[
                          styles.serviceOptionText,
                          selectedServiceId === item.id && styles.serviceOptionTextSelected
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </>
        );

      case 3:
        return (
          <>
            <View style={styles.stepIndicator}>
              <View style={[styles.stepNumber, styles.stepCompleted]}>
                <Ionicons name="checkmark" size={16} color="#FFF" />
              </View>
              <View style={styles.stepLine} />
              <View style={[styles.stepNumber, styles.stepCompleted]}>
                <Ionicons name="checkmark" size={16} color="#FFF" />
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepNumberActive}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
            </View>

            <Text style={styles.stepTitle}>Thông tin bổ sung</Text>

            <View style={styles.formCard}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  <Ionicons name="medical" size={18} color="#1976D2" /> Triệu chứng / Vấn đề:
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={diagnosis}
                  onChangeText={setDiagnosis}
                  placeholder="Mô tả tình trạng của thú cưng"
                  multiline
                  numberOfLines={4}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  <MaterialCommunityIcons name="hospital-building" size={18} color="#1976D2" /> Phòng khám:
                </Text>
                <TextInput
                  style={styles.input}
                  value={clinic}
                  onChangeText={setClinic}
                  placeholder="Nhập phòng khám (nếu có yêu cầu)"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  <Ionicons name="information-circle" size={18} color="#1976D2" /> Ghi chú thêm:
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Thông tin thêm mà bạn muốn phòng khám biết"
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Thông tin lịch hẹn</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Thú cưng:</Text>
                <Text style={styles.summaryValue}>
                  {selectedPet ? pets.find(p => p.id.toString() === selectedPet)?.name || '' : ''}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Chủ thú:</Text>
                <Text style={styles.summaryValue}>
                  {selectedCustomer ? customers.find(c => c.id.toString() === selectedCustomer)?.name || '' : ''}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Ngày hẹn:</Text>
                <Text style={styles.summaryValue}>{date.toLocaleDateString('vi-VN')}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Dịch vụ:</Text>
                <Text style={styles.summaryValue}>{service}</Text>
              </View>
            </View>
          </>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
      
      <LinearGradient
        colors={['#1976D2', '#2196F3']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Image 
          source={require('@/assets/images/Logo_DAI_NAM.png')} 
          style={styles.headerLogo} 
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Đặt lịch khám</Text>
      </LinearGradient>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {renderStep()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity 
            style={styles.prevButton}
            onPress={prevStep}
          >
            <Ionicons name="arrow-back" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Quay lại</Text>
          </TouchableOpacity>
        )}

        {currentStep < 3 ? (
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={nextStep}
          >
            <Text style={styles.buttonText}>Tiếp tục</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                <Text style={styles.buttonText}>Hoàn tất đặt lịch</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
} 