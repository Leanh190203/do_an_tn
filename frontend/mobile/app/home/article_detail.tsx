import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Dữ liệu mẫu bài viết
const articles = [
  {
    id: '1',
    title: '7 thói quen chăm sóc thú cưng hàng ngày',
    subtitle: 'Những thói quen đơn giản giúp thú cưng của bạn khỏe mạnh và hạnh phúc mỗi ngày.',
    date: '20/05/2020',
    image: require('@/assets/images/anh1.jpg'),
    content: `Chăm sóc thú cưng đúng cách là điều quan trọng để đảm bảo sức khỏe và hạnh phúc cho người bạn bốn chân của bạn. Dưới đây là 7 thói quen hàng ngày bạn nên thực hiện:

1. **Cho ăn đúng giờ**: Thú cưng cần được ăn uống đều đặn. Hãy thiết lập lịch trình ăn uống cố định và tuân thủ điều đó mỗi ngày.

2. **Tập thể dục thường xuyên**: Vận động là điều cần thiết cho sức khỏe của thú cưng. Dành ít nhất 30 phút mỗi ngày để đi dạo hoặc chơi đùa với thú cưng.

3. **Chải lông mỗi ngày**: Việc chải lông không chỉ giúp thú cưng trông đẹp hơn mà còn ngăn ngừa rụng lông và các vấn đề về da.

4. **Kiểm tra nước uống**: Đảm bảo thú cưng luôn có nước sạch để uống. Nên thay nước ít nhất 2 lần mỗi ngày.

5. **Vệ sinh răng miệng**: Chải răng cho thú cưng ít nhất 3 lần mỗi tuần để ngăn ngừa các bệnh răng miệng.

6. **Kiểm tra tai và mắt**: Thường xuyên kiểm tra tai và mắt của thú cưng để phát hiện sớm các dấu hiệu nhiễm trùng hoặc bệnh tật.

7. **Thể hiện tình yêu thương**: Dành thời gian để vuốt ve, ôm ấp và nói chuyện với thú cưng. Điều này giúp xây dựng mối quan hệ gắn bó và giúp thú cưng cảm thấy được yêu thương.

Thực hiện 7 thói quen này mỗi ngày sẽ giúp thú cưng của bạn sống khỏe mạnh và hạnh phúc hơn. Hãy nhớ rằng, chăm sóc đúng cách không chỉ là cho ăn và cho uống, mà còn là sự quan tâm và tình yêu thương bạn dành cho chúng.`
  },
  {
    id: '2',
    title: 'Cách nhận biết khi thú cưng bị ốm',
    subtitle: 'Dấu hiệu cảnh báo sớm giúp bạn phát hiện vấn đề sức khỏe ở thú cưng trước khi trở nên nghiêm trọng.',
    date: '10/05/2021',
    image: require('@/assets/images/anh2.jpg'),
    content: `Thú cưng không thể nói cho chúng ta biết khi chúng cảm thấy không khỏe, vì vậy việc chủ nhân nhận biết các dấu hiệu bệnh tật là vô cùng quan trọng. Dưới đây là những dấu hiệu giúp bạn nhận biết khi thú cưng của mình đang gặp vấn đề về sức khỏe:

1. **Thay đổi thói quen ăn uống**: Thú cưng biếng ăn hoặc uống quá nhiều nước có thể là dấu hiệu của nhiều vấn đề sức khỏe khác nhau.

2. **Thay đổi hành vi**: Nếu thú cưng của bạn trở nên lờ đờ, ít hoạt động, hoặc hung hăng bất thường, đó có thể là dấu hiệu cho thấy chúng đang không khỏe.

3. **Khó thở hoặc ho**: Thở nhanh, khó thở hoặc ho là những dấu hiệu nghiêm trọng cần được kiểm tra ngay.

4. **Nôn mửa hoặc tiêu chảy**: Nếu thú cưng bị nôn mửa hoặc tiêu chảy kéo dài hơn 24 giờ, hãy đưa chúng đến bác sĩ thú y.

5. **Thay đổi trong việc đi vệ sinh**: Khó khăn khi đi vệ sinh, đi vệ sinh không đúng chỗ hoặc có máu trong nước tiểu/phân là dấu hiệu cần được chú ý.

6. **Da và lông bất thường**: Rụng lông quá nhiều, ngứa, vết thương, hoặc phát ban có thể là dấu hiệu của bệnh da hoặc các vấn đề sức khỏe khác.

7. **Mắt và tai có vấn đề**: Chảy nước mắt, đỏ mắt, hoặc nhiều gỉ trong tai có thể là dấu hiệu của nhiễm trùng.

8. **Thay đổi trọng lượng đột ngột**: Tăng hoặc giảm cân nhanh chóng mà không có lý do rõ ràng có thể là dấu hiệu của bệnh lý.

Nếu thú cưng của bạn có bất kỳ dấu hiệu nào trong số này, hãy đưa chúng đến bác sĩ thú y càng sớm càng tốt. Phát hiện sớm và điều trị kịp thời là chìa khóa để giữ cho thú cưng của bạn khỏe mạnh.`
  },
  {
    id: '3',
    title: 'Dinh dưỡng cho thú cưng theo độ tuổi',
    subtitle: 'Hướng dẫn chế độ ăn phù hợp cho thú cưng ở mỗi giai đoạn phát triển, từ con non đến già.',
    date: '05/05/2024',
    image: require('@/assets/images/anh3.jpg'),
    content: `Dinh dưỡng đóng vai trò quan trọng trong sức khỏe và tuổi thọ của thú cưng. Nhu cầu dinh dưỡng của thú cưng thay đổi theo từng giai đoạn cuộc đời, vì vậy điều chỉnh chế độ ăn phù hợp với độ tuổi là rất cần thiết.

### Thú cưng con (dưới 1 tuổi)

1. **Protein cao**: Thú cưng con cần nhiều protein hơn để phát triển cơ bắp và mô.

2. **Canxi và Phốt pho**: Cần thiết cho sự phát triển của xương và răng.

3. **DHA (Axit Docosahexaenoic)**: Hỗ trợ phát triển não bộ và thị lực.

4. **Ăn nhiều bữa**: Thú cưng con nên ăn 3-4 bữa mỗi ngày để đáp ứng nhu cầu năng lượng cao.

### Thú cưng trưởng thành (1-7 tuổi)

1. **Protein vừa phải**: Vẫn cần protein để duy trì cơ bắp, nhưng ít hơn so với giai đoạn con.

2. **Cân bằng dinh dưỡng**: Chế độ ăn cân bằng với protein, chất béo, carbohydrate, vitamin và khoáng chất.

3. **Kiểm soát cân nặng**: Điều chỉnh lượng thức ăn để duy trì cân nặng lý tưởng.

4. **Ăn 2 bữa mỗi ngày**: Hầu hết thú cưng trưởng thành nên ăn 2 bữa mỗi ngày.

### Thú cưng già (trên 7 tuổi)

1. **Ít calo hơn**: Thú cưng già thường ít hoạt động hơn, vì vậy cần ít calo hơn.

2. **Protein dễ tiêu hóa**: Giúp duy trì khối lượng cơ mà không gây áp lực lên thận.

3. **Omega-3 và omega-6**: Hỗ trợ sức khỏe khớp và não.

4. **Chất chống oxy hóa**: Giúp chống lại bệnh tật và quá trình lão hóa.

5. **Chất xơ**: Hỗ trợ tiêu hóa khỏe mạnh.

Ngoài ra, luôn đảm bảo thú cưng của bạn có đủ nước sạch để uống. Nước là yếu tố dinh dưỡng quan trọng nhất đối với thú cưng ở mọi lứa tuổi.

Trước khi thay đổi chế độ ăn cho thú cưng, hãy tham khảo ý kiến của bác sĩ thú y để có hướng dẫn cụ thể phù hợp với nhu cầu của thú cưng bạn.`
  },
];

export default function ArticleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // Tìm bài viết dựa trên ID
  const article = articles.find(item => item.id === id) || articles[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
      
      {/* Header với nút trở về */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bài viết</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Ảnh bài viết */}
        <Image 
          source={article.image} 
          style={styles.articleImage} 
          resizeMode="cover"
        />
        
        {/* Thông tin bài viết */}
        <View style={styles.articleContent}>
          <Text style={styles.date}>{article.date}</Text>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.subtitle}>{article.subtitle}</Text>
          
          <View style={styles.divider} />
          
          {/* Nội dung bài viết */}
          <Text style={styles.articleBody}>{article.content}</Text>
          
          {/* Nút chia sẻ và yêu thích */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons name="share-variant" size={22} color="#1976D2" />
              <Text style={styles.actionText}>Chia sẻ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons name="bookmark-outline" size={22} color="#1976D2" />
              <Text style={styles.actionText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1976D2',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  articleImage: {
    width: '100%',
    height: 250,
  },
  articleContent: {
    padding: 16,
  },
  date: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 16,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 16,
  },
  articleBody: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    color: '#1976D2',
    marginLeft: 6,
  },
}); 