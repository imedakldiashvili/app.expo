// Color constants for the app
export const colors = {
  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#4DA6FF',
  
  // Secondary colors
  secondary: '#8E8E93',
  secondaryDark: '#6D6D70',
  secondaryLight: '#A8A8AC',
  
  // Background colors
  background: '#F5F5F5',
  backgroundSecondary: '#F7FAFC',
  backgroundTertiary: '#F0F0F0',
  
  // Text colors
  text: '#2D3748',
  textSecondary: '#4A5568',
  textTertiary: '#8E8E93',
  textLight: '#A0AEC0',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#E53E3E',
  danger: '#DC2626',
  info: '#3B82F6',
  
  // Border colors
  border: '#E2E8F0',
  borderLight: '#F0F0F0',
  borderDark: '#CBD5E0',
  
  // Card colors
  cardBackground: '#FFFFFF',
  cardBorder: '#E2E8F0',
  
  // Avatar colors
  avatarBackground: '#007AFF',
  avatarText: '#FFFFFF',
  
  // Tab bar colors
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#007AFF',
  tabBarInactive: '#8E8E93',
  tabBarBorder: '#E2E8F0',
  
  // Header colors
  headerBackground: '#FFFFFF',
  headerBorder: '#E2E8F0',
  
  // Button colors
  buttonPrimary: '#007AFF',
  buttonSecondary: '#8E8E93',
  buttonDanger: '#E53E3E',
  buttonOutline: '#E2E8F0',
  
  // Input colors
  inputBackground: '#F7FAFC',
  inputBorder: '#E2E8F0',
  inputFocused: '#007AFF',
  inputError: '#E53E3E',
  
  // Safe area colors
  safeAreaBackground: '#FFFFFF',
} as const;

// Color type for TypeScript
export type ColorKey = keyof typeof colors;
