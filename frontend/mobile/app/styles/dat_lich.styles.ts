import { StyleSheet } from 'react-native';
import { commonColors, commonStyles } from './common.styles';

export const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  header: {
    ...commonStyles.header,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backIcon: {
    marginRight: 10,
  },
  headerTitle: {
    ...commonStyles.headerTitle,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  infoBox: {
    backgroundColor: commonColors.infoLight,
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: commonColors.primary,
    flex: 1,
    marginLeft: 10,
  },
  formContainer: {
    backgroundColor: commonColors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: commonColors.textPrimary,
    marginBottom: 16,
  },
  serviceSection: {
    marginTop: 24,
  },
  dateTimeSection: {
    marginTop: 24,
  },
  contactSection: {
    marginTop: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    ...commonStyles.label,
  },
  required: {
    color: commonColors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: commonColors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: commonColors.surface,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: commonColors.textPrimary,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  textArea: {
    ...commonStyles.textArea,
  },
  serviceList: {
    marginTop: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: commonColors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: commonColors.border,
    padding: 12,
    marginBottom: 10,
  },
  selectedService: {
    backgroundColor: commonColors.primary,
    borderColor: commonColors.primary,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: commonColors.infoLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: commonColors.textPrimary,
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    color: commonColors.textSecondary,
  },
  selectedServiceText: {
    color: commonColors.textInverted,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateContainer: {
    flex: 1,
    marginRight: 8,
  },
  timeContainer: {
    flex: 1,
    marginLeft: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: commonColors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: commonColors.surface,
  },
  dateTimeText: {
    fontSize: 16,
    color: commonColors.textPrimary,
    flex: 1,
    marginLeft: 8,
  },
  submitButton: {
    ...commonStyles.primaryButton,
    marginTop: 24,
  },
  submitButtonText: {
    ...commonStyles.primaryButtonText,
    marginLeft: 8,
  },
  noteContainer: {
    marginTop: 24,
    backgroundColor: commonColors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: commonColors.textPrimary,
    marginBottom: 10,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  noteText: {
    fontSize: 14,
    color: commonColors.textSecondary,
    flex: 1,
  },

  // Not logged in screen styles
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  notLoggedInTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: commonColors.primary,
    marginBottom: 10,
  },
  notLoggedInText: {
    fontSize: 16,
    color: commonColors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    ...commonStyles.primaryButton,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 16,
  },
  loginButtonText: {
    ...commonStyles.primaryButtonText,
    marginLeft: 8,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: commonColors.textSecondary,
    fontSize: 14,
  },
});