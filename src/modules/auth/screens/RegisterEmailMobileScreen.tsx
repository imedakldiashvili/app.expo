import React from "react";
import { StyleSheet } from "react-native";
import { AppLogoName, KeyboardAwareView } from "../../common";
import { SafeView } from "../../common";
import { RegisterEmailMobileForm } from "../components";

interface RegisterEmailMobileScreenProps {
  navigation: any;
  route: any;
}

export default function RegisterEmailMobileScreen({
  navigation,
  route,
}: RegisterEmailMobileScreenProps) {
  const email = route?.params?.email || "";
  const handleBackToWelcome = () => {
    navigation.navigate("Welcome");
  };

  const handleRegistrationSuccess = (emailParam: string, mobileNumber: string, referralCode?: string) => {
    navigation.navigate("RegisterPassword", { email: emailParam, mobileNumber, referralCode });
  };

  return (
    <SafeView scrollable={false}>
      <KeyboardAwareView style={styles.topSection}>
        <AppLogoName />
      </KeyboardAwareView>

      <RegisterEmailMobileForm
        onBack={handleBackToWelcome}
        onSuccess={handleRegistrationSuccess}
        initialEmail={email}
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
