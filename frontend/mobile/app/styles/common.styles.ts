import { StyleSheet } from 'react-native';

export const commonColors = {
  primary: '#1976D2',
  primaryDark: '#0D47A1',
  primaryLight: '#BBDEFB',
  accent: '#00897B',
  danger: '#F44336',
  background: '#E3F2FD',
  cardBackground: '#FFFFFF',
  textPrimary: '#212121',
  textSecondary: '#616161',
  border: '#E0E0E0',
  divider: '#E0E0E0',
};

export const commonStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: commonColors.background,
  },
  
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: commonColors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: commonColors.primary,
  },
  
  // Header styles
  header: {
    backgroundColor: commonColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 24,
  },
  backButton: {
    backgroundColor: commonColors.primaryDark,
    borderRadius: 8,
    padding: 8,
  },
  
  // Form elements
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: commonColors.primaryDark,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: commonColors.primaryLight,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  
  // Button styles
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: commonColors.primary,
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: commonColors.accent,
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#ECEFF1',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#455A64',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Card styles
  card: {
    backgroundColor: commonColors.cardBackground,
    borderRadius: 10,
    margin: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  
  // Text styles
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: commonColors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
}); 