import { StyleSheet } from 'react-native';
import { commonStyles, commonColors } from './common.styles';

export const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    padding: 20,
  },
  loadingContainer: commonStyles.loadingContainer,
  loadingText: commonStyles.loadingText,
  title: commonStyles.title,
  formGroup: commonStyles.formGroup,
  label: commonStyles.label,
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
  buttonContainer: commonStyles.buttonContainer,
  cancelButton: commonStyles.cancelButton,
  cancelButtonText: commonStyles.cancelButtonText,
  submitButton: {
    ...commonStyles.primaryButton,
    flex: 2,
  },
  submitButtonText: commonStyles.buttonText,
}); 