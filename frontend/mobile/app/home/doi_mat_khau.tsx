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

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    // Kiểm tra các trường bắt buộc
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      
      if (!user?.id) {
        Alert.alert('Lỗi', 'Không thể xác định người dùng. Vui lòng đăng nhập lại.');
        return;
      }
      
      const passwordData = {
        currentPassword,
        newPassword,
        confirmPassword
      };
      
      await authService.changePassword(user.id, passwordData);
      
      Alert.alert(
        'Thành công', 
        'Mật khẩu đã được thay đổi. Vui lòng đăng nhập lại với mật khẩu mới.', 
        [{ 
          text: 'OK', 
          onPress: () => {
            logout();
            router.replace('/home/dang_nhap');
          }
        }]
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đổi mật khẩu';
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
          <Text style={styles.headerTitle}>Đổi Mật Khẩu</Text>
        </View>
        
        <View style={styles.form}>
          <Text style={styles.formDescription}>
            Để đảm bảo an toàn, vui lòng chọn mật khẩu mạnh với ít nhất 6 ký tự bao gồm chữ, số và ký tự đặc biệt.
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu hiện tại</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock" size={22} color="#1976D2" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu hiện tại"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                <MaterialCommunityIcons 
                  name={showCurrentPassword ? "eye-off" : "eye"} 
                  size={22} 
                  color="#757575" 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu mới</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-plus" size={22} color="#1976D2" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                <MaterialCommunityIcons 
                  name={showNewPassword ? "eye-off" : "eye"} 
                  size={22} 
                  color="#757575" 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-check" size={22} color="#1976D2" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <MaterialCommunityIcons 
                  name={showConfirmPassword ? "eye-off" : "eye"} 
                  size={22} 
                  color="#757575" 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.passwordStrength}>
            <Text style={styles.passwordStrengthText}>
              Mật khẩu mạnh nên có:
            </Text>
            <View style={styles.passwordTip}>
              <MaterialCommunityIcons 
                name={newPassword.length >= 6 ? "check-circle" : "circle-outline"} 
                size={16} 
                color={newPassword.length >= 6 ? "#4CAF50" : "#757575"} 
              />
              <Text style={styles.passwordTipText}>Ít nhất 6 ký tự</Text>
            </View>
            <View style={styles.passwordTip}>
              <MaterialCommunityIcons 
                name={/[A-Z]/.test(newPassword) ? "check-circle" : "circle-outline"} 
                size={16} 
                color={/[A-Z]/.test(newPassword) ? "#4CAF50" : "#757575"} 
              />
              <Text style={styles.passwordTipText}>Có chữ in hoa</Text>
            </View>
            <View style={styles.passwordTip}>
              <MaterialCommunityIcons 
                name={/[0-9]/.test(newPassword) ? "check-circle" : "circle-outline"} 
                size={16} 
                color={/[0-9]/.test(newPassword) ? "#4CAF50" : "#757575"} 
              />
              <Text style={styles.passwordTipText}>Có chữ số</Text>
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
              onPress={handleChangePassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Đổi mật khẩu</Text>
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
  formDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 20,
    lineHeight: 20,
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
  passwordStrength: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  passwordStrengthText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#455A64',
    marginBottom: 8,
  },
  passwordTip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  passwordTipText: {
    fontSize: 14,
    color: '#616161',
    marginLeft: 6,
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