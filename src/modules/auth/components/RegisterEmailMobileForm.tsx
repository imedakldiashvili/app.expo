import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import {
  Button,
  FormFieldEmail,
  FormFieldMobileNumber,
  FormFieldReferralCode,
} from "../../../ui";
import { Title, BackButton } from "../../common";
import { useTranslation } from "../../../i18n";

interface RegisterEmailMobileFormProps {
  onBack: () => void;
  onSuccess: (email: string, mobileNumber: string, referralCode?: string) => void;
  initialEmail?: string;
}

interface RegisterEmailMobileFormData {
  email: string;
  mobileNumber: string;
  referralCode?: string;
}

export default function RegisterEmailMobileForm({
  onBack,
  onSuccess,
  initialEmail = "",
}: RegisterEmailMobileFormProps) {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterEmailMobileFormData>({
    defaultValues: {
      email: initialEmail,
      mobileNumber: "",
      referralCode: "",
    },
  });


  const onSubmit = async (data: RegisterEmailMobileFormData) => {
    onSuccess(data.email, data.mobileNumber, data.referralCode);
  };

  const onError = (errors: any) => {
    // Form validation errors - handled by UI
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{t.auth.register.toUpperCase()}</Title>
      <FormFieldEmail
        control={control}
        name="email"
        error={errors.email}
        style={styles.input}
      />

      <FormFieldMobileNumber
        control={control}
        name="mobileNumber"
        error={errors.mobileNumber}
        style={styles.input}
      />

      <FormFieldReferralCode
        control={control}
        name="referralCode"
        error={errors.referralCode}
        style={styles.input}
        placeholder="რეფერალ კოდი (არასავალდებულო)"
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
  input: {
    marginTop: 6,
    marginBottom: 8,
  },
  button: {
    marginBottom: 15,
  },
  backButton: {
    marginBottom: 15,
  },
});
