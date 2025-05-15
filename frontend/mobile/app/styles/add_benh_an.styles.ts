import { StyleSheet, Dimensions } from 'react-native';
import { commonColors, commonStyles } from './common.styles';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: commonStyles.loadingContainer,
  loadingText: commonStyles.loadingText,
  title: commonStyles.title,
  
  // Header Styles
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 12,
  },
  
  // Step Indicator
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberActive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepLine: {
    height: 3,
    backgroundColor: '#E0E0E0',
    flex: 1,
    marginHorizontal: 8,
  },
  stepCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  // Cards
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  summaryCard: {
    backgroundColor: commonColors.infoLight,
    borderRadius: 10,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: commonColors.primary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: commonColors.primaryLight,
  },
  summaryLabel: {
    fontSize: 14,
    color: commonColors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: commonColors.textPrimary,
  },
  
  // Form Elements
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionalText: {
    fontSize: 14,
    color: '#78909C',
    fontStyle: 'italic',
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F5F8FA',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#F5F8FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    overflow: 'hidden',
  },
  picker: {
    height: 48,
  },
  dateButton: {
    backgroundColor: '#F5F8FA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  dateText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  
  // Service Options
  serviceOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 8,
    gap: 8,
  },
  serviceOption: {
    width: '45%',  // Chiều rộng thu nhỏ để tránh trường hợp một hàng chỉ chứa được 1 item
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: commonColors.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: commonColors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  serviceOptionSelected: {
    backgroundColor: commonColors.primary,
    borderColor: commonColors.primary,
    elevation: 4,
    shadowOpacity: 0.2,
  },
  serviceOptionText: {
    marginLeft: 8,
    fontSize: 14,
    color: commonColors.textPrimary,
    flex: 1,
  },
  serviceOptionTextSelected: {
    color: commonColors.textInverted,
  },
  
  // Pet selection toggle
  petSelectionToggle: {
    flexDirection: 'row',
    backgroundColor: '#F5F8FA',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#1976D2',
    elevation: 2,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  toggleText: {
    fontSize: 14,
    color: '#78909C',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  // Custom pet form
  customPetForm: {
    backgroundColor: '#F8F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },

  // Selected owner container
  selectedOwnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  selectedOwnerLabel: {
    fontSize: 14,
    color: '#2E7D32',
    marginRight: 8,
  },
  selectedOwnerValue: {
    fontSize: 16,
    color: '#1B5E20',
    fontWeight: '600',
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: commonColors.surface,
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: commonColors.border,
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
    backgroundColor: commonColors.primary,
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
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: commonColors.textInverted,
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 8,
  },
  
  // Customer field styles
  readOnlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: commonColors.background,
    borderWidth: 1,
    borderColor: commonColors.success,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  readOnlyText: {
    fontSize: 16,
    color: commonColors.textPrimary,
    flex: 1,
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  
  // Customer info display
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
    color: commonColors.textPrimary,
  },
  userPhone: {
    fontSize: 14,
    color: commonColors.textSecondary,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: commonColors.primary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  userStatus: {
    fontSize: 13,
    color: commonColors.success,
    marginTop: 4,
    fontStyle: 'italic',
  },
  requiredStar: {
    color: commonColors.success,
    fontStyle: 'italic',
    fontSize: 14,
  },
  noPetsContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: commonColors.warningLight,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: commonColors.warning,
  },
  noPetsMessage: {
    fontSize: 14,
    color: '#5D4037',
    marginBottom: 10,
  },
  addPetButton: {
    backgroundColor: commonColors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  addPetButtonText: {
    color: commonColors.textInverted,
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // Modal styles for appointment confirmation
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end', // Modal slides up from bottom
  },
  modalContent: {
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalBody: {
    padding: 20,
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
    color: commonColors.textInverted,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: commonColors.textPrimary,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: commonColors.border,
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
    backgroundColor: commonColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPrimaryButtonText: {
    color: commonColors.textInverted,
    fontWeight: '600',
    fontSize: 14,
    marginRight: 5,
  },
  
  // Modal styles for confirmation
  successHeader: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  successHeaderContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successHeaderText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  detailSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusContainer: {
    marginTop: 5,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FB8C00',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  noteContainer: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 8,
  },
  noteText: {
    color: '#4B5563',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});