import React from 'react';
import { 
  View, 
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles/chi_tiet_benh_an.styles';

export default function ChiTietBenhAn() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  // Add your state and data fetching logic here

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
      
      {/* Header */}
      <LinearGradient
        colors={['#1976D2', '#2196F3']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi Tiết Bệnh Án</Text>
      </LinearGradient>

      <ScrollView style={styles.container}>
        {/* Thông tin thú cưng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin thú cưng</Text>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="paw" size={20} color="#1976D2" />
            <Text style={styles.infoLabel}>Tên:</Text>
            <Text style={styles.infoValue}>{/* Pet name */}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account" size={20} color="#1976D2" />
            <Text style={styles.infoLabel}>Chủ:</Text>
            <Text style={styles.infoValue}>{/* Owner name */}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="dog" size={20} color="#1976D2" />
            <Text style={styles.infoLabel}>Loài:</Text>
            <Text style={styles.infoValue}>{/* Species */}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="phone" size={20} color="#1976D2" />
            <Text style={styles.infoLabel}>Liên hệ:</Text>
            <Text style={styles.infoValue}>{/* Phone number */}</Text>
          </View>
        </View>

        {/* Thông tin khám */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khám</Text>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={20} color="#1976D2" />
            <Text style={styles.infoLabel}>Ngày khám:</Text>
            <Text style={styles.infoValue}>{/* Appointment date */}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="medical-bag" size={20} color="#1976D2" />
            <Text style={styles.infoLabel}>Dịch vụ:</Text>
            <Text style={styles.infoValue}>{/* Service */}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="stethoscope" size={20} color="#1976D2" />
            <Text style={styles.infoLabel}>Chẩn đoán:</Text>
            <Text style={styles.infoValue}>{/* Diagnosis */}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="hospital-building" size={20} color="#1976D2" />
            <Text style={styles.infoLabel}>Phòng khám:</Text>
            <Text style={styles.infoValue}>{/* Clinic */}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#1976D2" />
            <Text style={styles.infoLabel}>Trạng thái:</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>{/* Status */}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
