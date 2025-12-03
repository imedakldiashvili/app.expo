import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, PasscodeProvider, SelectionProvider } from './src/contexts';
import { LanguageProvider } from './src/i18n';
import { AppNavigator } from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <LanguageProvider>
        <AuthProvider>
          <PasscodeProvider>
            <SelectionProvider>
              <AppNavigator />
            </SelectionProvider>
          </PasscodeProvider>
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
