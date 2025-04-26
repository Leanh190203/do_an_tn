import { StyleSheet, Dimensions } from 'react-native';
import { commonStyles, commonColors } from './common.styles';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  loadingContainer: commonStyles.loadingContainer,
  loadingText: commonStyles.loadingText,
  title: commonStyles.title,
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    marginRight: 12,
  },
  
  // Step Indicator
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberActive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepLine: {
    height: 2,
    backgroundColor: '#E0E0E0',
    flex: 1,
    marginHorizontal: 8,
  },
  stepCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 16,
  },
  
  // Cards
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  summaryCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#BBDEFB',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#616161',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
  },
  
  // Form Elements
  formGroup: commonStyles.formGroup,
  label: {
    ...commonStyles.label,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionalText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#757575',
    fontStyle: 'italic',
  },
  input: commonStyles.input,
  textArea: commonStyles.textArea,
  pickerContainer: {
    backgroundColor: commonColors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: commonColors.primaryLight,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  dateButton: {
    backgroundColor: commonColors.cardBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: commonColors.primaryLight,
  },
  dateText: {
    fontSize: 16,
  },
  
  // Service Options
  serviceOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  serviceOption: {
    width: (width - 64) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  serviceOptionSelected: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  serviceOptionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#424242',
  },
  serviceOptionTextSelected: {
    color: '#FFFFFF',
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  prevButton: {
    backgroundColor: '#455A64',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flex: 1,
  },
  nextButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 8,
  },
  
  // Styles for the read-only customer field
  readOnlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  readOnlyText: {
    fontSize: 16,
    color: '#212121',
    flex: 1,
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  
  // New styles for enhanced customer display
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userIcon: {
    marginRight: 10,
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  userPhone: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#1976D2',
    marginTop: 2,
    fontStyle: 'italic',
  },
  userStatus: {
    fontSize: 13,
    color: '#4CAF50',
    marginTop: 4,
    fontStyle: 'italic',
  },
  requiredStar: {
    color: '#4CAF50',
    fontStyle: 'italic',
    fontSize: 14,
  },
  noPetsContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  noPetsMessage: {
    fontSize: 14,
    color: '#5D4037',
    marginBottom: 10,
  },
  addPetButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  addPetButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // Modal styles for appointment confirmation
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    maxWidth: 450,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalHeader: {
    width: '100%',
  },
  modalHeaderGradient: {
    alignItems: 'center',
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalHeaderText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalBody: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 15,
    textAlign: 'center',
  },
  appointmentDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 12,
  },
  appointmentDetailLabel: {
    fontSize: 14,
    color: '#757575',
    flex: 1,
  },
  appointmentDetailValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FBC02D',
  },
  statusText: {
    color: '#F57F17',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noteText: {
    marginTop: 20,
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    fontSize: 14,
    color: '#1B5E20',
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 15,
  },
  modalSecondaryButton: {
    flex: 1,
    backgroundColor: '#ECEFF1',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  modalSecondaryButtonText: {
    color: '#455A64',
    fontWeight: '600',
    fontSize: 14,
  },
  modalPrimaryButton: {
    flex: 1,
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPrimaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 5,
  },
  // Styles mới cho phần chọn thú cưng
  customPetForm: {
    marginTop: 10,
  },
  petSelectionToggle: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  toggleButtonActive: {
    backgroundColor: '#1976D2',
  },
  toggleText: {
    color: '#757575',
    fontWeight: '500',
    fontSize: 14,
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // Styles cho phần hiển thị chủ thú cưng
  selectedOwnerContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#1976D2',
  },
  selectedOwnerLabel: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: 'bold',
    marginRight: 8,
  },
  selectedOwnerValue: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
}); 