import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import petService from '../services/petService';
import customerService from '../services/customerService';
import medicalRecordService, { MedicalRecord } from '../services/medicalRecordService';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from '../styles/add_benh_an.styles';

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

export default function AddMedicalRecordScreen() {
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
  const [clinic, setClinic] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const handleSubmit = async () => {
    // Validation
    if (!selectedPet || !selectedCustomer || !diagnosis || !service || !clinic) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
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
      Alert.alert('Thành công', 'Đã thêm bệnh án mới', [
        { 
          text: 'OK', 
          onPress: () => router.push('/home/benh_an' as any) 
        }
      ]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Lỗi', 'Không thể lưu bệnh án: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🩺 Thêm Bệnh Án Mới</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Chủ thú cưng:</Text>
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
        <Text style={styles.label}>Thú cưng:</Text>
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
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Ngày khám:</Text>
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
          />
        )}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Chẩn đoán:</Text>
        <TextInput
          style={styles.input}
          value={diagnosis}
          onChangeText={setDiagnosis}
          placeholder="Nhập chẩn đoán"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Dịch vụ:</Text>
        <TextInput
          style={styles.input}
          value={service}
          onChangeText={setService}
          placeholder="Nhập dịch vụ đã sử dụng"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Phòng khám:</Text>
        <TextInput
          style={styles.input}
          value={clinic}
          onChangeText={setClinic}
          placeholder="Nhập phòng khám"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Ghi chú:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Nhập ghi chú, hướng dẫn điều trị..."
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => router.back()}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="save" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Lưu Bệnh Án</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 