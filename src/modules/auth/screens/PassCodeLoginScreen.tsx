import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareView, AppLogoName, SafeView, Barcode } from '../../common';
import { PassCodeLoginForm } from '../components';
import { useAuth, usePasscode } from '../../../contexts';

interface PassCodeLoginScreenProps {
  navigation: any;
}

interface StoredUser {
  id: string;
  isVerified: boolean;
  person: {
    personalId: string;
    fullName: string;
  } | null;
}

export default function PassCodeLoginScreen({ navigation }: PassCodeLoginScreenProps) {
  const { logout, loginWithPasscode, user: authUser } = useAuth();
  const { resetFailedAttempts } = usePasscode();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    loadUserData();
  }, [authUser]);

  // Reload user data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [authUser])
  );

  const loadUserData = async () => {
    try {
      // First try to get from auth context
      if (authUser) {
        console.log('PassCodeLoginScreen - Using authUser:', {
          isVerified: authUser.isVerified,
          hasPerson: !!authUser.person,
          personalId: authUser.person?.personalId,
        });
        setUser({
          id: authUser.id,
          isVerified: authUser.isVerified,
          person: authUser.person,
        });
        return;
      }

      // Fallback to AsyncStorage
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const userData: StoredUser = JSON.parse(storedUser);
        console.log('PassCodeLoginScreen - Loaded from AsyncStorage:', {
          isVerified: userData.isVerified,
          hasPerson: !!userData.person,
          personalId: userData.person?.personalId,
          fullData: userData,
        });
        setUser(userData);
      } else {
        console.log('PassCodeLoginScreen - No user data in AsyncStorage');
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      setUser(null);
    }
  };

  const handleBackToLogin = async () => {
    // Logout user and go back to Login screen
    await logout();
    // Navigation will be handled automatically by AppNavigator
  };

  const handlePasscodeSuccess = async () => {
    // If passcode is valid, login user and AppNavigator will automatically show MainTabs
    await loginWithPasscode();
    // Reset failed attempts on successful login
    await resetFailedAttempts();
  };

  const handleForgotPasscode = async () => {
    // Clear passcode and go back to Login screen
    await logout();
    // Navigation will be handled automatically by AppNavigator
  };

  // Use authUser if available, otherwise use loaded user
  const currentUser = authUser || user;
  const showBarcode = currentUser?.isVerified && currentUser?.person?.personalId;

  // Debug logging
  React.useEffect(() => {
    if (currentUser) {
      console.log('PassCodeLoginScreen - User data:', {
        isVerified: currentUser.isVerified,
        hasPerson: !!currentUser.person,
        personalId: currentUser.person?.personalId,
        showBarcode,
        authUser: !!authUser,
        loadedUser: !!user,
      });
    } else {
      console.log('PassCodeLoginScreen - No user data', {
        authUser: !!authUser,
        loadedUser: !!user,
      });
    }
  }, [currentUser, showBarcode, authUser, user]);

  return (
    <SafeView scrollable={false}>
      <KeyboardAwareView style={styles.topSection}>
        <View style={styles.logoContainer}>
          {showBarcode && currentUser?.person?.personalId && (
            <View style={styles.barcodeWrapper}>
              <Barcode 
                value={currentUser.person.personalId} 
                width={180} 
                height={50}
              />
            </View>
          )}
          <AppLogoName />
        </View>
      </KeyboardAwareView>

      <PassCodeLoginForm 
        onChangeUser={handleBackToLogin} 
        onSuccess={handlePasscodeSuccess}
        onForgotPasscode={handleForgotPasscode}
      />
    </SafeView>
  );
}

const styles = StyleSheet.create({
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodeWrapper: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
