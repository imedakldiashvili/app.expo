import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Spacer, ActionButton, Text } from '../../../ui';
import { useAuth } from '../../../contexts';
import { useTranslation } from '../../../i18n';
import { ProfileCard, LogoutButton } from '../components';
import { LanguageSwitcher, ScreenView } from '../../common';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <ScreenView scrollable={false}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ProfileCard user={user} />
          <Spacer size="lg" />
          <ActionButton
            id="email"
            iconName="mail"
            label={t.auth.email || "ელ-ფოსტა"}
            title={user?.email || t.auth.email || "ელ-ფოსტა"}
          />
          
          <ActionButton
            id="mobile"
            iconName="phone"
            label={t.auth.mobileNumber}
            title={t.auth.mobileNumber}
          />

          <ActionButton
            id="passcode"
            iconName="safety"
            label={t.auth.passcode}
            title={t.auth.passcode}
          />

          <ActionButton
            id="password"
            iconName="lock"
            label={t.auth.password}
            title={t.auth.password}
          />

        </ScrollView>
        <View style={styles.fixedBottom}>
          <LanguageSwitcher />
          <LogoutButton onLogout={logout} />
        </View>
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150, // Space for fixed LanguageSwitcher and LogoutButton
  },
  fixedBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  passcodeIcon: {
    fontSize: 18,
    fontWeight: '700',
  },
});

