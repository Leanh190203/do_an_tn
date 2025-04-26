import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function EditPetScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const petId = typeof id === 'string' ? id : '';

  useEffect(() => {
    // Redirect to my_pets screen with edit parameter
    router.replace(`/home/my_pets?edit=${petId}`);
  }, [petId, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#1976D2" />
      <Text style={{ marginTop: 10, fontSize: 16 }}>Đang chuyển hướng...</Text>
    </View>
  );
} 