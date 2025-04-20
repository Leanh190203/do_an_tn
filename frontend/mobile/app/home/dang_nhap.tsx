import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../context/AuthContext';

// Khai báo kiểu dữ liệu cho global trong TypeScript
declare global {
  var authToken: string | undefined;
  var currentUser: any;
}

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  // Sử dụng email từ trang đăng ký nếu có
  useEffect(() => {
    if (params.email) {
      setEmail(params.email as string);
    }
  }, [params.email]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      setLocalLoading(true);
      await login(email, password);
      
      // Chuyển hướng về trang chủ sau khi đăng nhập thành công
      router.push('/');
      
    } catch (error) {
      // Lỗi đã được xử lý trong hàm login của AuthContext
      console.error('Lỗi đăng nhập:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground 
          source={require('@/assets/images/anh3.jpg')} 
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={styles.container}>
            <Text style={styles.title}>Đăng Nhập</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#B0C4DE"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#B0C4DE"
            />

            <TouchableOpacity 
              style={[styles.button, (localLoading || isLoading) && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={localLoading || isLoading}
            >
              {localLoading || isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Đăng Nhập</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/home/dang_ki')}>
              <Text style={styles.link}>Chưa có tài khoản? Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Tăng độ tối giúp chữ nổi bật hơn
  },
  container: {
    width: '85%',
    padding: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Nền trong suốt nhẹ
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
  buttonDisabled: {
    backgroundColor: '#90CAF9',
  },
  buttonText: {
    color: 'white',
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
