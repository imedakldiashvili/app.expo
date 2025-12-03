import React from "react";
import { StyleSheet, Alert } from "react-native";
import { AppLogoName, KeyboardAwareView } from "../../common";
import { SafeView } from "../../common";
import { RegisterMobileConfirmationForm } from "../components";
import { useAuth } from "../../../contexts";

interface RegisterMobileConfirmationScreenProps {
  navigation: any;
  route: any;
}

export default function RegisterMobileConfirmationScreen({
  navigation,
  route,
}: RegisterMobileConfirmationScreenProps) {
  const { register, login } = useAuth();
  
  const handleBackToEmailConfirmation = () => {
    navigation.goBack();
  };

  const handleMobileConfirmed = async (mobileNumber: string) => {
    try {
      // Get registration data from route params
      const email = route?.params?.email || "";
      const password = route?.params?.passwordData?.passwordNew || "";
      const name = email.split("@")[0] || email; // Use email username as name
      
      if (!email || !password) {
        Alert.alert("შეცდომა", "რეგისტრაციის მონაცემები არასრულია");
        return;
      }
      
      // Register user
      const registerSuccess = await register(email, password, name);
      
      if (registerSuccess) {
        // After successful registration, login with the same credentials
        const loginSuccess = await login(email, password);
        
        if (loginSuccess) {
          // AppNavigator will automatically show VerificationScreen since user is not verified
          // After verification, it will show PasscodeNew screen
          // No need to navigate manually - AppNavigator handles it based on state
        } else {
          Alert.alert("შეცდომა", "ავტორიზაცია ვერ მოხერხდა რეგისტრაციის შემდეგ.");
        }
      } else {
        Alert.alert("შეცდომა", "რეგისტრაცია ვერ მოხერხდა. მომხმარებელი შეიძლება უკვე არსებობდეს.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("შეცდომა", "რეგისტრაციისას მოხდა შეცდომა");
    }
  };

  return (
    <SafeView scrollable={false}>
      <KeyboardAwareView style={styles.topSection}>
        <AppLogoName />
      </KeyboardAwareView>

      <RegisterMobileConfirmationForm
        onBack={handleBackToEmailConfirmation}
        onSuccess={handleMobileConfirmed}
        initialMobileNumber={route?.params?.mobileNumber || ""}
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
