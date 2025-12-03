import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Switch } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { ScreenView } from '../../common';
import { Text, Spacer, Card, Button } from '../../../ui';
import { useTranslation } from '../../../i18n';
import { useAuth } from '../../../contexts';
import { getDelegates } from '../../../api';
import { MockUser } from '../../../api/mockData';

const REFERAL_NUMBER = 5;

export default function DelegatesScreen() {
  const { t } = useTranslation() as any;
  const { user } = useAuth();
  const [delegates, setDelegates] = useState<MockUser[]>([]);
  const [isDelegate, setIsDelegate] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const filteredDelegates = getDelegates(user.id);
      setDelegates(filteredDelegates);
    }
  }, [user?.id]);

  return (
    <ScreenView scrollable={false}>
      <Text variant="h2" align="center">
        {t.delegates?.title || 'Delegates'}
      </Text>
      <Spacer size="md" />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.switchCard}>
          <View style={styles.switchCardContent}>
            <View style={styles.switchLeftContent}>
              {delegates.length < REFERAL_NUMBER ? (
                <>
                  <Text variant="body" style={styles.switchLabel}>
                    {t.delegates?.delegate || 'დელეგატი'}
                  </Text>
                  <Text variant="body" color="secondary" style={styles.referalsCount}>
                    {t.delegates?.addReferals || 'დაიმატე რეფერალები'}
                  </Text>
                </>
              ) : (
                <Text variant="body" style={styles.switchLabel}>
                  {t.delegates?.delegate}
                </Text>
              )}
            </View>
            <View style={styles.switchRightContent}>
              {delegates.length < REFERAL_NUMBER ? (
                <Text variant="body" color="secondary" style={styles.countText}>
                  {delegates.length}/{REFERAL_NUMBER}
                </Text>
              ) : (
                <Switch
                  value={isDelegate}
                  onValueChange={setIsDelegate}
                  trackColor={{ false: '#E2E8F0', true: '#16A34A' }}
                  thumbColor={isDelegate ? '#FFFFFF' : '#FFFFFF'}
                />
              )}
            </View>
          </View>
        </Card>
        <Spacer size="sm" />
        {delegates.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text variant="body" color="secondary" align="center">
              {t.delegates?.empty || 'დელეგატები არ მოიძებნა'}
            </Text>
          </View>
        ) : (
          <TouchableOpacity activeOpacity={0.7} onPress={() => {
            // TODO: Navigate to delegates detail screen
            console.log('Delegates card pressed');
          }}>
            <Card style={styles.delegatesCard}>
              <View style={styles.cardContent}>
                <View style={styles.leftContent}>
                  <Text variant="body" style={styles.label}>
                    {t.navigation.delegates || 'ჩემი რეფერალები'}
                  </Text>
                  <View style={styles.delegatesImagesContainer}>
                    {delegates
                      .slice(0, 100)
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
        )}
        <Spacer size="sm" />
        <TouchableOpacity activeOpacity={0.7} onPress={() => {
          // TODO: Navigate to party rating detail screen
          console.log('Party rating pressed');
        }}>
          <Card style={styles.delegatesCard}>
            <View style={styles.cardContent}>
              <View style={styles.leftContent}>
                <Text variant="body" style={styles.label}>
                  {t.delegates?.partyRating || 'ჩემი პარტის რეიტინგი'}
                </Text>
                <View style={styles.delegatesImagesContainer}>
                  {delegates
                    .slice(0, 100)
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
        <Spacer size="sm" />
        <TouchableOpacity activeOpacity={0.7} onPress={() => {
          // TODO: Navigate to overall rating detail screen
          console.log('Overall rating pressed');
        }}>
          <Card style={styles.delegatesCard}>
            <View style={styles.cardContent}>
              <View style={styles.leftContent}>
                <Text variant="body" style={styles.label}>
                  {t.delegates?.overallRating || 'ჩემი საერთო რეიტინგი'}
                </Text>
                <View style={styles.delegatesImagesContainer}>
                  {delegates
                    .slice(0, 100)
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
        <Spacer size="sm" />
        <TouchableOpacity activeOpacity={0.7} onPress={() => {
          // TODO: Navigate to local rating detail screen
          console.log('Local rating pressed');
        }}>
          <Card style={styles.delegatesCard}>
            <View style={styles.cardContent}>
              <View style={styles.leftContent}>
                <Text variant="body" style={styles.label}>
                  {t.delegates?.localRating || 'ჩემი ადგილობრივი რეიტინგი'}
                </Text>
                <View style={styles.delegatesImagesContainer}>
                  {delegates
                    .slice(0, 100)
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
        <Spacer size="lg" />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          title={t.delegates?.sendInvitation || 'მოწვევის გაგზავნა'}
          onPress={() => {
            // TODO: Handle send invitation
            console.log('Send invitation pressed');
          }}
          variant="primary"
          size="large"
          style={styles.sendButton}
        />
      </View>
    </ScreenView>
  );
}


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  switchCard: {
    marginBottom: 12,
  },
  switchCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLeftContent: {
    flex: 1,
    flexDirection: 'column',
  },
  switchLabel: {
    marginBottom: 4,
  },
  referalsCount: {
    marginTop: 4,
  },
  switchRightContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  countText: {
    fontSize: 16,
  },
  delegatesCard: {
    marginBottom: 8,
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
    marginBottom: 8,
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
    marginLeft: -12,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
  },
  sendButton: {
    width: '100%',
  },
});

