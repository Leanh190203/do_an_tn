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
        
        {/* Header với gradient */}
        <View style={styles.notLoggedInHeader}>
          <Image 
            source={require('@/assets/images/Logo_DAI_NAM.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Phòng Khám Thú Cưng</Text>
        </View>
        
        <ScrollView 
          style={styles.notLoggedInScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.notLoggedInCard}>
            <View style={styles.illustrationContainer}>
              <MaterialCommunityIcons name="account-lock-outline" size={80} color="#1976D2" />
              <View style={styles.illustrationDot1} />
              <View style={styles.illustrationDot2} />
              <View style={styles.illustrationDot3} />
            </View>
            
            <Text style={styles.notLoggedInText}>Vui lòng đăng nhập</Text>
            <Text style={styles.notLoggedInSubText}>
              Đăng nhập vào tài khoản để truy cập các thông tin cá nhân, bệnh án, 
              lịch hẹn và nhiều tính năng khác.
            </Text>
            
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitItem}>
                <MaterialCommunityIcons name="calendar-check" size={24} color="#4CAF50" />
                <Text style={styles.benefitText}>Đặt lịch khám dễ dàng</Text>
              </View>
              
              <View style={styles.benefitItem}>
                <MaterialCommunityIcons name="clipboard-text" size={24} color="#FF9800" />
                <Text style={styles.benefitText}>Theo dõi bệnh án thú cưng</Text>
              </View>
              
              <View style={styles.benefitItem}>
                <MaterialCommunityIcons name="bell-ring" size={24} color="#F44336" />
                <Text style={styles.benefitText}>Nhận thông báo lịch khám</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.authButtonsContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/home/dang_nhap')}
            >
              <MaterialCommunityIcons name="login" size={24} color="#FFF" />
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
            
            <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>HOẶC</Text>
              <View style={styles.orLine} />
            </View>
            
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.push('/home/dang_ki')}
            >
              <MaterialCommunityIcons name="account-plus" size={24} color="#FFF" />
              <Text style={styles.registerButtonText}>Tạo tài khoản mới</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={18} color="#455A64" />
            <Text style={styles.backButtonText}>Quay lại trang chủ</Text>
          </TouchableOpacity>
          
          <View style={styles.footerSmall}>
            <Text style={styles.footerText}>© 2023 - Phòng khám thú cưng Đại Nam</Text>
            <Text style={styles.footerVersion}>Phiên bản 1.0.0</Text>
          </View>
        </ScrollView>
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
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  notLoggedInScroll: {
    flex: 1,
  },
  notLoggedInCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    margin: 16,
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  illustrationContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    width: 120,
    height: 120,
    position: 'relative',
  },
  illustrationDot1: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    top: 10,
    right: 10,
  },
  illustrationDot2: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#BBDEFB',
    bottom: 15,
    left: 15,
  },
  illustrationDot3: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#90CAF9',
    bottom: 30,
    right: 20,
  },
  notLoggedInText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginBottom: 12,
    textAlign: 'center',
  },
  notLoggedInSubText: {
    fontSize: 16,
    color: '#546E7A',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  benefitsContainer: {
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: 8,
  },
  benefitText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#424242',
    fontWeight: '500',
  },
  authButtonsContainer: {
    padding: 16,
    paddingTop: 0,
  },
  loginButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    paddingHorizontal: 10,
    color: '#757575',
    fontSize: 12,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#64B5F6',
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 12,
  },
  backButtonText: {
    color: '#455A64',
    fontSize: 16,
    marginLeft: 6,
  },
  footerSmall: {
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    marginBottom: 16,
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