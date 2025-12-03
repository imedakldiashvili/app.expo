import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PasscodeContextType {
  isPasscodeSet: boolean;
  isLoading: boolean;
  validatePasscode: (passcode: string) => Promise<boolean>;
  savePasscode: (passcode: string, userInfo?: { id: string; email: string }) => Promise<boolean>;
  clearPasscode: () => Promise<void>;
  clearPasscodeOnly: () => Promise<void>;
  getUserInfo: () => Promise<{ id: string; email: string } | null>;
  getFailedAttempts: () => Promise<number>;
  resetFailedAttempts: () => Promise<void>;
}

const PasscodeContext = createContext<PasscodeContextType | undefined>(undefined);

interface PasscodeProviderProps {
  children: ReactNode;
}

export function PasscodeProvider({ children }: PasscodeProviderProps) {
  const [isPasscodeSet, setIsPasscodeSet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if passcode is set on app start
  useEffect(() => {
    checkPasscodeStatus();
  }, []);

  const checkPasscodeStatus = async () => {
    try {
      const storedPasscode = await AsyncStorage.getItem('user_passcode');
      
      console.log('🔐 Stored Passcode:', storedPasscode); // ✅ Passcode-ის ნახვა
      
      setIsPasscodeSet(!!storedPasscode);
    } catch (error) {
      console.error('Passcode check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePasscode = async (passcode: string): Promise<boolean> => {
    try {
      const storedPasscode = await AsyncStorage.getItem('user_passcode');
      console.log('🔐 Validating:', passcode, 'against stored:', storedPasscode); // ✅ ორივე passcode-ის ნახვა
      
      // If no passcode is set, return false
      if (!storedPasscode) {
        console.log('🔐 No passcode set');
        return false;
      }
      
      const isValid = storedPasscode === passcode;
      
      if (isValid) {
        // Reset failed attempts on successful validation
        await resetFailedAttempts();
        console.log('🔐 Passcode valid, reset failed attempts');
      } else {
        // Increment failed attempts
        const currentAttempts = await getFailedAttempts();
        const newAttempts = currentAttempts + 1;
        await AsyncStorage.setItem('failed_attempts', newAttempts.toString());
        console.log('🔐 Passcode invalid, failed attempts:', newAttempts);
        
        // If failed attempts exceed 3, clear passcode
        if (newAttempts >= 3) {
          console.log('🔐 Too many failed attempts, clearing passcode');
          await clearPasscode();
        }
      }
      
      return isValid;
    } catch (error) {
      console.error('Passcode validation failed:', error);
      return false;
    }
  };

  const savePasscode = async (passcode: string, userInfo?: { id: string; email: string }): Promise<boolean> => {
    try {
      console.log('💾 Saving Passcode:', passcode); // ✅ შენახული passcode-ის ნახვა
      
      // Save passcode
      await AsyncStorage.setItem('user_passcode', passcode);
      
      // Save user info if provided
      if (userInfo) {
        await AsyncStorage.setItem('user_id', userInfo.id);
        await AsyncStorage.setItem('user_email', userInfo.email);
        console.log('💾 Saved User Info:', userInfo); // ✅ მომხმარებლის ინფორმაციის ნახვა
      }
      
      setIsPasscodeSet(true);
      return true;
    } catch (error) {
      console.error('Passcode save failed:', error);
      return false;
    }
  };

  const clearPasscode = async (): Promise<void> => {
    try {
      console.log('🗑️ Clearing All Passcode Data'); // ✅ ყველა Passcode მონაცემის წაშლის ნახვა
      await AsyncStorage.multiRemove(['user_passcode', 'user_id', 'user_email', 'failed_attempts']);
      setIsPasscodeSet(false);
    } catch (error) {
      console.error('Passcode clear failed:', error);
    }
  };

  const clearPasscodeOnly = async (): Promise<void> => {
    try {
      console.log('🗑️ Clearing Passcode Only'); // ✅ მხოლოდ Passcode-ის წაშლის ნახვა
      await AsyncStorage.removeItem('user_passcode');
      setIsPasscodeSet(false);
    } catch (error) {
      console.error('Passcode clear failed:', error);
    }
  };

  const getFailedAttempts = async (): Promise<number> => {
    try {
      const storedAttempts = await AsyncStorage.getItem('failed_attempts');
      return storedAttempts ? parseInt(storedAttempts, 10) : 0;
    } catch (error) {
      console.error('Get failed attempts failed:', error);
      return 0;
    }
  };

  const resetFailedAttempts = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('failed_attempts');
    } catch (error) {
      console.error('Reset failed attempts failed:', error);
    }
  };

  const getUserInfo = async (): Promise<{ id: string; email: string } | null> => {
    try {
      const storedUserId = await AsyncStorage.getItem('user_id');
      const storedUserEmail = await AsyncStorage.getItem('user_email');
      
      if (storedUserId && storedUserEmail) {
        return { id: storedUserId, email: storedUserEmail };
      }
      return null;
    } catch (error) {
      console.error('Get user info failed:', error);
      return null;
    }
  };

  const value: PasscodeContextType = {
    isPasscodeSet,
    isLoading,
    validatePasscode,
    savePasscode,
    clearPasscode,
    clearPasscodeOnly,
    getUserInfo,
    getFailedAttempts,
    resetFailedAttempts,
  };

  return (
    <PasscodeContext.Provider value={value}>
      {children}
    </PasscodeContext.Provider>
  );
}

export function usePasscode() {
  const context = useContext(PasscodeContext);
  if (context === undefined) {
    throw new Error('usePasscode must be used within a PasscodeProvider');
  }
  return context;
}
