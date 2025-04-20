import { StyleSheet } from 'react-native';
import { commonColors, commonStyles } from './common.styles';

export const styles = StyleSheet.create({
  ...commonStyles,
  
  // Specific styles for benh_an screen
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 18,
    color: '#90A4AE',
    textAlign: 'center' as const,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  petName: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: commonColors.primary,
  },
  cardText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 2,
  },
  addButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center',
    backgroundColor: commonColors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold' as const,
    marginLeft: 12,
    textTransform: 'uppercase' as const,
  },
}); 