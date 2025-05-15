import { StyleSheet } from 'react-native';

export const commonColors = {
  // Primary colors
  primary: '#1976D2',
  primaryDark: '#0D47A1',
  primaryLight: '#BBDEFB',
  
  // Secondary colors
  accent: '#00897B',
  accentDark: '#00695C',
  accentLight: '#B2DFDB',
  
  // Status colors
  success: '#4CAF50',
  successDark: '#388E3C',
  successLight: '#C8E6C9',
  warning: '#FFC107',
  warningDark: '#FFA000',
  warningLight: '#FFECB3',
  error: '#F44336',
  errorDark: '#D32F2F',
  errorLight: '#FFCDD2',
  info: '#2196F3',
  infoLight: '#E3F2FD',
  
  // Neutral colors
  background: '#F5F7FA',
  surface: '#FFFFFF',
  cardBackground: '#FFFFFF',
  border: '#E0E0E0',
  divider: '#EEEEEE',
  
  // Text colors
  textPrimary: '#212121', 
  textSecondary: '#757575',
  textDisabled: '#9E9E9E',
  textInverted: '#FFFFFF',
  
  // Status badge colors
  pending: '#FF9800',
  confirmed: '#4CAF50',
  cancelled: '#F44336',
  completed: '#1976D2'
};

export const commonStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: commonColors.background,
  },
  
  // Loading states
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
    color: commonColors.textInverted,
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
    color: commonColors.textPrimary,
  },
  input: {
    backgroundColor: commonColors.surface,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: commonColors.border,
    fontSize: 16,
    color: commonColors.textPrimary,
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
  primaryButtonText: {
    color: commonColors.textInverted,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: commonColors.accent,
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: commonColors.textInverted,
    fontSize: 16,
    fontWeight: 'bold', 
  },
  cancelButton: {
    backgroundColor: '#ECEFF1',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: commonColors.textSecondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Card styles
  card: {
    backgroundColor: commonColors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Text styles
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: commonColors.textPrimary,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: commonColors.textSecondary,
    marginBottom: 8,
  },
  
  // Status badge styles
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: commonColors.textInverted,
  },
  
  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: commonColors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  }
});