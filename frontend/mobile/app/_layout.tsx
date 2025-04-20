import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from './context/AuthContext';

export default function AppLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen 
          name="home/dang_nhap" 
          options={{ 
            title: 'Đăng nhập',
            headerStyle: { backgroundColor: '#1976D2' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />
        <Stack.Screen 
          name="home/dang_ki" 
          options={{ 
            title: 'Đăng ký', 
            headerStyle: { backgroundColor: '#1976D2' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />
        <Stack.Screen 
          name="home/tai_khoan" 
          options={{ 
            title: 'Tài khoản', 
            headerStyle: { backgroundColor: '#1976D2' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />
        <Stack.Screen 
          name="home/cap_nhat_thong_tin"
          options={{ 
            title: 'Cập nhật thông tin', 
            headerStyle: { backgroundColor: '#1976D2' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />
        <Stack.Screen 
          name="home/doi_mat_khau"
          options={{ 
            title: 'Đổi mật khẩu', 
            headerStyle: { backgroundColor: '#1976D2' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />
        <Stack.Screen 
          name="home/lien_he" 
          options={{ 
            title: 'Liên hệ', 
            headerStyle: { backgroundColor: '#1976D2' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />
      </Stack>
    </AuthProvider>
  );
}
