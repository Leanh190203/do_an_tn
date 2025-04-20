import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../services/api';

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Kiểm tra các trường bắt buộc
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Lỗi", "Email không đúng định dạng!");
      return;
    }

    // Kiểm tra định dạng số điện thoại nếu đã nhập
    if (phone && !/^[0-9]{10,11}$/.test(phone)) {
      Alert.alert("Lỗi", "Số điện thoại không hợp lệ! Vui lòng nhập 10-11 chữ số.");
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    // Kiểm tra mật khẩu khớp nhau
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp!");
      return;
    }

    try {
      setLoading(true);
      
      // Gửi dữ liệu đăng ký đến API backend
      const result = await authService.register({
        name,
        email,
        password,
        phone,
        address
      });
      
      console.log('Đăng ký thành công:', result);
      
      // Hiển thị thông báo thành công và chuyển hướng
      Alert.alert(
        "Thành công", 
        "Đăng ký tài khoản và tạo hồ sơ khách hàng thành công! Bạn có thể đăng nhập ngay bây giờ.", 
        [
          { 
            text: "Đăng nhập", 
            onPress: () => {
              // Chuyển hướng đến trang đăng nhập với email đã điền sẵn
              router.push({
                pathname: '/home/dang_nhap',
                params: { email: email }
              });
            } 
          }
        ]
      );
    } catch (error) {
      // Xử lý lỗi
      const errorMessage = error instanceof Error ? error.message : 'Đăng ký thất bại, vui lòng thử lại!';
      Alert.alert("Lỗi", errorMessage);
      console.error('Lỗi đăng ký:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Ảnh nền nhỏ phía trên */}
        <Image 
          source={require('@/assets/images/anh2.jpg')} 
          style={styles.backgroundImage}
          resizeMode="contain"
        />

        <View style={styles.formContainer}>
          <Text style={styles.title}>Đăng Ký</Text>

          <TextInput
            style={styles.input}
            placeholder="Họ tên *"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#B0C4DE"
          />

          <TextInput
            style={styles.input}
            placeholder="Email *"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#B0C4DE"
          />

          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#B0C4DE"
          />

          <TextInput
            style={styles.input}
            placeholder="Địa chỉ"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor="#B0C4DE"
          />

          <TextInput
            style={styles.input}
            placeholder="Mật khẩu *"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#B0C4DE"
          />

          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu *"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor="#B0C4DE"
          />

          <TouchableOpacity onPress={handleSignUp} style={styles.button} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Đăng Ký Tài Khoản</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/home/dang_nhap')}>
            <Text style={styles.link}>Đã có tài khoản? Đăng nhập ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  backgroundImage: {
    width: '100%',
    height: '40%', // Giới hạn chiều cao của ảnh nền
    position: 'absolute',
    top: 0,
  },
  formContainer: {
    width: '85%',
    padding: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0D47A1',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#64B5F6',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    color: '#0D47A1',
  },
  button: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    color: '#1565C0',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
