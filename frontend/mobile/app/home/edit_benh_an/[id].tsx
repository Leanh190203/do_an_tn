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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import petService from '../../services/petService';
import customerService from '../../services/customerService';
import medicalRecordService, { MedicalRecord } from '../../services/medicalRecordService';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from '../../styles/edit_benh_an.styles';

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

export default function EditMedicalRecordScreen() {
  const { id } = useLocalSearchParams();
  const recordId = typeof id === 'string' ? parseInt(id, 10) : 0;
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
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

  // Load data
  useEffect(() => {
    async function loadData() {
      if (!recordId) {
        Alert.alert('Lỗi', 'ID bệnh án không hợp lệ');
        router.back();
        return;
      }
      
      setLoading(true);
      try {
        // Load pets, customers, and record details in parallel
        const [petsData, customersData, recordData] = await Promise.all([
          petService.getAllPets(),
          customerService.getAllCustomers(),
          medicalRecordService.getMedicalRecordById(recordId)
        ]);
        
        setPets(petsData);
        setCustomers(customersData);
        
        // Populate form with record data
        setSelectedPet(recordData.pet_id.toString());
        setSelectedCustomer(recordData.customer_id.toString());
        setDiagnosis(recordData.diagnosis);
        setService(recordData.service);
        setClinic(recordData.clinic);
        setNotes(recordData.notes);
        setDate(new Date(recordData.date));
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        Alert.alert('Lỗi', 'Không thể tải dữ liệu: ' + errorMessage);
        router.back();
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [recordId, router]);

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
      
      await medicalRecordService.updateMedicalRecord(recordId, medicalRecordData);
      Alert.alert('Thành công', 'Đã cập nhật bệnh án', [
        { 
          text: 'OK', 
          onPress: () => router.push(`/home/benh_an/${recordId}` as any) 
        }
      ]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Lỗi', 'Không thể cập nhật bệnh án: ' + errorMessage);
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh Sửa Bệnh Án</Text>
      </View>
      
      <View style={styles.formContainer}>
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
              <Text style={styles.submitButtonText}>Lưu Thay Đổi</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 