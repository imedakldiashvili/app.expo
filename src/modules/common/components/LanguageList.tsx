import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../../../ui';
import { colors } from '../../../constants';

interface Language {
  code: 'ka-ge' | 'en-uk' | 'es-es';
  name: string;
  flag: string;
}

interface LanguageListProps {
  languages: Language[];
  currentLanguage: string;
  onLanguageSelect: (languageCode: 'ka-ge' | 'en-uk' | 'es-es') => void;
}

export default function LanguageList({ 
  languages, 
  currentLanguage, 
  onLanguageSelect 
}: LanguageListProps) {
  return (
    <View style={styles.container}>
      {languages.map((language) => (
        <TouchableOpacity
          key={language.code}
          style={styles.languageItem}
          onPress={() => onLanguageSelect(language.code)}
        >
          <View style={styles.flagContainer}>
            <Text style={styles.flag}>{language.flag}</Text>
          </View>
          <Text style={styles.languageName}>
            {language.name}
          </Text>
          <View style={styles.checkContainer}>
            {currentLanguage === language.code && (
              <Text style={styles.checkIcon}>✓</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
  },
  flagContainer: {
    width: 32,
    alignItems: 'center',
  },
  flag: {
    fontSize: 20,
  },
  languageName: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
    marginLeft: 12,
  },
  checkContainer: {
    width: 24,
    alignItems: 'center',
  },
  checkIcon: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },
});
