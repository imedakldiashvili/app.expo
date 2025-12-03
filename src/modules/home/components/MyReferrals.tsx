import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Card } from '../../../ui';
import { Text } from '../../../ui';
import { useTranslation } from '../../../i18n';
import { useAuth } from '../../../contexts';
import { getDelegates } from '../../../api';
import { MockUser } from '../../../api/mockData';
import { useNavigation } from '@react-navigation/native';

export default function MyReferrals() {
  const { t } = useTranslation() as any;
  const navigation = useNavigation();
  const { user } = useAuth();
  const [delegates, setDelegates] = useState<MockUser[]>([]);

  useEffect(() => {
    if (user?.id) {
      const filteredDelegates = getDelegates(user.id);
      setDelegates(filteredDelegates);
    }
  }, [user?.id]);

  if (delegates.length === 0) {
    return null;
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={() => {
        (navigation as any).navigate('Delegates');
      }}
    >
      <Card style={styles.delegatesCard}>
        <View style={styles.cardContent}>
          <View style={styles.leftContent}>
            <Text variant="h3" color="secondary" style={styles.label}>
              {t.navigation.delegates || 'ჩემი რეფერალები'}
            </Text>
            <View style={styles.delegatesImagesContainer}>
              {delegates
                .slice(0, 10)
                .map((delegate, index) => (
                  <Image
                    key={delegate.id}
                    source={{ uri: delegate.image || 'https://i.pravatar.cc/150?img=' + (index + 1) }}
                    style={[
                      styles.delegateImage,
                      index > 0 && styles.delegateImageOverlap,
                    ]}
                  />
                ))}
            </View>
          </View>
          <View style={styles.iconContainer}>
            <AntDesign name="right" size={16} color="#666666" />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  delegatesCard: {
    marginBottom: 0,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flex: 1,
    flexDirection: 'column',
  },
  label: {
    marginBottom: 4,
    fontWeight: '600',
    fontSize: 15,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  delegatesImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  delegateImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  delegateImageOverlap: {
    marginLeft: -8,
  },
});

