import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { Button, FormFieldOtpCode, Description } from "../../../ui";
import { Title, BackButton } from "../../common";
import { useTranslation } from "../../../i18n";

interface RegisterEmailConfirmationFormProps {
  onBack: () => void;
  onSuccess: (email: string) => void;
  initialEmail?: string;
}

interface RegisterEmailConfirmationFormData {
  otpCode: string;
}

export default function RegisterEmailConfirmationForm({
  onBack,
  onSuccess,
  initialEmail = "",
}: RegisterEmailConfirmationFormProps) {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterEmailConfirmationFormData>({
    defaultValues: {
      otpCode: "",
    },
  });

  const onSubmit = async (data: RegisterEmailConfirmationFormData) => {
    // Pass initial email to parent component after OTP validation
    onSuccess(initialEmail);
  };

  const onError = (errors: any) => {
    // Form validation errors - handled by UI
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{t.auth.confirmEmail.toUpperCase()}</Title>
      <Description style={styles.description}>{t.auth.otpCodeSentToContact}</Description>
      <Title style={styles.title}>{initialEmail}</Title>
      
      <FormFieldOtpCode
        control={control}
        name="otpCode"
        OtpContact={initialEmail}
        OtpContactType="email"
        error={errors.otpCode}
        style={styles.input}
      />

      <Button
        title={t.auth.continue}
        variant="primary"
        onPress={handleSubmit(onSubmit, onError)}
        style={styles.button}
      />

      <BackButton onPress={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#999999",
    marginBottom: 20,
  },
  description: {
    textAlign: "center",
  },
  input: {
    marginTop: 6,
    marginBottom: 8,
  },
  button: {
    marginBottom: 15,
  },
});
