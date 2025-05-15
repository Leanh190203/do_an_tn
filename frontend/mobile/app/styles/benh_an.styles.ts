import { StyleSheet, Dimensions } from 'react-native';
import { commonColors, commonStyles } from './common.styles';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  rootContainer: {
    ...commonStyles.container,
  },
  
  // Header styles
  header: {
    ...commonStyles.header,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerTitle: {
    ...commonStyles.headerTitle,
  },
  backButton: {
    ...commonStyles.backButton,
  },
  
  // Loading styles
  loadingContainer: {
    ...commonStyles.loadingContainer,
  },
  loadingText: {
    ...commonStyles.loadingText,
  },
  
  // Filter styles
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: commonColors.surface,
    padding: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  filterButtonActive: {
    backgroundColor: commonColors.infoLight,
  },
  filterButtonText: {
    fontSize: 14,
    color: commonColors.textSecondary,
  },
  filterButtonTextActive: {
    color: commonColors.primary,
    fontWeight: 'bold',
  },
  
  // Search styles
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: commonColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: commonColors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: commonColors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: commonColors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: commonColors.textPrimary,
    paddingVertical: 4,
  },
  
  // Empty state
  emptyContainer: {
    ...commonStyles.emptyContainer,
  },
  emptyTitle: {
    ...commonStyles.title,
  },
  emptyText: {
    ...commonStyles.emptyText,
    marginBottom: 24,
  },
  emptyButton: {
    ...commonStyles.primaryButton,
  },
  emptyButtonText: {
    ...commonStyles.primaryButtonText,
  },
  
  // Card styles
  card: {
    ...commonStyles.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  petInfoContainer: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: commonColors.textPrimary,
    marginBottom: 4,
  },
  petOwner: {
    fontSize: 14,
    color: commonColors.textSecondary,
  },
  statusBadge: {
    ...commonStyles.statusBadge,
  },
  statusText: {
    ...commonStyles.statusBadgeText,
  },
  
  // Details section
  detailsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: commonColors.divider,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    marginLeft: 4,
    fontSize: 13,
    color: commonColors.textSecondary,
  },
  diagnosisText: {
    marginLeft: 4,
    fontSize: 13,
    color: commonColors.warning,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  
  // Card actions
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: commonColors.background,
  },
  viewDetailsText: {
    fontSize: 14,
    color: commonColors.primary,
    fontWeight: '500',
  },
  viewPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: commonColors.infoLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  viewPetButtonText: {
    fontSize: 12,
    color: commonColors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  
  // Floating action button
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: commonColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  
  // New styles
  container: {
    flex: 1,
    backgroundColor: commonColors.background,
  },
  
  listContainer: {
    paddingBottom: 80, // Space for floating button
  },
  
  cardDivider: {
    height: 1,
    backgroundColor: commonColors.divider,
    marginHorizontal: 16,
  },
  
  cardContent: {
    padding: 16,
  },
  
  infoMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  dateText: {
    fontSize: 14,
    color: commonColors.textSecondary,
    marginLeft: 8,
  },
  
  serviceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: commonColors.infoLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  
  serviceText: {
    fontSize: 14,
    color: commonColors.textSecondary,
    marginLeft: 8,
  },
  
  diagnosisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  
  diagnosisContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  diagnosisLabel: {
    fontSize: 14,
    color: commonColors.textSecondary,
    marginLeft: 8,
    marginRight: 4,
  },
});