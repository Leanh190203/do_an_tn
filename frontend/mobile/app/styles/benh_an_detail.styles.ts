import { StyleSheet } from 'react-native';
import { commonColors, commonStyles } from './common.styles';

export const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    backgroundColor: commonColors.infoLight,
  },
  loadingContainer: {
    ...commonStyles.loadingContainer,
    backgroundColor: commonColors.infoLight,
  },
  loadingText: {
    ...commonStyles.loadingText,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: commonColors.textSecondary,
    marginTop: 10,
    marginBottom: 20,
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
  backButtonText: {
    color: commonColors.textInverted,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  card: {
    ...commonStyles.card,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: commonColors.primaryDark,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: commonColors.textSecondary,
    marginLeft: 10,
    marginRight: 5,
  },
  value: {
    fontSize: 16,
    color: commonColors.textPrimary,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: commonColors.divider,
    marginVertical: 15,
  },
  notesText: {
    fontSize: 16,
    color: commonColors.textSecondary,
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
    marginTop: 5,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: commonColors.accent,
  },
  deleteButton: {
    backgroundColor: commonColors.error,
  },
  actionButtonText: {
    color: commonColors.textInverted,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  statusBadge: {
    ...commonStyles.statusBadge,
  },
  statusBadgeText: {
    ...commonStyles.statusBadgeText,
  },
  viewPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: commonColors.infoLight,
    padding: 15,
    borderRadius: 8,
    margin: 15,
    marginTop: 5,
    borderWidth: 1,
    borderColor: commonColors.primary,
  },
  viewPetButtonText: {
    color: commonColors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  }
});