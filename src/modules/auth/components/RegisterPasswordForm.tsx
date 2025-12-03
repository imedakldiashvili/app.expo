import React from "react";
import { View, StyleSheet } from "react-native";
import { useForm, useWatch } from "react-hook-form";
import {
  Button,
  FormFieldPasswordNew,
  FormFieldPasswordConfirm,
  PasswordStrengthBar,
} from "../../../ui";
import { Title, BackButton } from "../../common";
import { useTranslation } from "../../../i18n";

interface RegisterPasswordFormProps {
  onBack: () => void;
  onSuccess: (passwordData: RegisterPasswordFormData) => void;
}

interface RegisterPasswordFormData {
  passwordNew: string;
  passwordConfirm: string;
}

export default function RegisterPasswordForm({
  onBack,
  onSuccess,
}: RegisterPasswordFormProps) {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPasswordFormData>({
    defaultValues: {
      passwordNew: "",
      passwordConfirm: "",
    },
  });

  // Watch passwordNew field for real-time updates
  const passwordNew = useWatch({
    control,
    name: "passwordNew",
  });

  const onSubmit = async (data: RegisterPasswordFormData) => {
    // Pass password data to parent component
    onSuccess(data);
  };

  const onError = (errors: any) => {
    // Form validation errors - handled by UI
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{t.auth.setPassword.toUpperCase()}</Title>
      
      <FormFieldPasswordNew
        control={control}
        name="passwordNew"
        error={errors.passwordNew}
        style={styles.input}
      />
      <PasswordStrengthBar password={passwordNew} />
      
      <FormFieldPasswordConfirm
        control={control}
        name="passwordConfirm"
        error={errors.passwordConfirm}
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
  input: {
    marginTop: 6,
    marginBottom: 8,
  },
  button: {
    marginBottom: 15,
  },
});
