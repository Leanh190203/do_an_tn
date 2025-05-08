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
  StatusBar,
  Modal
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
import { useAuth } from '../context/AuthContext';

interface Pet {
  id: number;
  name: string;
  species: string;
  age?: number;
  weight?: number;
  description?: string;
  symptoms?: string;
  customer_id: number;
  gender?: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
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
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  
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

  // Add new state variables for the appointment confirmation modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<MedicalRecord | null>(null);
  const [petDetails, setPetDetails] = useState<Pet | null>(null);
  const [customerDetails, setCustomerDetails] = useState<Customer | null>(null);

  // Thêm state mới để lưu thông tin thú cưng nhập tự do
  const [customPetName, setCustomPetName] = useState('');
  const [customPetSpecies, setCustomPetSpecies] = useState('');
  const [isCustomPet, setIsCustomPet] = useState(false);

  // Load pets and customers, with special handling for logged-in users
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Nếu user đã đăng nhập (bất kỳ loại vai trò nào)
        if (user) {
          console.log("Người dùng đăng nhập:", user.name, user.id);
          
          // Lấy thông tin customer từ user_id
          let customerData = await customerService.getCustomerByUserId(user.id);
          
          if (customerData) {
            console.log("Tìm thấy thông tin khách hàng:", customerData.name);
            // Lưu thông tin khách hàng và tự động chọn
            setCurrentCustomer(customerData);
            setSelectedCustomer(customerData.id.toString());
            
            // Chỉ lấy danh sách thú cưng của khách hàng này
            const petsData = await customerService.getCustomerPets(customerData.id);
            setPets(petsData);
            
            // Danh sách khách hàng chỉ có 1 phần tử - là tài khoản người dùng đang đăng nhập
            setCustomers([customerData]);
          } else {
            // Nếu không tìm thấy thông tin khách hàng, có thể là tài khoản admin hoặc chưa liên kết
            const allCustomersData = await customerService.getAllCustomers();
            setCustomers(allCustomersData);
            
            // Tìm trong danh sách khách hàng nếu có email trùng với email của user đang đăng nhập
            const matchedCustomer = allCustomersData.find((c: Customer) => c.email === user.email);
            if (matchedCustomer) {
              setCurrentCustomer(matchedCustomer);
              setSelectedCustomer(matchedCustomer.id.toString());
              
              // Lấy danh sách thú cưng của khách hàng này
              const petsData = await customerService.getCustomerPets(matchedCustomer.id);
              setPets(petsData);
            } else {
              // Vẫn tải tất cả thú cưng nếu không tìm thấy thông tin liên kết
              const allPetsData = await petService.getAllPets();
              setPets(allPetsData);
            }
          }
        } else {
          // Trường hợp chưa đăng nhập - tải tất cả dữ liệu bình thường
          console.log("Người dùng chưa đăng nhập");
          
          const petsData = await petService.getAllPets();
          setPets(petsData);
          
          const customersData = await customerService.getAllCustomers();
          setCustomers(customersData);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error("Lỗi khi tải dữ liệu:", errorMessage);
        Alert.alert('Lỗi', 'Không thể tải dữ liệu: ' + errorMessage);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [user]);

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
      // Kiểm tra chủ thú cưng và thú cưng
      if (!currentCustomer && !selectedCustomer) {
        Alert.alert('Thông tin thiếu', 'Vui lòng chọn chủ thú cưng trước khi tiếp tục');
        return;
      }
      
      // Kiểm tra thú cưng đã chọn hoặc nhập thú cưng mới
      if (!isCustomPet && !selectedPet) {
        Alert.alert('Thông tin thiếu', 'Vui lòng chọn thú cưng từ danh sách hoặc thêm thú cưng mới');
        return;
      }
      
      // Kiểm tra thông tin thú cưng mới nếu đang trong chế độ thêm mới
      if (isCustomPet && (!customPetName || !customPetSpecies)) {
        Alert.alert('Thông tin thiếu', 'Vui lòng nhập đầy đủ tên và loài thú cưng');
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!service || !date) {
        Alert.alert('Thông tin thiếu', 'Vui lòng chọn dịch vụ và ngày hẹn');
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

  // Vô hiệu hóa phần chuyển đổi isCustomPet khi chưa chọn khách hàng
  const handleToggleCustomPet = (value: boolean) => {
    // Nếu không có tài khoản đăng nhập và chưa chọn khách hàng, không cho phép chuyển sang thêm mới
    if (value && !currentCustomer && !selectedCustomer) {
      Alert.alert('Thông báo', 'Vui lòng chọn chủ thú cưng trước khi thêm thú cưng mới');
      return;
    }
    setIsCustomPet(value);
  };

  // Sửa hàm handleSubmit, thêm xử lý thông báo khi chưa đăng nhập và chưa chọn chủ thú cưng
  const handleSubmit = async () => {
    // Validation - kiểm tra chủ sở hữu
    if (!selectedCustomer && !currentCustomer) {
      Alert.alert('Lỗi', 'Vui lòng chọn chủ thú cưng trước khi tiếp tục');
      return;
    }

    // Validate pet information
    if (isCustomPet) {
      // Validation for custom pet - chỉ kiểm tra tên và loài
      if (!customPetName || !customPetSpecies) {
        Alert.alert('Lỗi', 'Vui lòng nhập tên và loài thú cưng');
        return;
      }
    } else if (!selectedPet) {
      // Validation for selected pet from list
      Alert.alert('Lỗi', 'Vui lòng chọn thú cưng từ danh sách hoặc thêm thú cưng mới');
      return;
    }

    if (!service || !date) {
      Alert.alert('Lỗi', 'Vui lòng chọn dịch vụ và ngày hẹn');
      return;
    }

    try {
      setIsSubmitting(true);

      let petId = selectedPet;

      // Nếu người dùng nhập thú cưng tùy ý, cần tạo pet mới
      if (isCustomPet) {
        try {
          // Luôn sử dụng ID của tài khoản đăng nhập nếu có
          let customerId = parseInt(selectedCustomer);
          
          // Nếu có user đăng nhập và có thông tin current customer, luôn ưu tiên dùng
          if (user && currentCustomer) {
            customerId = currentCustomer.id;
            console.log("Đang sử dụng ID của tài khoản đăng nhập:", customerId);
          } else {
            console.log("Đang sử dụng ID chủ thú cưng được chọn:", customerId);
          }

          if (!customerId) {
            throw new Error('Không xác định được chủ thú cưng');
          }

          // Chỉ sử dụng tên và loài
          const newPet = await petService.createPet({
            name: customPetName,
            species: customPetSpecies,
            customer_id: customerId
          });
          petId = newPet.id.toString();
          console.log('Created new pet:', newPet);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
          Alert.alert('Lỗi khi tạo thú cưng mới', errorMessage);
          setIsSubmitting(false);
          return;
        }
      }

      // Lấy customer ID - ưu tiên sử dụng currentCustomer nếu đang đăng nhập
      let customerId = parseInt(selectedCustomer);
      if (user && currentCustomer) {
        customerId = currentCustomer.id;
      }

      // Create appointment
      const appointmentData = {
        pet_id: parseInt(petId),
        customer_id: customerId,
        date: date.toISOString(),
        diagnosis: diagnosis,
        service: service,
        clinic: 'Phòng khám thú cưng PetCare',
        notes: notes,
        status: 'pending'
      };

      const result = await medicalRecordService.createMedicalRecord(appointmentData);
      
      // Prepare display data for the modal
      const createdRecord = {
        ...result,
        id: result.id
      };
      
      setCreatedAppointment(createdRecord);

      // Get pet and customer details for display
      try {
        const petDetails = await petService.getPetById(parseInt(petId));
        setPetDetails(petDetails);
      } catch (error) {
        console.error('Error fetching pet details:', error);
      }
      
      try {
        // Nếu là người dùng đăng nhập, ưu tiên dùng currentCustomer
        if (user && currentCustomer) {
          setCustomerDetails(currentCustomer);
        } else {
          // Ngược lại mới cần gọi API
          const customerDetails = await customerService.getCustomerById(parseInt(selectedCustomer));
          setCustomerDetails(customerDetails);
        }
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }

      // Show success modal
      setIsModalVisible(true);
      
      // Reset form
      setSelectedPet('');
      setDiagnosis('');
      setService('');
      setSelectedServiceId('');
      setNotes('');
      setCustomPetName('');
      setCustomPetSpecies('');
      setIsCustomPet(false);
      
      // Reset step
      setCurrentStep(1);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Lỗi', `Không thể đặt lịch hẹn: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // New function to navigate to appointment details
  const viewAppointmentDetails = () => {
    if (createdAppointment?.id) {
      setIsModalVisible(false);
      router.push(`/home/benh_an/${createdAppointment.id}`);
    }
  };
  
  // New function to close modal and go to appointment list
  const goToAppointmentList = () => {
    setIsModalVisible(false);
    router.push('/home/benh_an');
  };

  // Vô hiệu hóa thay đổi khách hàng nếu đã đăng nhập
  const handleCustomerChange = (itemValue: string) => {
    // Nếu đã đăng nhập, không cho phép thay đổi chủ thú cưng
    if (user && currentCustomer) {
      return;
    }
    
    // Nếu chưa đăng nhập, cho phép thay đổi bình thường
    setSelectedCustomer(itemValue);
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
                  {user && <Text style={styles.requiredStar}> (Tài khoản hiện tại)</Text>}
                </Text>
                {currentCustomer && user ? (
                  // Nếu đã đăng nhập và có thông tin khách hàng, hiển thị thông tin không cho thay đổi
                  <View style={styles.readOnlyField}>
                    <View style={styles.userInfoContainer}>
                      <Ionicons name="person-circle" size={24} color="#4CAF50" style={styles.userIcon} />
                      <View style={styles.userTextContainer}>
                        <Text style={styles.userName}>{currentCustomer.name}</Text>
                        <Text style={styles.userStatus}>Tài khoản đã xác thực</Text>
                      </View>
                    </View>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.verifiedIcon} />
                  </View>
                ) : (
                  // Nếu chưa đăng nhập hoặc không tìm thấy thông tin khách hàng, hiển thị dropdown
                  <View style={styles.pickerContainer}>
                    <Picker
                      style={styles.picker}
                      selectedValue={selectedCustomer}
                      onValueChange={handleCustomerChange}
                      enabled={!user} // Vô hiệu hóa picker khi đã đăng nhập
                    >
                      <Picker.Item label="-- Chọn chủ thú cưng --" value="" />
                      {customers.map(customer => (
                        <Picker.Item 
                          key={customer.id} 
                          label={`${customer.name}`}
                          value={customer.id.toString()} 
                        />
                      ))}
                    </Picker>
                  </View>
                )}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  <MaterialCommunityIcons name="dog" size={18} color="#1976D2" /> Thú cưng:
                </Text>
                
                {/* Switch between existing pets or custom pet */}
                <View style={styles.petSelectionToggle}>
                  <TouchableOpacity 
                    style={[
                      styles.toggleButton, 
                      !isCustomPet && styles.toggleButtonActive
                    ]}
                    onPress={() => setIsCustomPet(false)}
                  >
                    <Text style={!isCustomPet ? styles.toggleTextActive : styles.toggleText}>
                      Chọn từ danh sách
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.toggleButton, 
                      isCustomPet && styles.toggleButtonActive
                    ]}
                    onPress={() => handleToggleCustomPet(true)}
                  >
                    <Text style={isCustomPet ? styles.toggleTextActive : styles.toggleText}>
                      Thêm thú cưng mới
                    </Text>
                  </TouchableOpacity>
                </View>

                {isCustomPet ? (
                  // Form nhập thú cưng mới - chỉ tên và loài
                  <View style={styles.customPetForm}>
                    {/* Hiển thị thông tin chủ thú cưng khi thêm mới */}
                    {(currentCustomer || selectedCustomer) && (
                      <View style={styles.selectedOwnerContainer}>
                        <Text style={styles.selectedOwnerLabel}>Chủ thú cưng:</Text>
                        <Text style={styles.selectedOwnerValue}>
                          {currentCustomer ? currentCustomer.name : 
                            customers.find(c => c.id.toString() === selectedCustomer)?.name}
                        </Text>
                      </View>
                    )}
                    
                    <TextInput
                      style={styles.input}
                      value={customPetName}
                      onChangeText={setCustomPetName}
                      placeholder="Nhập tên thú cưng (*)"
                    />
                    <TextInput
                      style={[styles.input, { marginTop: 10 }]}
                      value={customPetSpecies}
                      onChangeText={setCustomPetSpecies}
                      placeholder="Nhập loài thú cưng (chó, mèo, chim,...) (*)"
                    />
                  </View>
                ) : (
                  // Dropdown chọn thú cưng từ danh sách
                  <View>
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
                    
                    {pets.length === 0 && currentCustomer && (
                      <View style={styles.noPetsContainer}>
                        <Text style={styles.noPetsMessage}>
                          Bạn chưa có thú cưng nào trong danh sách. Vui lòng thêm thông tin thú cưng.
                        </Text>
                        <TouchableOpacity 
                          style={styles.addPetButton}
                          onPress={() => setIsCustomPet(true)}
                        >
                          <Text style={styles.addPetButtonText}>Thêm thú cưng mới</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
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
                  <Ionicons name="medical" size={18} color="#1976D2" /> Chẩn đoán:
                </Text>

                <View style={styles.serviceOptionsContainer}>
                  {serviceOptions.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.serviceOption,
                        selectedServiceId === option.id && styles.serviceOptionSelected
                      ]}
                      onPress={() => selectService(option.id, option.name)}
                    >
                      <MaterialCommunityIcons 
                        name={option.icon as any} 
                        size={24} 
                        color={selectedServiceId === option.id ? '#1976D2' : '#666'} 
                      />
                      <Text style={[
                        styles.serviceOptionText,
                        selectedServiceId === option.id && styles.serviceOptionTextSelected
                      ]}>
                        {option.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  <MaterialCommunityIcons name="hospital" size={18} color="#1976D2" /> Dịch vụ:
                </Text>
                <TextInput
                  style={styles.input}
                  value={diagnosis}
                  onChangeText={setDiagnosis}
                  placeholder="Nhập dịch vụ cần sử dụng"
                />
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
                  <Ionicons name="medical" size={18} color="#1976D2" /> Triệu chứng / Vấn đề: <Text style={styles.optionalText}>(không bắt buộc)</Text>
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={diagnosis}
                  onChangeText={setDiagnosis}
                  placeholder="Mô tả tình trạng của thú cưng (nếu có)"
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
                  {user && currentCustomer 
                    ? currentCustomer.name
                    : (selectedCustomer ? customers.find(c => c.id.toString() === selectedCustomer)?.name || '' : '')}
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

  // Add the appointment confirmation modal component
  const renderAppointmentConfirmationModal = () => {
    if (!createdAppointment) return null;
    
    return (
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                style={styles.modalHeaderGradient}
              >
                <Ionicons name="checkmark-circle" size={40} color="#fff" />
                <Text style={styles.modalHeaderText}>Đặt lịch thành công</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>Chi tiết lịch hẹn</Text>
              
              <View style={styles.appointmentDetail}>
                <Text style={styles.appointmentDetailLabel}>Thú cưng:</Text>
                <Text style={styles.appointmentDetailValue}>
                  {petDetails?.name} ({petDetails?.species})
                  {petDetails?.age ? `, ${petDetails.age} tuổi` : ''}
                </Text>
              </View>
              
              <View style={styles.appointmentDetail}>
                <Text style={styles.appointmentDetailLabel}>Chủ sở hữu:</Text>
                <Text style={styles.appointmentDetailValue}>{customerDetails?.name}</Text>
              </View>
              
              <View style={styles.appointmentDetail}>
                <Text style={styles.appointmentDetailLabel}>Dịch vụ:</Text>
                <Text style={styles.appointmentDetailValue}>{service}</Text>
              </View>
              
              <View style={styles.appointmentDetail}>
                <Text style={styles.appointmentDetailLabel}>Ngày hẹn:</Text>
                <Text style={styles.appointmentDetailValue}>{date.toLocaleDateString('vi-VN')}</Text>
              </View>
              
              {diagnosis && (
                <View style={styles.appointmentDetail}>
                  <Text style={styles.appointmentDetailLabel}>Triệu chứng:</Text>
                  <Text style={styles.appointmentDetailValue}>{diagnosis}</Text>
                </View>
              )}
              
              <View style={styles.appointmentDetail}>
                <Text style={styles.appointmentDetailLabel}>Trạng thái:</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Chờ xác nhận</Text>
                </View>
              </View>
              
              <Text style={styles.noteText}>
                Lịch hẹn của bạn đã được đặt thành công. Chúng tôi sẽ liên hệ để xác nhận trong thời gian sớm nhất.
              </Text>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalSecondaryButton}
                onPress={goToAppointmentList}
              >
                <Text style={styles.modalSecondaryButtonText}>Danh sách lịch hẹn</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalPrimaryButton}
                onPress={viewAppointmentDetails}
              >
                <Text style={styles.modalPrimaryButtonText}>Xem chi tiết</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
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

      {renderAppointmentConfirmationModal()}
    </KeyboardAvoidingView>
  );
}