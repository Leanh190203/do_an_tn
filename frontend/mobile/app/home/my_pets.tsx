import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  StatusBar,
  Image,
  TextInput,
  Modal,
  RefreshControl,
  ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import petService from '../services/petService';
import customerService from '../services/customerService';
import { useAuth } from '../context/AuthContext';
import { StyleSheet } from 'react-native';

// Định nghĩa kiểu dữ liệu cho thú cưng
interface Pet {
  id: number;
  name: string;
  species: string;
  age?: string;
  weight?: string;
  medical_description?: string;
  symptoms?: string;
  customer_id: number;
}

export default function MyPetsScreen() {
  const router = useRouter();
  const { edit } = useLocalSearchParams();
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // State cho modal chỉnh sửa
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [editedPet, setEditedPet] = useState<Pet | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState<{ id: number } | null>(null);

  // Hàm tải danh sách thú cưng của khách hàng
  const loadPets = async () => {
    try {
      setLoading(true);
      if (user) {
        const customerData = await customerService.getCustomerByUserId(user.id);
        if (customerData) {
          setCurrentCustomer(customerData);
          // Tải tất cả thú cưng
          const petsData = await customerService.getCustomerPets(customerData.id);
          
          // Phân loại thú cưng - sắp xếp để thú cưng của người dùng hiển thị trước
          const userPets = petsData.filter((pet: Pet) => pet.customer_id === customerData.id);
          setPets(userPets);
        } else {
          // Alert dialog has been removed
          setPets([]);
        }
      } else {
        // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
        Alert.alert(
          'Yêu cầu đăng nhập', 
          'Vui lòng đăng nhập để xem thú cưng của bạn',
          [{ text: 'OK', onPress: () => router.push('/') }]
        );
      }
    } catch (error) {
      console.error('Lỗi khi tải thú cưng:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách thú cưng');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (edit && pets.length > 0) {
      const petId = typeof edit === 'string' ? parseInt(edit, 10) : 0;
      const petToEdit = pets.find(pet => pet.id === petId);
      
      if (petToEdit) {
        // Kiểm tra quyền chỉnh sửa từ query parameter
        if (currentCustomer && petToEdit.customer_id !== currentCustomer.id) {
          Alert.alert(
            'Không có quyền chỉnh sửa',
            'Bạn chỉ có thể chỉnh sửa thông tin thú cưng của mình.',
            [{ text: 'Đã hiểu' }]
          );
          return;
        }
        
        handleEditPet(petToEdit);
      }
    }
  }, [edit, pets, currentCustomer]);

  useEffect(() => {
    loadPets();
  }, []);

  // Hàm làm mới danh sách thú cưng
  const onRefresh = () => {
    setRefreshing(true);
    loadPets();
  };

  // Hàm mở modal chỉnh sửa thú cưng
  const handleEditPet = (pet: Pet) => {
    // Kiểm tra quyền chỉnh sửa: chỉ cho phép chủ sở hữu thú cưng chỉnh sửa
    if (currentCustomer && pet.customer_id !== currentCustomer.id) {
      Alert.alert(
        'Không có quyền chỉnh sửa',
        'Bạn chỉ có thể chỉnh sửa thông tin thú cưng của mình.',
        [{ text: 'Đã hiểu' }]
      );
      return;
    }
    
    setSelectedPet(pet);
    setEditedPet({...pet});
    setIsModalVisible(true);
  };

  // Hàm tạo thú cưng mới
  const handleAddPet = () => {
    if (!currentCustomer) {
      Alert.alert('Lỗi', 'Không xác định được thông tin khách hàng');
      return;
    }
    
    const newPet: Pet = {
      id: 0, // ID tạm thời, sẽ được thay thế khi tạo trên server
      name: '',
      species: '',
      customer_id: currentCustomer.id
    };
    
    setSelectedPet(null);
    setEditedPet(newPet);
    setIsModalVisible(true);
  };

  // Hàm cập nhật thông tin thú cưng
  const handleUpdatePet = async () => {
    if (!editedPet) return;
    
    if (!editedPet.name || !editedPet.species) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên và loài thú cưng');
      return;
    }
    
    try {
      if (selectedPet) {
        // Cập nhật thú cưng hiện có
        await petService.updatePet(selectedPet.id, editedPet);
        Alert.alert('Thành công', 'Cập nhật thông tin thú cưng thành công');
        
        // Cập nhật danh sách hiển thị
        setPets(pets.map(pet => pet.id === selectedPet.id ? {...editedPet, id: selectedPet.id} : pet));
      } else {
        // Tạo thú cưng mới
        const newPet = await petService.createPet(editedPet);
        Alert.alert('Thành công', 'Thêm thú cưng mới thành công');
        
        // Thêm vào danh sách hiển thị
        setPets([...pets, newPet]);
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật thú cưng:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin thú cưng');
    }
  };

  // Hàm xóa thú cưng
  const handleDeletePet = (pet: Pet) => {
    // Kiểm tra quyền xóa: chỉ cho phép chủ sở hữu thú cưng xóa
    if (currentCustomer && pet.customer_id !== currentCustomer.id) {
      Alert.alert(
        'Không có quyền xóa',
        'Bạn chỉ có thể xóa thú cưng của mình.',
        [{ text: 'Đã hiểu' }]
      );
      return;
    }
    
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa thú cưng ${pet.name}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              await petService.deletePet(pet.id);
              Alert.alert('Thành công', 'Đã xóa thú cưng');
              
              // Cập nhật danh sách hiển thị
              setPets(pets.filter(p => p.id !== pet.id));
            } catch (error) {
              console.error('Lỗi khi xóa thú cưng:', error);
              Alert.alert('Lỗi', 'Không thể xóa thú cưng');
            }
          }
        }
      ]
    );
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Đang tải danh sách thú cưng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        <Text style={styles.headerTitle}>Thú cưng của tôi</Text>
        <TouchableOpacity onPress={handleAddPet}>
          <Ionicons name="add-circle" size={24} color="#FFF" />
        </TouchableOpacity>
      </LinearGradient>
      
      {pets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="paw" size={80} color="#BBDEFB" />
          <Text style={styles.emptyTitle}>Chưa có thú cưng nào</Text>
          <Text style={styles.emptyText}>
            Bạn chưa có thông tin thú cưng nào. Hãy thêm thú cưng để quản lý lịch sử khám bệnh!
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={handleAddPet}
          >
            <Text style={styles.emptyButtonText}>Thêm thú cưng</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#1976D2"]}
              tintColor="#1976D2"
            />
          }
          renderItem={({ item }) => (
            <View style={styles.petCard}>
              <View style={styles.petCardHeader}>
                <View style={styles.petInfo}>
                  <View style={styles.petAvatar}>
                    <MaterialCommunityIcons 
                      name={item.species?.toLowerCase().includes('chó') ? "dog" : 
                           item.species?.toLowerCase().includes('mèo') ? "cat" : "paw"} 
                      size={28} 
                      color="#1976D2" 
                    />
                  </View>
                  <View style={styles.petNameContainer}>
                    <Text style={styles.petName}>{item.name}</Text>
                    <Text style={styles.petSpecies}>{item.species}</Text>
                    {currentCustomer && item.customer_id === currentCustomer.id && (
                      <View style={styles.ownerBadge}>
                        <Text style={styles.ownerBadgeText}>Thú cưng của bạn</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <View style={styles.actionButtons}>
                  {(!currentCustomer || currentCustomer.id === item.customer_id) && (
                    <>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditPet(item)}
                      >
                        <Ionicons name="create-outline" size={20} color="#1976D2" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeletePet(item)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#F44336" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
              
              <View style={styles.petCardContent}>
                {item.age && (
                  <View style={styles.petDetail}>
                    <Ionicons name="calendar-outline" size={16} color="#757575" />
                    <Text style={styles.petDetailLabel}>Tuổi:</Text>
                    <Text style={styles.petDetailValue}>{item.age}</Text>
                  </View>
                )}
                
                {item.weight && (
                  <View style={styles.petDetail}>
                    <MaterialCommunityIcons name="weight" size={16} color="#757575" />
                    <Text style={styles.petDetailLabel}>Cân nặng:</Text>
                    <Text style={styles.petDetailValue}>{item.weight} kg</Text>
                  </View>
                )}
                
                {item.medical_description && (
                  <View style={styles.petDescription}>
                    <Text style={styles.petDescriptionLabel}>Mô tả y tế:</Text>
                    <Text style={styles.petDescriptionValue}>{item.medical_description}</Text>
                  </View>
                )}

                {(!currentCustomer || currentCustomer.id === item.customer_id) && (
                  <TouchableOpacity 
                    style={styles.editFullButton}
                    onPress={() => handleEditPet(item)}
                  >
                    <Ionicons name="create-outline" size={14} color="#FFFFFF" style={{marginRight: 4}} />
                    <Text style={styles.editFullButtonText}>Chỉnh sửa thông tin</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        />
      )}
      
      {/* Modal chỉnh sửa thú cưng */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={() => setIsModalVisible(false)}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedPet ? 'Chỉnh sửa thú cưng' : 'Thêm thú cưng mới'}
                </Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#616161" />
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                style={styles.modalBodyScroll}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.modalBody}>
                  {/* Phần avatar thú cưng */}
                  <View style={styles.petAvatarUpload}>
                    <View style={styles.petAvatarContainer}>
                      <MaterialCommunityIcons 
                        name={editedPet?.species?.toLowerCase().includes('chó') ? "dog" : 
                             editedPet?.species?.toLowerCase().includes('mèo') ? "cat" : "paw"}
                        size={60} 
                        color="#1976D2" 
                      />
                      <TouchableOpacity 
                        style={styles.uploadAvatarButton}
                        onPress={() => Alert.alert('Thông báo', 'Tính năng upload ảnh sẽ được cập nhật trong thời gian tới')}
                      >
                        <Ionicons name="camera" size={14} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.petAvatarHelp}>Nhấn vào biểu tượng camera để thêm ảnh</Text>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Tên thú cưng <Text style={styles.requiredStar}>*</Text></Text>
                    <TextInput
                      style={styles.formInput}
                      value={editedPet?.name}
                      onChangeText={(text) => editedPet && setEditedPet({...editedPet, name: text})}
                      placeholder="Nhập tên thú cưng"
                    />
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Loài <Text style={styles.requiredStar}>*</Text></Text>
                    <TextInput
                      style={styles.formInput}
                      value={editedPet?.species}
                      onChangeText={(text) => editedPet && setEditedPet({...editedPet, species: text})}
                      placeholder="Ví dụ: Chó, Mèo, ..."
                    />
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Tuổi</Text>
                    <TextInput
                      style={styles.formInput}
                      value={editedPet?.age}
                      onChangeText={(text) => editedPet && setEditedPet({...editedPet, age: text})}
                      placeholder="Nhập tuổi thú cưng"
                      keyboardType="number-pad"
                    />
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Cân nặng (kg)</Text>
                    <TextInput
                      style={styles.formInput}
                      value={editedPet?.weight}
                      onChangeText={(text) => editedPet && setEditedPet({...editedPet, weight: text})}
                      placeholder="Nhập cân nặng thú cưng"
                      keyboardType="decimal-pad"
                    />
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Mô tả y tế</Text>
                    <TextInput
                      style={[styles.formInput, styles.textArea]}
                      value={editedPet?.medical_description}
                      onChangeText={(text) => editedPet && setEditedPet({...editedPet, medical_description: text})}
                      placeholder="Mô tả tình trạng sức khỏe, tiền sử bệnh,..."
                      multiline={true}
                      numberOfLines={4}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Triệu chứng</Text>
                    <TextInput
                      style={[styles.formInput, styles.textArea]}
                      value={editedPet?.symptoms}
                      onChangeText={(text) => editedPet && setEditedPet({...editedPet, symptoms: text})}
                      placeholder="Ghi chú về các triệu chứng bệnh hiện tại (nếu có)..."
                      multiline={true}
                      numberOfLines={4}
                    />
                  </View>
                </View>
              </ScrollView>
              
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleUpdatePet}
                >
                  <Text style={styles.saveButtonText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#1976D2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#455A64',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#90A4AE',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  petCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  petCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  petNameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  petSpecies: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  petCardContent: {
    padding: 16,
  },
  petDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  petDetailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#455A64',
    marginLeft: 8,
    marginRight: 4,
  },
  petDetailValue: {
    fontSize: 14,
    color: '#616161',
  },
  petDescription: {
    marginTop: 8,
  },
  petDescriptionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#455A64',
    marginBottom: 4,
  },
  petDescriptionValue: {
    fontSize: 14,
    color: '#616161',
    lineHeight: 20,
  },
  editFullButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editFullButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBodyScroll: {
    maxHeight: '70%',
  },
  modalBody: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#455A64',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#212121',
    backgroundColor: '#F9F9F9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#616161',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1976D2',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  requiredStar: {
    color: '#F44336',
  },
  petAvatarUpload: {
    marginBottom: 16,
  },
  petAvatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
    position: 'relative',
  },
  uploadAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#1976D2',
  },
  petAvatarHelp: {
    marginTop: 8,
    textAlign: 'center',
    color: '#757575',
  },
  ownerBadge: {
    backgroundColor: '#BBDEFB',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  ownerBadgeText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: 'bold',
  },
}); 