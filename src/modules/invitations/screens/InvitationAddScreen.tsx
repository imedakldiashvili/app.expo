import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { KeyboardAwareView, SafeView, Title, BackButton, AppLogoName } from '../../common';
import { Button, FormFieldMobileNumber, FormField, LoadingSpinner } from '../../../ui';
import { useTranslation } from '../../../i18n';
import { useNavigation } from '@react-navigation/native';

interface InvitationFormData {
  firstName: string;
  lastName: string;
  mobile: string;
}

export default function InvitationAddScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InvitationFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      mobile: '',
    },
  });

  const onSubmit = async (data: InvitationFormData) => {
    setIsLoading(true);
    try {
      // TODO: Call API to send invitation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      Alert.alert('წარმატება', 'მოწვევა გაგზავნილია', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('შეცდომა', 'მოწვევის გაგზავნა ვერ მოხერხდა');
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (errors: any) => {
    console.log('Form validation errors:', errors);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <SafeView scrollable={false}>
        <View style={styles.container}>
          <LoadingSpinner text={t.invitations?.sending || 'გაგზავნა...'} />
        </View>
      </SafeView>
    );
  }

  return (
    <SafeView scrollable={false}>
      <KeyboardAwareView style={styles.topSection}>
        <AppLogoName />
      </KeyboardAwareView>

      <View style={styles.container}>
      <Title style={styles.title}>
          {t.invitations?.sendInvitation?.toUpperCase() || 'მოწვევის გაგზავნა'.toUpperCase()}
        </Title>
        <FormField
          control={control}
          name="firstName"
          type="text"
          label={t.auth?.firstName || 'სახელი'}
          placeholder={t.auth?.firstNamePlaceholder || 'შეიყვანეთ სახელი'}
          error={errors.firstName}
          style={styles.input}
          rules={{
            required: t.validation?.firstNameRequired || 'სახელი აუცილებელია',
          }}
        />
        <FormField
          control={control}
          name="lastName"
          type="text"
          label={t.auth?.lastName || 'გვარი'}
          placeholder={t.auth?.lastNamePlaceholder || 'შეიყვანეთ გვარი'}
          error={errors.lastName}
          style={styles.input}
          rules={{
            required: t.validation?.lastNameRequired || 'გვარი აუცილებელია',
          }}
        />
        <FormFieldMobileNumber
          control={control}
          name="mobile"
          error={errors.mobile}
          style={styles.input}
        />

        <Button
          title={t.invitations?.send || 'გაგზავნა'}
          variant="primary"
          onPress={handleSubmit(onSubmit, onError)}
          style={styles.button}
        />

        <BackButton onPress={handleBack} />
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
});

