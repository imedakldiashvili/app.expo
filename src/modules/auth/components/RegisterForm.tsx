import React, { useState } from "react";
import { View, StyleSheet, Alert, Modal } from "react-native";
import { useForm, useWatch } from "react-hook-form";
import {
  Button,
  FormFieldEmail,
  FormFieldPasswordNew,
  LoadingSpinner,
  FormFieldPasswordConfirm,
  PasswordStrengthBar,
} from "../../../ui";
import { DividerWithText, Title, BackButton } from "../../common";
import { useAuth } from "../../../contexts";
import { useTranslation } from "../../../i18n";
import { OtpValidationForm } from "./";

interface RegisterEmailMobileFormProps {
  onBack: () => void;
  onSuccess: () => void;
  initialEmail?: string;
}

interface RegisterEmailMobileFormData {
  email: string;
  passwordNew: string;
  passwordConfirm: string;
}

export default function RegisterEmailMobileForm({
  onBack,
  onSuccess,
  initialEmail = "",
}: RegisterEmailMobileFormProps) {
  const { register: registerUser, isLoading } = useAuth();
  const { t } = useTranslation();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [formData, setFormData] = useState<RegisterEmailMobileFormData | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<RegisterEmailMobileFormData>({
    defaultValues: {
      email: initialEmail,
      passwordNew: "",
      passwordConfirm: "",
    },
  });

  // Watch passwordNew field for real-time updates
  const passwordNew = useWatch({
    control,
    name: "passwordNew",
  });

  const onSubmit = async (data: RegisterEmailMobileFormData) => {
    // Store form data and start email OTP validation
    setFormData(data);
    setShowOtpModal(true);
  };

  const handleOtpComplete = async (otpCode: string) => {
    // Email OTP validated, proceed with registration
    setShowOtpModal(false);
    await proceedWithRegistration();
  };

  const proceedWithRegistration = async () => {
    if (!formData) return;

    const name = formData.email.split("@")[0];
    const success = await registerUser(
      formData.email,
      formData.passwordNew,
      name
    );

    if (success) {
      onSuccess();
    } else {
      Alert.alert(t.common.welcome, t.auth.registerError);
    }
  };

  const handleCloseModal = () => {
    setShowOtpModal(false);
    setFormData(null);
  };

  const onError = (errors: any) => {
    // Form validation errors - handled by UI
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner text={t.auth.registering} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{t.auth.register.toUpperCase()}</Title>
      <FormFieldEmail
        control={control}
        name="email"
        error={errors.email}
        style={styles.input}
      />
      
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

      {/* OTP Validation Modal */}
      <Modal
        visible={showOtpModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <OtpValidationForm
              OtpContact={formData?.email || ""}
              OtpContactType="email"
              onOtpComplete={handleOtpComplete}
              onBack={handleCloseModal}
            />
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
});
