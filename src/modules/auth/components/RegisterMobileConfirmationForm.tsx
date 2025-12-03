import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { Button, FormFieldOtpCode, Description } from "../../../ui";
import { Title, BackButton } from "../../common";
import { useTranslation } from "../../../i18n";

interface RegisterMobileConfirmationFormProps {
  onBack: () => void;
  onSuccess: (mobileNumber: string) => void;
  initialMobileNumber?: string;
}

interface RegisterMobileConfirmationFormData {
  otpCode: string;
}

export default function RegisterMobileConfirmationForm({
  onBack,
  onSuccess,
  initialMobileNumber = "",
}: RegisterMobileConfirmationFormProps) {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterMobileConfirmationFormData>({
    defaultValues: {
      otpCode: "",
    },
  });

  const onSubmit = async (data: RegisterMobileConfirmationFormData) => {
    // Pass initial mobile number to parent component after OTP validation
    onSuccess(initialMobileNumber);
  };

  const onError = (errors: any) => {
    // Form validation errors - handled by UI
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{t.auth.confirmMobile.toUpperCase()}</Title>
      <Description style={styles.description}>{t.auth.otpCodeSentToContact}</Description>
      <Title style={styles.title}>{initialMobileNumber}</Title>
      
      <FormFieldOtpCode
        control={control}
        name="otpCode"
        OtpContact={initialMobileNumber}
        OtpContactType="mobile"
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
