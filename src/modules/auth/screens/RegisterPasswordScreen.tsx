import React from "react";
import { StyleSheet } from "react-native";
import { AppLogoName, KeyboardAwareView } from "../../common";
import { SafeView } from "../../common";
import { RegisterPasswordForm } from "../components";

interface RegisterPasswordScreenProps {
  navigation: any;
  route: any;
}

export default function RegisterPasswordScreen({
  navigation,
  route,
}: RegisterPasswordScreenProps) {
  const handleBackToEmailMobile = () => {
    navigation.goBack();
  };

  const handlePasswordSuccess = (passwordData: any) => {
    // Navigate to email confirmation screen
    navigation.navigate("RegisterEmailConfirmation", { 
      passwordData,
      email: route?.params?.email,
      mobileNumber: route?.params?.mobileNumber,
      referralCode: route?.params?.referralCode
    });
  };

  return (
    <SafeView scrollable={false}>
      <KeyboardAwareView style={styles.topSection}>
        <AppLogoName />
      </KeyboardAwareView>

      <RegisterPasswordForm
        onBack={handleBackToEmailMobile}
        onSuccess={handlePasswordSuccess}
      />
    </SafeView>
  );
}

const styles = StyleSheet.create({
  topSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
