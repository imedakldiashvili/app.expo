import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, LoadingSpinner, Text } from '../../../ui';
import { useAuth, usePasscode } from '../../../contexts';
import { useTranslation } from '../../../i18n';
import { SecurityCode, Title } from '../../common';

interface PassCodeLoginFormProps {
  onChangeUser: () => void;
  onSuccess?: () => void;
  onForgotPasscode?: () => void;
}

interface UserData {
  email?: string;
  person?: {
    personalId: string;
    fullName: string;
  } | null;
}

export default function PassCodeLoginForm({ onChangeUser, onSuccess, onForgotPasscode }: PassCodeLoginFormProps) {
  const { validatePasscode, clearPasscode, getUserInfo, getFailedAttempts } = usePasscode();
  const { logout, user: authUser } = useAuth();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPerson, setUserPerson] = useState<{ personalId: string; fullName: string } | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(3);

  useEffect(() => {
    loadUserInfo();
    loadRemainingAttempts();
  }, []);

  const loadUserInfo = async () => {
    try {
      // First try to get from auth context
      if (authUser) {
        setUserEmail(authUser.email);
        setUserPerson(authUser.person);
        return;
      }

      // Fallback to AsyncStorage
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const userData: UserData = JSON.parse(storedUser);
        setUserEmail(userData.email || '');
        setUserPerson(userData.person || null);
      } else {
        // Fallback to getUserInfo from PasscodeContext
        const userInfo = await getUserInfo();
        if (userInfo) {
          setUserEmail(userInfo.email);
        }
      }
    } catch (error) {
      console.error('Failed to load user info:', error);
    }
  };

  const loadRemainingAttempts = async () => {
    try {
      const failedAttempts = await getFailedAttempts();
      setRemainingAttempts(3 - failedAttempts);
    } catch (error) {
      console.error('Failed to load remaining attempts:', error);
    }
  };

  const handleChangeUser = async () => {
    try {
      setIsLoading(true);
      // Clear passcode and user info
      await clearPasscode();
      // Logout user
      await logout();
      // Call onChangeUser callback
      onChangeUser();
    } catch (error) {
      console.error('Error changing user:', error);
      Alert.alert('Error', 'Failed to change user');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasscodeComplete = async (passcode: (string | number)[]) => {
    setIsValidating(true);
    
    try {
      const passcodeString = passcode.join('');
      
      // Validate passcode using PasscodeContext
      const isValid = await validatePasscode(passcodeString);
      
      setIsValidating(false);
      
      if (isValid) {
        // Navigate to MainTabs (HomeScreen) - AppNavigator will handle this automatically
        onSuccess?.();
      } else {
        // Update remaining attempts
        const failedAttempts = await getFailedAttempts();
        const newRemainingAttempts = 3 - failedAttempts;
        setRemainingAttempts(newRemainingAttempts);
        
        if (newRemainingAttempts > 0) {
          Alert.alert('შეცდომა', `არასწორი პასკოდი. დარჩენილი მცდელობები: ${newRemainingAttempts}`);
        } else {
          // Last attempt failed, go back to login without message
          await handleChangeUser();
        }
      }
    } catch (error) {
      setIsValidating(false);
      Alert.alert('შეცდომა', 'პასკოდის შემოწმება ვერ მოხერხდა');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner text={t.auth.passcode} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userEmail && (
        <View style={styles.userInfoContainer}>
          <Title style={styles.title}>{userEmail}</Title>
          {userPerson && (
            <>
              {userPerson.fullName && (
                <Text variant="body" color="secondary" style={styles.personName}>
                  {userPerson.fullName}
                </Text>
              )}
              {userPerson.personalId && (
                <Text variant="body" color="secondary" style={styles.personalId}>
                  {userPerson.personalId}
                </Text>
              )}
            </>
          )}
        </View>
      )}
      
      {isValidating && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner text={t.auth.passcode} />
        </View>
      )}
      
      <SecurityCode
        title={t.auth.enterPasscode}
        onPassCodeComplete={handlePasscodeComplete}
        disabled={isValidating}
      />
      
      <Button
        title={t.common.changeUser}
        variant="tertiary"
        onPress={handleChangeUser}
        style={styles.backButton}
        disabled={isValidating}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
  },
  personName: {
    marginTop: 4,
    textAlign: 'center',
  },
  personalId: {
    marginTop: 2,
    textAlign: 'center',
    fontSize: 12,
  },
  forgotButton: {
    marginBottom: 10,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 15,
  },
  loadingOverlay: {
    marginBottom: 10,
  },
});
