import { StyleSheet, Dimensions } from 'react-native';
import { commonColors, commonStyles } from './common.styles';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    ...commonStyles.container,
  },
  container: {
    ...commonStyles.container,
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
    ...commonStyles.header,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTitle: {
    ...commonStyles.headerTitle,
  },
  backButton: {
    ...commonStyles.backButton,
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
    backgroundColor: commonColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberActive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: commonColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: commonColors.textInverted,
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepLine: {
    height: 2,
    backgroundColor: commonColors.border,
    flex: 1,
    marginHorizontal: 8,
  },
  stepCompleted: {
    backgroundColor: commonColors.success,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: commonColors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  
  // Cards
  formCard: {
    ...commonStyles.card,
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
  formGroup: commonStyles.formGroup,
  label: {
    ...commonStyles.label,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionalText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: commonColors.textSecondary,
    fontStyle: 'italic',
  },
  input: commonStyles.input,
  textArea: commonStyles.textArea,
  pickerContainer: {
    backgroundColor: commonColors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: commonColors.primaryLight,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  dateButton: {
    backgroundColor: commonColors.surface,
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
    backgroundColor: commonColors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: commonColors.border,
  },
  serviceOptionSelected: {
    backgroundColor: commonColors.primary,
    borderColor: commonColors.primary,
  },
  serviceOptionText: {
    marginLeft: 8,
    fontSize: 14,
    color: commonColors.textPrimary,
  },
  serviceOptionTextSelected: {
    color: commonColors.textInverted,
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
    backgroundColor: commonColors.success,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.7,
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: commonColors.surface,
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
    color: commonColors.textInverted,
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
});