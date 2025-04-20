import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function UpdateProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
      return;
    }

    try {
      setLoading(true);
      
      if (!user?.id) {
        Alert.alert('Lỗi', 'Không thể xác định người dùng. Vui lòng đăng nhập lại.');
        return;
      }
      
      const userData = {
        name,
        phone: phone.trim() ? phone : undefined,
        address: address.trim() ? address : undefined
      };
      
      const response = await authService.updateUserProfile(user.id, userData);
      
      // Cập nhật thông tin người dùng trong context
      updateUser(response.user);
      
      // Log dữ liệu để kiểm tra
      console.log('Dữ liệu người dùng sau khi cập nhật:', response.user);
      
      Alert.alert(
        'Thành công', 
        'Thông tin cá nhân đã được cập nhật', 
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi khi cập nhật thông tin';
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <StatusBar backgroundColor="#1976D2" barStyle="light-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cập Nhật Thông Tin</Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ tên</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account" size={22} color="#1976D2" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập họ tên"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="phone" size={22} color="#1976D2" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="home" size={22} color="#1976D2" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập địa chỉ"
                value={address}
                onChangeText={setAddress}
                multiline
              />
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.saveButton, loading && styles.buttonDisabled]} 
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#1976D2',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#455A64',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212121',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#1976D2',
  },
  buttonDisabled: {
    backgroundColor: '#90CAF9',
  },
  cancelButtonText: {
    color: '#455A64',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 