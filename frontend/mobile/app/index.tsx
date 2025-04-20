import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from './context/AuthContext';

const { width } = Dimensions.get('window');

// Danh sách các banner quảng cáo
const banners = [
  require('@/assets/images/anh1.jpg'),
  require('@/assets/images/anh2.jpg'),
  require('@/assets/images/anh3.jpg'),
  require('@/assets/images/anh4.jpg'),
];

// Danh sách dịch vụ nổi bật
const services = [
  { id: '1', name: 'Khám Tổng Quát', icon: 'stethoscope', color: '#4CAF50' },
  { id: '2', name: 'Tiêm Phòng', icon: 'needle', color: '#F57C00' },
  { id: '3', name: 'Chữa Bệnh', icon: 'medical-bag', color: '#E91E63' },
  { id: '4', name: 'Tắm & Spa', icon: 'shower', color: '#039BE5' },
  { id: '5', name: 'Cắt Tỉa Lông', icon: 'content-cut', color: '#9C27B0' },
  { id: '6', name: 'Khám Răng', icon: 'tooth', color: '#00BCD4' },
  { id: '7', name: 'Siêu Âm', icon: 'heart-pulse', color: '#FF5722' },
  { id: '8', name: 'Xét Nghiệm', icon: 'flask', color: '#607D8B' },
];

// Danh sách các thú cưng được hiển thị gần đây
const recentPets = [
  { id: '1', name: 'Cookie', type: 'Chó', breed: 'Golden Retriever', image: require('@/assets/images/anh3.jpg') },
  { id: '2', name: 'Milo', type: 'Mèo', breed: 'Scottish Fold', image: require('@/assets/images/anh2.jpg') },
  { id: '3', name: 'Coco', type: 'Chó', breed: 'Corgi', image: require('@/assets/images/anh1.jpg') },
  { id: '4', name: 'Luna', type: 'Mèo', breed: 'Maine Coon', image: require('@/assets/images/anh4.jpg') },
];

export default function HomeScreen() {
  const router = useRouter();
  const { isSignedIn, user } = useAuth();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Tự động chuyển banner
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < banners.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
      } else {
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const navigateTo = (route: string) => {
    router.push(route as never);
  };

  const renderDotIndicator = () => {
    return (
      <View style={styles.dotContainer}>
        {banners.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={`dot-${index}`}
              style={[
                styles.dot,
                { width: dotWidth, opacity, backgroundColor: '#1976D2' },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image 
            source={require('@/assets/images/Logo_DAI_NAM.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <View style={styles.headerRight}>
            {isSignedIn ? (
              <TouchableOpacity 
                style={styles.userButton}
                onPress={() => navigateTo('/home/tai_khoan')}
              >
                <MaterialCommunityIcons name="account-circle" size={30} color="#FFFFFF" />
                <Text style={styles.userName}>{user?.name.split(' ')[0] || 'Người dùng'}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={() => navigateTo('/home/dang_nhap')}
              >
                <MaterialCommunityIcons name="login" size={18} color="#FFFFFF" />
                <Text style={styles.loginText}>Đăng nhập</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={styles.welcomeText}>Chào mừng đến với Phòng khám Thú cưng!</Text>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Banner Slider */}
        <View style={styles.bannerContainer}>
          <FlatList
            ref={flatListRef}
            data={banners}
            renderItem={({ item }) => (
              <View style={styles.bannerItem}>
                <Image source={item} style={styles.bannerImage} />
              </View>
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
          {renderDotIndicator()}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigateTo('/home/dat_lich')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
              <MaterialCommunityIcons name="calendar-plus" size={24} color="#1976D2" />
            </View>
            <Text style={styles.actionText}>Đặt lịch</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigateTo('/home/benh_an')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FFF8E1' }]}>
              <MaterialCommunityIcons name="clipboard-list" size={24} color="#FFA000" />
            </View>
            <Text style={styles.actionText}>Bệnh án</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigateTo('/home/lien_he')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="phone" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.actionText}>Liên hệ</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigateTo('/home/tai_khoan')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
              <MaterialCommunityIcons name="account" size={24} color="#9C27B0" />
            </View>
            <Text style={styles.actionText}>Tài khoản</Text>
          </TouchableOpacity>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dịch vụ nổi bật</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity 
                key={service.id} 
                style={styles.serviceItem}
                onPress={() => navigateTo('/home/dich_vu')}
              >
                <View style={[styles.serviceIcon, { backgroundColor: `${service.color}20` }]}>
                  <MaterialCommunityIcons name={service.icon as any} size={24} color={service.color} />
                </View>
                <Text style={styles.serviceText}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Pets */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thú cưng gần đây</Text>
            <TouchableOpacity onPress={() => navigateTo('/home/benh_an')}>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.recentPetsContainer}
          >
            {recentPets.map((pet) => (
              <TouchableOpacity 
                key={pet.id} 
                style={styles.petCard}
                onPress={() => navigateTo('/home/benh_an')}
              >
                <Image source={pet.image} style={styles.petImage} />
                <View style={styles.petInfo}>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petBreed}>
                    {pet.type} • {pet.breed}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* News & Tips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tin tức & Mẹo chăm sóc</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.newsContainer}>
            <TouchableOpacity style={styles.newsItem}>
              <Image 
                source={require('@/assets/images/anh1.jpg')} 
                style={styles.newsImage} 
                resizeMode="cover"
              />
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>7 thói quen chăm sóc thú cưng hàng ngày</Text>
                <Text style={styles.newsDate}>20/05/2023</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.newsItem}>
              <Image 
                source={require('@/assets/images/anh2.jpg')} 
                style={styles.newsImage} 
                resizeMode="cover"
              />
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>Cách nhận biết khi thú cưng bị ốm</Text>
                <Text style={styles.newsDate}>10/05/2023</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutContainer}>
          <View style={styles.aboutContent}>
            <MaterialCommunityIcons name="hospital-building" size={40} color="#1976D2" />
            <Text style={styles.aboutTitle}>Về Phòng Khám</Text>
            <Text style={styles.aboutText}>
              Phòng khám thú cưng của chúng tôi cung cấp dịch vụ chăm sóc toàn diện với đội ngũ bác sĩ giàu kinh nghiệm và trang thiết bị hiện đại.
            </Text>
            <TouchableOpacity 
              style={styles.aboutButton}
              onPress={() => navigateTo('/home/lien_he')}
            >
              <Text style={styles.aboutButtonText}>Liên hệ ngay</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerTab}
          onPress={() => {}}
        >
          <MaterialCommunityIcons name="home" size={24} color="#1976D2" />
          <Text style={[styles.footerTabText, { color: '#1976D2' }]}>Trang chủ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerTab}
          onPress={() => navigateTo('/home/dat_lich')}
        >
          <MaterialCommunityIcons name="calendar" size={24} color="#9E9E9E" />
          <Text style={styles.footerTabText}>Đặt lịch</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerTab}
          onPress={() => navigateTo('/home/benh_an')}
        >
          <MaterialCommunityIcons name="clipboard-text" size={24} color="#9E9E9E" />
          <Text style={styles.footerTabText}>Bệnh án</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerTab}
          onPress={() => navigateTo('/home/tai_khoan')}
        >
          <MaterialCommunityIcons name="account" size={24} color="#9E9E9E" />
          <Text style={styles.footerTabText}>Tài khoản</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#1976D2',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontWeight: '600',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  loginText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontSize: 12,
  },
  welcomeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 70,
  },
  bannerContainer: {
    height: 180,
    marginTop: 16,
  },
  bannerItem: {
    width: width,
    height: 180,
  },
  bannerImage: {
    width: '93%',
    height: '100%',
    borderRadius: 12,
    alignSelf: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  quickAction: {
    alignItems: 'center',
    justifyContent: 'center',
    width: (width - 80) / 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#424242',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  seeAllText: {
    fontSize: 14,
    color: '#1976D2',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: (width - 64) / 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 12,
    color: '#424242',
    textAlign: 'center',
  },
  recentPetsContainer: {
    paddingRight: 16,
  },
  petCard: {
    width: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  petImage: {
    width: '100%',
    height: 100,
  },
  petInfo: {
    padding: 10,
  },
  petName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
  },
  petBreed: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  newsContainer: {
    marginBottom: 16,
  },
  newsItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  newsImage: {
    width: 100,
    height: 80,
  },
  newsContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 6,
  },
  newsDate: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  aboutContainer: {
    margin: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    overflow: 'hidden',
  },
  aboutContent: {
    padding: 20,
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 12,
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#424242',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  aboutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  aboutButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginRight: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  footerTab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerTabText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 2,
  },
});