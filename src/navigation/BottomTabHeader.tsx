import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../ui';
import { useAuth } from '../contexts';
import { colors } from '../constants';
import { AntDesign } from '@expo/vector-icons';

interface BottomTabHeaderProps {
  navigation: any;
}

export default function BottomTabHeader({ navigation }: BottomTabHeaderProps) {
  const { user } = useAuth();

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/icon.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text variant="h2" style={styles.logoText}>
              MyApp
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.userIcon} 
          onPress={handleProfilePress}
        >
          <View style={styles.avatar}>
            <AntDesign name="user" size={20} color={colors.avatarBackground} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.safeAreaBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.headerBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.headerBorder,
  },
  leftSection: {
    flex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  logoText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  userIcon: {
    padding: 4,
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.avatarText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
