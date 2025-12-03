import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, Platform } from 'react-native';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { Text, Button, Spacer, FormField, Input } from '../../../ui';
import { ScreenView } from '../../common';
import { useTranslation } from '../../../i18n';
import { useNavigation } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import TypeDropdown from '../components/TypeDropdown';

type TeamType = 'party' | 'movement' | 'ngo';

interface CreateTeamFormData {
  name: string;
  description?: string;
  type: TeamType;
  logo?: string;
}

export default function CreateTeamScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState<TeamType>('party');
  const [logoUri, setLogoUri] = useState<string | null>(null);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateTeamFormData>({
    defaultValues: {
      name: '',
      description: '',
      type: 'party',
      logo: undefined,
    },
  });

  const teamTypes: { value: TeamType; label: string }[] = [
    { value: 'party', label: t.teams.typeParty },
    { value: 'movement', label: t.teams.typeMovement },
    { value: 'ngo', label: t.teams.typeNgo },
  ];

  const handleTypeSelect = (type: TeamType) => {
    setSelectedType(type);
    setValue('type', type);
  };

  const requestPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t.teams.permissionRequired,
          t.teams.photoPermissionMessage
        );
        return false;
      }
    }
    return true;
  };

  const handleImagePick = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setLogoUri(uri);
        setValue('logo', uri);
      }
    } catch (error) {
      Alert.alert(t.teams.imageError, String(error));
    }
  };

  const handleRemoveImage = () => {
    setLogoUri(null);
    setValue('logo', undefined);
  };

  const onSubmit = async (data: CreateTeamFormData) => {
    try {
      // TODO: Call API to create team
      console.log('Creating team:', data);
      
      // Show success message
      Alert.alert(
        t.teams.createSuccess,
        t.teams.teamCreatedSuccessfully,
        [
          {
            text: t.common.confirm,
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(t.teams.createError, String(error));
    }
  };

  const onError = (errors: any) => {
    console.log('Form errors:', errors);
  };

  return (
    <ScreenView scrollable={true}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="h2" align="center">{t.teams.createTeam}</Text>
        <Spacer size="lg" />

        <View style={styles.logoContainer}>
          {logoUri ? (
            <View style={styles.logoPreviewContainer}>
              <Image source={{ uri: logoUri }} style={styles.logoPreview} />
              <TouchableOpacity
                style={styles.removeLogoButton}
                onPress={handleRemoveImage}
              >
                <Text style={styles.removeLogoText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.logoUploadButton}
              onPress={handleImagePick}
              activeOpacity={0.7}
            >
              <Text variant="body" style={styles.logoUploadText}>
                {t.teams.logo}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Spacer size="md" />

        <Controller
          control={control}
          name="type"
          rules={{ required: t.teams.typeRequired }}
          render={({ field: { onChange, value } }) => (
            <TypeDropdown
              value={value}
              options={teamTypes}
              onSelect={(type) => {
                onChange(type);
                setSelectedType(type);
              }}
              label={t.teams.selectType}
              error={errors.type?.message}
            />
          )}
        />

        <Spacer size="md" />

        <FormField
          control={control}
          name="name"
          type="text"
          label={t.teams.teamName}
          placeholder={t.teams.enterTeamName}
          error={errors.name}
          rules={{
            required: t.teams.teamNameRequired,
            minLength: {
              value: 3,
              message: t.teams.teamNameMinLength,
            },
          }}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <Input
                label={t.teams.description}
                placeholder={t.teams.enterDescription}
                value={value || ''}
                onChangeText={onChange}
                multiline={true}
                numberOfLines={4}
                style={styles.multilineInput}
              />
            </View>
          )}
        />

        <Spacer size="md" />
        <Button
          title={t.teams.createTeam}
          onPress={handleSubmit(onSubmit, onError)}
          variant="primary"
        />
        <Spacer size="sm" />
        <Button
          title={t.common.cancel}
          onPress={() => navigation.goBack()}
          variant="outline"
        />
      </ScrollView>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 10,
  },
  multilineInput: {
    minHeight: 100,
  },
  logoContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  logoLabel: {
    marginBottom: 8,
    fontWeight: '500',
  },
  logoUploadButton: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  logoUploadText: {
    color: '#6B7280',
  },
  logoPreviewContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  logoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
  },
  removeLogoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  removeLogoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

