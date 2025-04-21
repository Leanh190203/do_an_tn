import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../styles/dat_lich.styles';

export default function AppointmentScreen() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to them_benh_an
    router.replace('/home/them_benh_an');
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1976D2" />
      <Text style={{marginTop: 20, fontSize: 16}}>Đang chuyển hướng đến trang đặt lịch hẹn...</Text>
    </View>
  );
} 