import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      router.push('/');
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={['#1976D2', '#64B5F6']}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <Image
              source={require('@/assets/images/Logo_DAI_NAM.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Chào mừng trở lại!</Text>
            <Text style={styles.subtitleText}>
              Đăng nhập để tiếp tục sử dụng dịch vụ
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email" size={24} color="#1976D2" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#90A4AE"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock" size={24} color="#1976D2" />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor="#90A4AE"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <MaterialCommunityIcons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={24} 
                  color="#90A4AE" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <MaterialCommunityIcons name="login" size={24} color="#FFFFFF" />
                  <Text style={styles.loginButtonText}>Đăng Nhập</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.forgotPasswordButton}
              onPress={() => Alert.alert('Thông báo', 'Tính năng đang được phát triển')}
            >
              <MaterialCommunityIcons name="lock-reset" size={20} color="#1976D2" />
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>HOẶC</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={styles.signUpButton}
              onPress={() => router.push('/home/dang_ki')}
            >
              <MaterialCommunityIcons name="account-plus" size={24} color="#1976D2" />
              <Text style={styles.signUpButtonText}>Tạo tài khoản mới</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => router.back()}
          >
           
    
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 16,
    color: '#E3F2FD',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#1976D2',
  },
  eyeIcon: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: '#1976D2',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 3,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#90CAF9',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  forgotPasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    padding: 5,
  },
  forgotPasswordText: {
    color: '#1976D2',
    fontSize: 14,
    marginLeft: 5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E7FF',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#90A4AE',
    fontSize: 12,
    fontWeight: 'bold',
  },
  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1976D2',
    paddingVertical: 15,
  },
  signUpButtonText: {
    color: '#1976D2',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 5,
  },
});
