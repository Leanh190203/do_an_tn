import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ScrollView, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function UserProfileScreen() {
  const router = useRouter();
  const { user, logout, isSignedIn } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Đăng xuất',
          onPress: () => {
            logout();
            Alert.alert('Thành công', 'Bạn đã đăng xuất thành công');
            router.push('/');
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Nếu chưa đăng nhập, hiển thị màn hình gợi ý đăng nhập
  if (!isSignedIn || !user) {
    return (
      <View style={styles.containerNotLoggedIn}>
        <StatusBar backgroundColor="#1976D2" barStyle="light-content" />
        <View style={styles.notLoggedInHeader}>
          <Image 
            source={require('@/assets/images/Logo_DAI_NAM.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.notLoggedInContainer}>
          <MaterialCommunityIcons name="account-lock" size={100} color="#1976D2" />
          <Text style={styles.notLoggedInText}>Chưa đăng nhập</Text>
          <Text style={styles.notLoggedInSubText}>
            Vui lòng đăng nhập để xem thông tin tài khoản và sử dụng đầy đủ các tính năng
          </Text>
          
          <View style={styles.authButtonsContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/home/dang_nhap')}
            >
              <MaterialCommunityIcons name="login" size={24} color="#FFF" />
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.loginButton, styles.registerButton]}
              onPress={() => router.push('/home/dang_ki')}
            >
              <MaterialCommunityIcons name="account-plus" size={24} color="#FFF" />
              <Text style={styles.loginButtonText}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1976D2" barStyle="light-content" />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerBackground} />
          
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image 
                source={require('@/assets/images/Logo_DAI_NAM.png')} 
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>
            
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            
            {user.role === 'admin' && (
              <View style={styles.adminBadge}>
                <MaterialCommunityIcons name="shield-crown" size={16} color="#212121" />
                <Text style={styles.adminBadgeText}>Quản trị viên</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
            
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="account" size={24} color="#1976D2" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Họ tên</Text>
                <Text style={styles.infoValue}>{user.name}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="email" size={24} color="#1976D2" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="phone" size={24} color="#1976D2" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Số điện thoại</Text>
                <Text style={styles.infoValue}>{user.phone || 'Chưa cập nhật'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="home" size={24} color="#1976D2" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Địa chỉ</Text>
                <Text style={styles.infoValue}>{user.address || 'Chưa cập nhật'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Quản lý tài khoản</Text>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/home/cap_nhat_thong_tin')}
            >
              <MaterialCommunityIcons name="account-edit" size={24} color="#1976D2" />
              <Text style={styles.actionButtonText}>Cập nhật thông tin cá nhân</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#BDBDBD" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/home/doi_mat_khau')}
            >
              <MaterialCommunityIcons name="lock-reset" size={24} color="#1976D2" />
              <Text style={styles.actionButtonText}>Đổi mật khẩu</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#BDBDBD" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Thông báo', 'Tính năng đang phát triển')}
            >
              <MaterialCommunityIcons name="bell-outline" size={24} color="#1976D2" />
              <Text style={styles.actionButtonText}>Cài đặt thông báo</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
          >
            <MaterialCommunityIcons name="logout" size={20} color="#FFF" />
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Phòng khám thú cưng Đại Nam</Text>
            <Text style={styles.footerVersion}>Phiên bản 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  containerNotLoggedIn: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  notLoggedInHeader: {
    backgroundColor: '#1976D2',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    width: 120,
    height: 120,
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: -50,
  },
  notLoggedInText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginTop: 20,
    textAlign: 'center',
  },
  notLoggedInSubText: {
    fontSize: 16,
    color: '#546E7A',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  authButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 3,
  },
  registerButton: {
    backgroundColor: '#64B5F6',
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: '#455A64',
    fontSize: 16,
  },
  header: {
    position: 'relative',
    height: 280,
    alignItems: 'center',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: '#1976D2',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 75,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 16,
  },
  userEmail: {
    fontSize: 16,
    color: '#757575',
    marginTop: 4,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC107',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 12,
  },
  adminBadgeText: {
    fontWeight: 'bold',
    color: '#212121',
    marginLeft: 5,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  infoValue: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
    marginLeft: 16,
  },
  logoutButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 24,
    elevation: 2,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#757575',
  },
  footerVersion: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
  },
}); 