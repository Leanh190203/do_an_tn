import { StyleSheet } from 'react-native';
import { commonColors, commonStyles } from './common.styles';

export const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    backgroundColor: commonColors.infoLight,
  },
  header: {
    ...commonStyles.header,
  },
  headerTitle: {
    ...commonStyles.headerTitle,
  },
  backButton: {
    backgroundColor: commonColors.primaryDark,
    borderRadius: 8,
    padding: 8,
  },
  loadingContainer: {
    ...commonStyles.loadingContainer,
  },
  loadingText: {
    ...commonStyles.loadingText,
  },
  formContainer: {
    ...commonStyles.card,
    margin: 15,
    padding: 20,
  },
  formGroup: {
    ...commonStyles.formGroup,
  },
  label: {
    ...commonStyles.label,
    color: commonColors.primaryDark,
  },
  optionalText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: commonColors.textSecondary,
    fontStyle: 'italic',
  },
  input: {
    ...commonStyles.input,
    backgroundColor: commonColors.background,
    borderColor: commonColors.primaryLight,
  },
  textArea: {
    ...commonStyles.textArea,
  },
  pickerContainer: {
    backgroundColor: commonColors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: commonColors.primaryLight,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  dateButton: {
    backgroundColor: commonColors.background,
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
  buttonContainer: {
    ...commonStyles.buttonContainer,
  },
  cancelButton: {
    ...commonStyles.cancelButton,
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    ...commonStyles.cancelButtonText,
  },
  submitButton: {
    ...commonStyles.secondaryButton,
    flex: 2,
  },
  submitButtonText: {
    color: commonColors.textInverted,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});