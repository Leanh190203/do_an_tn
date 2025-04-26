import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Dữ liệu mẫu dịch vụ nội bệnh
const internalMedServices = [
  { 
    id: '1', 
    name: 'Khám nội', 
    icon: 'stethoscope', 
    color: '#4CAF50', 
    image: require('@/assets/images/anh1.jpg'),
    description: 'Dịch vụ khám nội bệnh tổng quát cho thú cưng, giúp phát hiện sớm các vấn đề sức khỏe tiềm ẩn. Bác sĩ sẽ khám toàn diện các cơ quan nội tạng, hệ tiêu hóa, hô hấp và tuần hoàn của thú cưng.',
    details: [
      'Khám tổng quát hệ nội tạng',
      'Kiểm tra tim, phổi, gan, thận',
      'Đánh giá hệ tiêu hóa',
      'Tư vấn sức khỏe tổng thể'
    ],
    price: '300.000đ - 500.000đ'
  },
  { 
    id: '2', 
    name: 'Điều trị nội khoa', 
    icon: 'medical-bag', 
    color: '#E91E63', 
    image: require('@/assets/images/anh3.jpg'),
    description: 'Dịch vụ điều trị nội khoa chuyên sâu cho các bệnh lý nội tạng ở thú cưng. Phác đồ điều trị được xây dựng dựa trên tình trạng bệnh lý cụ thể và đặc điểm của từng thú cưng.',
    details: [
      'Điều trị bệnh đường tiêu hóa',
      'Điều trị bệnh hô hấp',
      'Điều trị bệnh tim mạch',
      'Điều trị bệnh thận và gan'
    ],
    price: '500.000đ - 2.000.000đ'
  },
  { 
    id: '3', 
    name: 'Theo dõi bệnh lý', 
    icon: 'clipboard-pulse', 
    color: '#039BE5', 
    image: require('@/assets/images/anh4.jpg'),
    description: 'Dịch vụ theo dõi chuyên sâu các bệnh lý nội khoa mãn tính hoặc cấp tính. Bác sĩ sẽ theo dõi diễn tiến bệnh và điều chỉnh phác đồ điều trị phù hợp.',
    details: [
      'Theo dõi bệnh mãn tính',
      'Đánh giá tiến triển điều trị',
      'Điều chỉnh liều thuốc',
      'Tư vấn chế độ chăm sóc tại nhà'
    ],
    price: '200.000đ - 500.000đ/lần'
  },
  { 
    id: '4', 
    name: 'Dấu hiệu sinh tồn', 
    icon: 'pulse', 
    color: '#F57C00', 
    image: require('@/assets/images/anh2.jpg'),
    description: 'Kiểm tra và theo dõi các dấu hiệu sinh tồn quan trọng của thú cưng như nhịp tim, nhịp thở, thân nhiệt và huyết áp. Đặc biệt quan trọng đối với thú cưng bị bệnh nặng hoặc sau phẫu thuật.',
    details: [
      'Đo nhịp tim và huyết áp',
      'Theo dõi nhịp thở',
      'Đo thân nhiệt',
      'Đánh giá tình trạng ý thức'
    ],
    price: '150.000đ - 300.000đ'
  },
  { 
    id: '5', 
    name: 'Tư vấn dinh dưỡng', 
    icon: 'food-apple', 
    color: '#9C27B0', 
    image: require('@/assets/images/anh5.jpg'),
    description: 'Dịch vụ tư vấn dinh dưỡng chuyên sâu, giúp xây dựng chế độ ăn phù hợp cho thú cưng, đặc biệt là những thú cưng mắc bệnh lý nội khoa cần chế độ ăn đặc biệt.',
    details: [
      'Đánh giá tình trạng dinh dưỡng',
      'Lập kế hoạch dinh dưỡng cá nhân hóa',
      'Tư vấn thực phẩm phù hợp với bệnh lý',
      'Điều chỉnh lượng calo phù hợp'
    ],
    price: '300.000đ - 500.000đ'
  },
  { 
    id: '6', 
    name: 'Phòng ngừa bệnh', 
    icon: 'shield-check', 
    color: '#00BCD4', 
    image: require('@/assets/images/anh6.jpg'),
    description: 'Dịch vụ phòng ngừa các bệnh lý nội khoa thông qua việc tiêm phòng, bổ sung vitamin và khoáng chất, kiểm tra sức khỏe định kỳ và tư vấn chăm sóc.',
    details: [
      'Tiêm phòng các bệnh thông thường',
      'Bổ sung vitamin và khoáng chất',
      'Tư vấn chăm sóc tại nhà',
      'Lịch kiểm tra sức khỏe định kỳ'
    ],
    price: '400.000đ - 800.000đ'
  },
  { 
    id: '7', 
    name: 'Xét nghiệm máu', 
    icon: 'test-tube', 
    color: '#FF5722', 
    image: require('@/assets/images/anh4.jpg'),
    description: 'Dịch vụ xét nghiệm máu toàn diện giúp đánh giá tình trạng sức khỏe tổng quát của thú cưng, phát hiện sớm các bệnh lý gan, thận, tiểu đường và các rối loạn khác.',
    details: [
      'Công thức máu toàn phần',
      'Sinh hóa máu',
      'Điện giải đồ',
      'Đánh giá chức năng gan thận'
    ],
    price: '500.000đ - 1.200.000đ'
  },
  { 
    id: '8', 
    name: 'Siêu âm nội', 
    icon: 'doctor', 
    color: '#607D8B', 
    image: require('@/assets/images/anh1.jpg'),
    description: 'Dịch vụ siêu âm các cơ quan nội tạng giúp đánh giá tình trạng và phát hiện bất thường ở gan, thận, bàng quang, tử cung, tim và các cơ quan khác mà không cần phẫu thuật.',
    details: [
      'Siêu âm ổ bụng',
      'Siêu âm tim',
      'Siêu âm phổi',
      'Đánh giá hình ảnh các cơ quan nội tạng'
    ],
    price: '400.000đ - 800.000đ'
  },
];

export default function ServiceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // Tìm dịch vụ theo ID
  const service = internalMedServices.find(service => service.id === id);
  
  if (!service) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Không tìm thấy dịch vụ</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={service.color} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: service.color }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{service.name}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <Image source={service.image} style={styles.bannerImage} />
        
        {/* Service Info */}
        <View style={styles.serviceInfoContainer}>
          <View style={styles.serviceHeader}>
            <View style={[styles.iconContainer, { backgroundColor: `${service.color}20` }]}>
              <MaterialCommunityIcons name={service.icon as any} size={32} color={service.color} />
            </View>
            <View style={styles.serviceHeaderInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePrice}>{service.price}</Text>
            </View>
          </View>
          
          <Text style={styles.sectionTitle}>Mô tả dịch vụ</Text>
          <Text style={styles.descriptionText}>{service.description}</Text>
          
          <Text style={styles.sectionTitle}>Chi tiết</Text>
          <View style={styles.detailsContainer}>
            {service.details.map((detail, index) => (
              <View key={index} style={styles.detailItem}>
                <MaterialCommunityIcons name="check-circle" size={18} color={service.color} />
                <Text style={styles.detailText}>{detail}</Text>
              </View>
            ))}
          </View>
          
          {/* Appointment Button */}
          <TouchableOpacity 
            style={[styles.appointmentButton, { backgroundColor: service.color }]}
            onPress={() => router.push('/home/them_benh_an')}
          >
            <MaterialCommunityIcons name="calendar-plus" size={20} color="#FFFFFF" />
            <Text style={styles.appointmentButtonText}>Đặt lịch khám</Text>
          </TouchableOpacity>
        </View>
        
        {/* Related Services */}
        <View style={styles.relatedServicesContainer}>
          <Text style={styles.relatedServicesTitle}>Dịch vụ liên quan</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedServicesContent}
          >
            {internalMedServices
              .filter(item => item.id !== service.id)
              .slice(0, 5)
              .map(item => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.relatedServiceItem}
                  onPress={() => router.push({
                    pathname: '/services/[id]',
                    params: { id: item.id }
                  })}
                >
                  <View style={[styles.relatedServiceIcon, { backgroundColor: `${item.color}20` }]}>
                    <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <Text style={styles.relatedServiceText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#1976D2',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  bannerImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  serviceInfoContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceHeaderInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 16,
    color: '#1976D2',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 16,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 22,
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#424242',
    marginLeft: 12,
  },
  appointmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  appointmentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  relatedServicesContainer: {
    padding: 16,
    backgroundColor: '#F5F7FA',
  },
  relatedServicesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  relatedServicesContent: {
    paddingRight: 16,
  },
  relatedServiceItem: {
    width: 100,
    alignItems: 'center',
    marginRight: 16,
  },
  relatedServiceIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  relatedServiceText: {
    fontSize: 13,
    color: '#424242',
    textAlign: 'center',
  }
}); 