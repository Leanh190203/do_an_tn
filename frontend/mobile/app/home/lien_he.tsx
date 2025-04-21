import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  Linking, 
  Pressable, 
  Dimensions, 
  TouchableOpacity,
  Animated,
  Platform,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

type ContactCardProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  color?: string;
  onPress?: () => void;
};

const ContactCard: React.FC<ContactCardProps> = ({ icon, label, value, color = "#1976D2", onPress }) => {
  // Animation for card press
  const [scaleValue] = useState(new Animated.Value(1));
  
  const onPressIn = () => {
    if (onPress) {
      Animated.spring(scaleValue, {
        toValue: 0.96,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const onPressOut = () => {
    if (onPress) {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <Pressable 
        style={[styles.infoCard, { borderLeftColor: color }]} 
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        android_ripple={{ color: `${color}20` }}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <MaterialCommunityIcons name={icon} size={28} color={color} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.infoText, onPress && styles.linkText]}>{value}</Text>
        </View>
        {onPress && (
          <View style={styles.arrowContainer}>
            <MaterialCommunityIcons name="chevron-right" size={24} color={color} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

// Service tile component
type ServiceTileProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  color: string;
  bgColor: string;
};

const ServiceTile: React.FC<ServiceTileProps> = ({ icon, title, color, bgColor }) => (
  <View style={styles.serviceItem}>
    <View style={[styles.serviceIcon, { backgroundColor: bgColor }]}>
      <MaterialCommunityIcons name={icon} size={30} color={color} />
    </View>
    <Text style={styles.serviceText}>{title}</Text>
  </View>
);

export default function ContactScreen() {
  // State for loading map
  const [isMapLoading, setIsMapLoading] = useState(true);
  
  const handleLinkPress = (url: string) => Linking.openURL(url);
  
  const handleOpenMap = () => {
    const address = "Làng Quang Hiền, Hiền Giang, Thường Tín, Hà Nội";
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(mapUrl);
  };

  return (
    <View style={styles.containerMain}>
      <StatusBar style="light" />
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header với hình ảnh */}
        <View style={styles.header}>
          <Image 
            source={require("@/assets/images/anh1.jpg")} 
            style={styles.headerImage} 
            resizeMode="cover" 
          />
          <View style={styles.headerOverlay} />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Phòng Khám Thú Cưng</Text>
            <Text style={styles.headerSubtitle}>Chăm sóc sức khỏe thú cưng của bạn</Text>
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          {/* Giới thiệu ngắn */}
          {/* <View style={styles.introContainer}>
            <Text style={styles.introText}>
          
            </Text>
          </View> */}
          
          {/* Thông tin liên hệ */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <MaterialCommunityIcons name="phone-in-talk" size={20} color="#1976D2" />
              <Text style={styles.sectionTitle}>Thông Tin Liên Hệ</Text>
            </View>
            
            <ContactCard 
              icon="phone" 
              label="Hotline" 
              value="0962 122 407" 
              color="#4CAF50"
              onPress={() => handleLinkPress('tel:0962122407')} 
            />
            
            <ContactCard 
              icon="email" 
              label="Email" 
              value="lehonganh1902@gmail.com" 
              color="#F57C00"
              onPress={() => handleLinkPress('mailto:lehonganh1902@gmail.com')} 
            />
            
            <ContactCard 
              icon="facebook" 
              label="Facebook" 
              value="Phòng khám thú cưng" 
              color="#1877F2"
              onPress={() => handleLinkPress('https://www.facebook.com/anh.lehong.73700/')} 
            />

            <ContactCard 
              icon="clock-time-four" 
              label="Giờ làm việc" 
              value="7:30 - 17:30 (Thứ 2 - Chủ Nhật)" 
              color="#E91E63"
            />
          </View>

          {/* Địa chỉ phòng khám */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#1976D2" />
              <Text style={styles.sectionTitle}>Địa Chỉ Phòng Khám</Text>
            </View>
            
            <View style={styles.mapContainer}>
              <TouchableOpacity 
                style={styles.mapWrapper} 
                onPress={handleOpenMap}
                activeOpacity={0.8}
              >
                <Image 
                  source={require("@/assets/images/anh9.jpg")} 
                  style={styles.mapPlaceholder} 
                  resizeMode="cover"
                  onLoadStart={() => setIsMapLoading(true)}
                  onLoadEnd={() => setIsMapLoading(false)}
                />
                {isMapLoading && (
                  <View style={styles.mapLoadingContainer}>
                    <ActivityIndicator size="large" color="#1976D2" />
                  </View>
                )}
                <View style={styles.mapOverlay}>
                  <View style={styles.mapMarkerContainer}>
                    <MaterialCommunityIcons name="map-marker" size={32} color="#E53935" />
                  </View>
                  <View style={styles.mapButtonContainer}>
                    <Text style={styles.mapText}>Mở Google Maps</Text>
                    <MaterialCommunityIcons name="google-maps" size={18} color="#FFFFFF" />
                  </View>
                </View>
              </TouchableOpacity>
              
              <View style={styles.addressContainer}>
                <View style={styles.addressIconContainer}>
                  <MaterialCommunityIcons name="home-map-marker" size={24} color="#1976D2" />
                </View>
                <View style={styles.addressTextContainer}>
                  <Text style={styles.addressLabel}>Địa chỉ chính thức:</Text>
                  <Text style={styles.addressText}>
                    Số nhà 19 Làng Quang Hiền, xã Hiền Giang, 
                    huyện Thường Tín, TP. Hà Nội
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Dịch vụ */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <MaterialCommunityIcons name="medical-bag" size={20} color="#1976D2" />
              <Text style={styles.sectionTitle}>Dịch Vụ Của Chúng Tôi</Text>
            </View>
            
            <View style={styles.servicesContainer}>
              <ServiceTile 
                icon="stethoscope" 
                title="Khám Chữa Bệnh" 
                color="#1976D2" 
                bgColor="#E3F2FD" 
              />
              
              <ServiceTile 
                icon="needle" 
                title="Tiêm Phòng" 
                color="#F57C00" 
                bgColor="#FFF3E0" 
              />
              
              <ServiceTile 
                icon="dog" 
                title="Tắm & Spa" 
                color="#4CAF50" 
                bgColor="#E8F5E9" 
              />
              
              <ServiceTile 
                icon="content-cut" 
                title="Cắt Tỉa Lông" 
                color="#03A9F4" 
                bgColor="#E1F5FE" 
              />
            </View>
          </View>
          
          {/* Tại sao chọn chúng tôi */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <MaterialCommunityIcons name="heart-pulse" size={20} color="#1976D2" />
              <Text style={styles.sectionTitle}>Tại Sao Chọn Chúng Tôi</Text>
            </View>
            
            <View style={styles.featureContainer}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#E8F5E9' }]}>
                  <MaterialCommunityIcons name="doctor" size={24} color="#4CAF50" />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>Đội ngũ bác sĩ chuyên nghiệp</Text>
                  <Text style={styles.featureDesc}>Với nhiều năm kinh nghiệm trong lĩnh vực thú y</Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#E3F2FD' }]}>
                  <MaterialCommunityIcons name="medical-bag" size={24} color="#1976D2" />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>Trang thiết bị hiện đại</Text>
                  <Text style={styles.featureDesc}>Đầu tư máy móc tiên tiến, đảm bảo chẩn đoán chính xác</Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#FFF3E0' }]}>
                  <MaterialCommunityIcons name="heart" size={24} color="#F57C00" />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>Chăm sóc tận tâm</Text>
                  <Text style={styles.featureDesc}>Đặt sức khỏe và hạnh phúc của thú cưng lên hàng đầu</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Footer */}
          <View style={styles.footer}>
            <Image 
              source={require("@/assets/images/Logo_DAI_NAM.png")} 
              style={styles.footerLogo} 
              resizeMode="contain"
            />
            <Text style={styles.footerTitle}>Phòng Khám Thú Cưng</Text>
            <Text style={styles.footerText}>
              © 2025 Phòng Khám Thú Cưng. Tất cả các quyền được bảo lưu.
            </Text>
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton} onPress={() => handleLinkPress('https://www.facebook.com/anh.lehong.73700/')}>
                <MaterialCommunityIcons name="facebook" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <MaterialCommunityIcons name="instagram" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <MaterialCommunityIcons name="youtube" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: { 
    flexGrow: 1,
  },
  header: {
    height: 220,
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  contentContainer: {
    padding: 16,
    backgroundColor: '#F5F7FA',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  introContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#37474F',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginLeft: 8,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  textWrapper: {
    flex: 1,
    marginLeft: 10,
  },
  arrowContainer: {
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#546E7A',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#37474F',
  },
  linkText: {
    color: '#1976D2',
  },
  mapContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mapWrapper: {
    height: 180,
    position: 'relative',
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
  },
  mapLoadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  mapMarkerContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  mapButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 118, 210, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  mapText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 6,
  },
  addressContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  addressIconContainer: {
    marginRight: 10,
    marginTop: 4,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#546E7A',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 15,
    color: '#37474F',
    lineHeight: 22,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceItem: {
    width: '50%',
    paddingHorizontal: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  serviceIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#37474F',
    textAlign: 'center',
  },
  featureContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#37474F',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: '#546E7A',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerLogo: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#37474F',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 13,
    color: '#546E7A',
    textAlign: 'center',
    marginBottom: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  socialButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
});