import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { Button, Text, Card } from '../../../ui';
import { useTranslation } from '../../../i18n';
import LanguageList from './LanguageList';

export default function LanguageSwitcher() {
  const { t, language, setLanguage } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const languages = [
    { code: 'ka-ge' as const, name: t.languages.georgian, flag: '🇬🇪' },
    { code: 'en-uk' as const, name: t.languages.english, flag: '🇬🇧' },
    { code: 'es-es' as const, name: t.languages.spanish, flag: '🇪🇸' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageSelect = async (selectedLanguage: 'ka-ge' | 'en-uk' | 'es-es') => {
    await setLanguage(selectedLanguage);
    setModalVisible(false);
  };

  const showLanguageModal = () => {
    setModalVisible(true);
  };

  return (
    <>
      {!isKeyboardVisible && (
        <View style={styles.languageSection}>
          <Button
            title={`${currentLanguage?.flag} ${currentLanguage?.name}`}
            variant="tertiary"
            onPress={showLanguageModal}
            style={styles.languageButton}
          />
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Card style={styles.modalCard}>
              <LanguageList
                languages={languages}
                currentLanguage={language}
                onLanguageSelect={handleLanguageSelect}
              />
            </Card>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  languageSection: {
    marginTop: 5,
    marginBottom: 5,
  },
  languageButton: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  modalContent: {
    width: '100%',
  },
  modalCard: {
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderRadius: 0,
  },
});
