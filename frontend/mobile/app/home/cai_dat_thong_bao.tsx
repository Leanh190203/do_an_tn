import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NOTIFICATION_KEY = 'notification_enabled';

export default function CaiDatThongBaoScreen() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load trạng thái từ AsyncStorage
    const loadSetting = async () => {
      try {
        const value = await AsyncStorage.getItem(NOTIFICATION_KEY);
        setEnabled(value === 'true');
      } catch (e) {
        Alert.alert('Lỗi', 'Không thể tải trạng thái thông báo');
      } finally {
        setLoading(false);
      }
    };
    loadSetting();
  }, []);

  const toggleSwitch = async () => {
    try {
      const newValue = !enabled;
      setEnabled(newValue);
      await AsyncStorage.setItem(NOTIFICATION_KEY, newValue.toString());
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể lưu trạng thái thông báo');
    }
  };

  if (loading) return null;

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#1976D2" />
        </TouchableOpacity>
        <Text style={styles.title}>Cài đặt thông báo</Text>
        <View style={{width: 28}} />
      </View>
      <View style={styles.card}>
        <View style={styles.iconRow}>
          <MaterialCommunityIcons name="bell-ring" size={48} color="#1976D2" style={styles.bellIcon} />
        </View>
        <Text style={styles.cardTitle}>Nhận thông báo từ ứng dụng</Text>
        <Text style={styles.cardDesc}>
          Cho phép ứng dụng gửi thông báo về lịch hẹn, tin tức, khuyến mãi và các cập nhật quan trọng khác.
        </Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Bật thông báo</Text>
          <Switch
            value={enabled}
            onValueChange={toggleSwitch}
            thumbColor={enabled ? '#1976D2' : '#ccc'}
            trackColor={{ false: '#ccc', true: '#90CAF9' }}
          />
        </View>
        <Text style={styles.statusText}>
          {enabled
            ? 'Bạn sẽ nhận được các thông báo từ ứng dụng.'
            : 'Bạn sẽ không nhận được thông báo.'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backBtn: {
    padding: 4,
    borderRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'center',
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  iconRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  bellIcon: {
    marginBottom: 0,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 15,
    color: '#607D8B',
    textAlign: 'center',
    marginBottom: 18,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
  },
  statusText: {
    fontSize: 14,
    color: '#90A4AE',
    textAlign: 'center',
    marginTop: 8,
  },
}); 