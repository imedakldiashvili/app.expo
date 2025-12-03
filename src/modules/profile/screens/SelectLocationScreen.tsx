import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ViewStyle, Alert } from 'react-native';
import { Text, Spacer, Button } from '../../../ui';
import { ScreenView, PasscodeApproveModal } from '../../common';
import { useTranslation } from '../../../i18n';
import { useSelection } from '../../../contexts';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card } from '../../../ui';
import { mockLocations } from '../../../api';
import { usePasscode } from '../../../contexts';

export default function SelectLocationScreen() {
  const { t } = useTranslation();
  const { location, setLocation } = useSelection();
  const { validatePasscode } = usePasscode();
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(location);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [isValidatingPasscode, setIsValidatingPasscode] = useState(false);
  
  const routeParams = (route.params as any) || {};
  const returnTo = routeParams.returnTo;
  const returnParams = routeParams.returnParams || {};

  useEffect(() => {
    setSelectedLocation(location);
  }, [location]);

  // Check if location has changed
  const hasLocationChanged = selectedLocation !== location;

  const handleLocationPress = (locationName: string) => {
    if (selectedLocation === locationName) {
      setSelectedLocation(null);
    } else {
      setSelectedLocation(locationName);
    }
  };

  const handleSave = () => {
    // If location has changed, show passcode modal
    if (hasLocationChanged && selectedLocation) {
      setShowPasscodeModal(true);
    } else {
      // If location hasn't changed, just save and navigate
      setLocation(selectedLocation);
      if (returnTo && selectedLocation) {
        (navigation as any).navigate(returnTo, returnParams);
      } else {
        navigation.goBack();
      }
    }
  };

  const handlePasscodeComplete = async (passcode: (string | number)[]) => {
    setIsValidatingPasscode(true);
    try {
      const passcodeString = passcode.join('');
      const isValid = await validatePasscode(passcodeString);
      
      setIsValidatingPasscode(false);
      
      if (isValid) {
        // Save location after passcode validation
        setLocation(selectedLocation);
        setShowPasscodeModal(false);
        
        // Navigate based on returnTo or go back
        if (returnTo && selectedLocation) {
          (navigation as any).navigate(returnTo, returnParams);
        } else {
          navigation.goBack();
        }
      } else {
        Alert.alert(
          t.auth?.passcodeError || 'შეცდომა',
          t.auth?.passcodeIncorrect || 'არასწორი პასკოდი'
        );
      }
    } catch (error) {
      setIsValidatingPasscode(false);
      Alert.alert(
        t.common?.error || 'შეცდომა',
        t.voting?.saveError || 'შენახვა ვერ მოხერხდა'
      );
    }
  };

  const renderLocation = ({ item }: { item: { id: number; name: string } }) => {
    const isSelected = selectedLocation === item.name;
    const cardStyle: ViewStyle[] = [styles.locationCard];
    if (isSelected) {
      cardStyle.push(styles.selectedCard);
    }
    return (
      <TouchableOpacity onPress={() => handleLocationPress(item.name)} activeOpacity={0.7}>
        <Card style={cardStyle}>
          <Text variant="body" style={isSelected ? styles.selectedText : undefined}>
            {item.name}
          </Text>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenView scrollable={false}>
      <Text variant="h2" style={styles.title}>{t.myPoliticians.selectLocation}</Text>
      <Spacer size="lg" />
      
      <View style={styles.listContainer}>
        <FlatList
          data={mockLocations}
          renderItem={renderLocation}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <Spacer size="lg" />
      <View style={styles.buttonContainer}>
        <Button
          title={t.common.save}
          onPress={handleSave}
          disabled={!selectedLocation || !hasLocationChanged}
        />
      </View>

      <PasscodeApproveModal
        visible={showPasscodeModal}
        onRequestClose={() => setShowPasscodeModal(false)}
        onPasscodeComplete={handlePasscodeComplete}
        disabled={isValidatingPasscode}
        title={t.voting?.confirmChanges || 'პასკოდით დასტური'}
      />
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 20,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  locationCard: {
    marginBottom: 12,
    padding: 16,
  },
  selectedCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
    backgroundColor: '#F0F8FF',
  },
  selectedText: {
    fontWeight: '600',
    color: '#007AFF',
  },
  buttonContainer: {
    paddingBottom: 20, // Space from bottom (for tabs navigator)
  },
});

