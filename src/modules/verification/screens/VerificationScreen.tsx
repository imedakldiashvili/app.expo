import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../contexts';
import { useTranslation } from '../../../i18n';
import { SafeView, KeyboardAwareView, Title, AppLogoName } from '../../common';
import { Text, Button, Spacer, FormFieldPersonalId } from '../../../ui';
import { mockBankAccounts, verification } from '../../../api';
import { BankAccount } from '../components';

interface VerificationFormData {
  personalId: string;
}

export default function VerificationScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user, verifyUser, skipVerification } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>({
    defaultValues: {
      personalId: '',
    },
  });

  const onSubmit = async (data: VerificationFormData) => {
    if (!user) return;

    setIsVerifying(true);
    try {
      // Check if personal ID exists in verification data
      const verificationResult = verification(data.personalId);
      
      if (!verificationResult) {
        // Personal ID not found
        Alert.alert(
          t.common.error || 'შეცდომა',
          'პირადი ნომრით ჩარიცხვა ვერ მოიძებნა'
        );
        setIsVerifying(false);
        return;
      }

      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Verify user with found verification data
      const success = await verifyUser(verificationResult);
      
      if (success) {
        // AppNavigator will automatically show PasscodeNew screen since user is verified but passcode is not set
        // No need to navigate manually - AppNavigator handles it based on state
      } else {
        Alert.alert(
          t.common.error || 'შეცდომა',
          t.common.somethingWentWrong || 'რაღაც შეცდომა მოხდა'
        );
      }
    } catch (error) {
      console.error('Verification failed:', error);
      Alert.alert(
        t.common.error || 'შეცდომა',
        t.common.somethingWentWrong || 'რაღაც შეცდომა მოხდა'
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const onError = (errors: any) => {
    // Form validation errors - handled by UI
    console.log('Form validation errors:', errors);
  };

  const handleSkip = async () => {
    try {
      const success = await skipVerification();
      if (success) {
        // AppNavigator will automatically show PasscodeNew screen since user skipped verification
        // No need to navigate manually - AppNavigator handles it based on state
      } else {
        Alert.alert(
          t.common.error || 'შეცდომა',
          t.common.somethingWentWrong || 'რაღაც შეცდომა მოხდა'
        );
      }
    } catch (error) {
      console.error('Skip verification failed:', error);
      Alert.alert(
        t.common.error || 'შეცდომა',
        t.common.somethingWentWrong || 'რაღაც შეცდომა მოხდა'
      );
    }
  };

  return (
    <SafeView scrollable={false}>
      <KeyboardAwareView style={styles.topSection}>
        <AppLogoName />
        <Spacer size="lg" />
        <View style={styles.verificationTextContainer}>
          <Text variant="body" color="secondary" style={styles.verificationText}>
            თქვენი პირადი საბანკო ანგარიშიდან{'\n'}
            გადარიცხეთ 1 თეთრი{'\n'}
            ერთ-ერთ ჩვენს საბანკო ანგარიშზე
          </Text>
          <Spacer size="md" />
          {mockBankAccounts.map((account) => (
          <BankAccount key={account.id} account={account} />
        ))}
        </View>
      </KeyboardAwareView>

      <View style={styles.container}>
        <Title style={styles.title}>
          {t.verification?.title?.toUpperCase() || 'ვერიფიკაცია'.toUpperCase()}
        </Title>




        <FormFieldPersonalId
          control={control}
          name="personalId"
          error={errors.personalId}
          placeholder="პირადი ნომერი"
          style={styles.input}
        />

        <Button
          title={t.verification?.verifyButton || 'ვერიფიკაცია'}
          variant="primary"
          onPress={handleSubmit(onSubmit, onError)}
          disabled={isVerifying}
          style={styles.button}
        />

        <Button
          title={t.verification?.skipButton || 'გამოტოვება'}
          variant="tertiary"
          onPress={handleSkip}
          disabled={isVerifying}
          style={styles.skipButton}
        />

        {isVerifying && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        )}
      </View>
    </SafeView>
  );
}

const styles = StyleSheet.create({
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  verificationText: {
    textAlign: 'center',
    lineHeight: 24,
  },
  container: {
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999999',
    marginBottom: 20,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginBottom: 15,
  },
  skipButton: {
    marginBottom: 15,
  },
  loadingContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
});

