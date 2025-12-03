import React from "react";
import { StyleSheet } from "react-native";
import { AppLogoName, KeyboardAwareView } from "../../common";
import { SafeView } from "../../common";
import { RegisterEmailConfirmationForm } from "../components";

interface RegisterEmailConfirmationScreenProps {
  navigation: any;
  route: any;
}

export default function RegisterEmailConfirmationScreen({
  navigation,
  route,
}: RegisterEmailConfirmationScreenProps) {
  const handleBackToWelcome = () => {
    navigation.navigate("Welcome");
  };

  const handleEmailConfirmed = (email: string) => {
    // Navigate to mobile confirmation screen with all data
    navigation.navigate("RegisterMobileConfirmation", { 
      email,
      passwordData: route?.params?.passwordData,
      mobileNumber: route?.params?.mobileNumber,
      referralCode: route?.params?.referralCode
    });
  };

  return (
    <SafeView scrollable={false}>
      <KeyboardAwareView style={styles.topSection}>
        <AppLogoName />
      </KeyboardAwareView>

      <RegisterEmailConfirmationForm
        onBack={handleBackToWelcome}
        onSuccess={handleEmailConfirmed}
        initialEmail={route?.params?.email || ""}
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
