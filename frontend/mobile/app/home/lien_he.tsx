import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Linking, Pressable, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

type ContactCardProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  color?: string;
  onPress?: () => void;
};

const ContactCard: React.FC<ContactCardProps> = ({ icon, label, value, color = "#1976D2", onPress }) => (
  <Pressable 
    style={[styles.infoCard, { borderLeftColor: color, borderLeftWidth: 4 }]} 
    onPress={onPress}
  >
    <MaterialCommunityIcons name={icon} size={32} color={color} style={styles.cardIcon} />
    <View style={styles.textWrapper}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.infoText, onPress && styles.linkText]}>{value}</Text>
    </View>
    {onPress && (
      <MaterialCommunityIcons name="chevron-right" size={24} color="#9E9E9E" />
    )}
  </Pressable>
);

export default function ContactScreen() {
  const handleLinkPress = (url: string) => Linking.openURL(url);
  
  const handleOpenMap = () => {
    const address = "Làng Quang Hiền, Hiền Giang, Thường Tín, Hà Nội";
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(mapUrl);
  };

  return (
    <View style={styles.containerMain}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header với hình ảnh */}
        <View style={styles.header}>
          <Image 
            source={require("@/assets/images/anh4.jpg")} 
            style={styles.headerImage} 
            resizeMode="cover" 
          />
          <View style={styles.headerOverlay} />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Phòng Khám Thú Cưng </Text>
            <Text style={styles.headerSubtitle}>Chăm sóc sức khỏe thú cưng của bạn</Text>
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          {/* Thông tin liên hệ */}
          <Text style={styles.sectionTitle}>Thông Tin Liên Hệ</Text>
          
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
          
          {/* <ContactCard 
            icon="web" 
            label="Website" 
            value="www.phongkhamthucungdainam.vn" 
            color="#7B1FA2"
            onPress={() => handleLinkPress('https://lehonganh1902.com')} 
          /> */}
          
          <ContactCard 
            icon="facebook" 
            label="Facebook" 
            value="Phòng khám thú cưng " 
            color="#1877F2"
            onPress={() => handleLinkPress('https://www.facebook.com/anh.lehong.73700/')} 
          />

          <ContactCard 
            icon="clock-outline" 
            label="Giờ làm việc" 
            value="7:30 - 17:30 (Thứ 2 - Chủ Nhật)" 
          />

          {/* Địa chỉ phòng khám */}
          <Text style={styles.sectionTitle}>Địa Chỉ Phòng Khám</Text>
          
          <View style={styles.mapContainer}>
            <TouchableOpacity style={styles.mapWrapper} onPress={handleOpenMap}>
              <Image 
                source={require("@/assets/images/Logo_DAI_NAM.png")} 
                style={styles.mapPlaceholder} 
                resizeMode="contain"
              />
              <View style={styles.mapOverlay}>
                <MaterialCommunityIcons name="map-marker" size={40} color="#FFFFFF" />
                <Text style={styles.mapText}>Nhấn để mở bản đồ</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.addressContainer}>
              <MaterialCommunityIcons name="map-marker" size={24} color="#1976D2" />
              <Text style={styles.addressText}>
                Số nhà 19 Làng Quang Hiền, xã Hiền Giang, 
                huyện Thường Tín, TP. Hà Nội
              </Text>
            </View>
          </View>
          
          {/* Dịch vụ */}
          <Text style={styles.sectionTitle}>Dịch Vụ Của Chúng Tôi</Text>
          
          <View style={styles.servicesContainer}>
            <View style={styles.serviceItem}>
              <View style={[styles.serviceIcon, { backgroundColor: '#E3F2FD' }]}>
                <MaterialCommunityIcons name="stethoscope" size={24} color="#1976D2" />
              </View>
              <Text style={styles.serviceText}>Khám Chữa Bệnh</Text>
            </View>
            
            <View style={styles.serviceItem}>
              <View style={[styles.serviceIcon, { backgroundColor: '#FFF3E0' }]}>
                <MaterialCommunityIcons name="needle" size={24} color="#F57C00" />
              </View>
              <Text style={styles.serviceText}>Tiêm Phòng</Text>
            </View>
            
            <View style={styles.serviceItem}>
              <View style={[styles.serviceIcon, { backgroundColor: '#E8F5E9' }]}>
                <MaterialCommunityIcons name="dog" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.serviceText}>Tắm & Spa</Text>
            </View>
            
            <View style={styles.serviceItem}>
              <View style={[styles.serviceIcon, { backgroundColor: '#E1F5FE' }]}>
                <MaterialCommunityIcons name="scissors-cutting" size={24} color="#03A9F4" />
              </View>
              <Text style={styles.serviceText}>Cắt Tỉa Lông</Text>
            </View>
          </View>
          
          {/* Footer */}
          <View style={styles.footer}>
            <Image 
              source={require("@/assets/images/Logo_DAI_NAM.png")} 
              style={styles.footerLogo} 
              resizeMode="contain"
            />
            <Text style={styles.footerText}>
              © 2025 Phòng Khám Thú Cưng 
            </Text>
            <Text style={styles.footerSubText}>
              Với tình yêu thương và sự chăm sóc tận tâm
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: { 
    flexGrow: 1,
  },
  header: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  contentContainer: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
    marginTop: 24,
    marginBottom: 16,
    paddingLeft: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardIcon: {
    marginRight: 5,
  },
  textWrapper: {
    flex: 1,
    marginLeft: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 3,
  },
  infoText: {
    fontSize: 16,
    color: '#212121',
  },
  linkText: {
    color: '#1976D2',
  },
  mapContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 20,
  },
  mapWrapper: {
    height: 180,
    position: 'relative',
    backgroundColor: '#E1F5FE',
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 118, 210, 0.3)',
  },
  mapText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  addressContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  addressText: {
    flex: 1,
    fontSize: 16,
    color: '#424242',
    marginLeft: 8,
    lineHeight: 22,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -8,
  },
  serviceItem: {
    width: (width - 40) / 2,
    paddingHorizontal: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#424242',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerLogo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 5,
  },
  footerSubText: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
});