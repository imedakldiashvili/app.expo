import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth, usePasscode } from '../contexts';
import { WelcomeScreen, LoginScreen, RegisterEmailMobileScreen, RegisterEmailConfirmationScreen, RegisterMobileConfirmationScreen, RegisterPasswordScreen, PasscodeNewScreen, PasscodeConfirmScreen, PassCodeLoginScreen, OtpValidationScreen } from '../modules/auth';
import { ProfileScreen, SelectLocationScreen } from '../modules/profile';
import { VerificationScreen } from '../modules/verification';
import { TeamsScreen, CreateTeamScreen, TeamDetailsScreen, TeamDetailsNewScreen, TeamSelectionScreen, TeamMemberDetailScreen } from '../modules/teams';
import { VotingBallotItemPreviewScreen, VotingBallotItemScreen, VotingBallotScreen, VotingCardScreen } from '../modules/voting';
import { InvitationsScreen, InvitationAddScreen } from '../modules/invitations';
import BottomTabNavigator from './BottomTabNavigator';
import { LoadingSpinner } from '../ui';
import { useTranslation } from '../i18n';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { isLoading: passcodeLoading, isPasscodeSet } = usePasscode();
  const { t } = useTranslation();

  const isLoading = authLoading || passcodeLoading;

  // Debug logs
  console.log('🔍 AppNavigator State:', {
    isAuthenticated,
    isPasscodeSet,
    authLoading,
    passcodeLoading
  });

  if (isLoading) {
    return <LoadingSpinner text={t.common.loading} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {isAuthenticated ? (
            // Authenticated screens
            <>
              {user && !user.isVerified && !user.skipVerified && (
                // User is authenticated but not verified and not skipped - show VerificationScreen first (priority over passcode)
                <Stack.Screen 
                  name="Verification" 
                  component={VerificationScreen}
                  options={{
                    headerShown: false,
                    gestureEnabled: false,
                  }}
                />
              )}
              {user && (user.isVerified || user.skipVerified) && isPasscodeSet && (
                // User is verified and passcode is set - show main app
                <>
                  <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
                  <Stack.Screen 
                    name="Verification" 
                    component={VerificationScreen}
                    options={{
                      headerShown: false,
                      gestureEnabled: false,
                    }}
                  />
                  <Stack.Screen 
                    name="Profile" 
                    component={ProfileScreen}
                    options={{
                      headerShown: true,
                      title: t.navigation.profile,
                      headerBackTitle: t.common.back,
                      headerStyle: {
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E2E8F0',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                      },
                      headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#1F2937',
                      },
                    }}
                  />
                  <Stack.Screen 
                    name="SelectLocation" 
                    component={SelectLocationScreen}
                    options={{
                      headerShown: true,
                      title: 'ლოკაციის ცვლილება',
                      headerBackTitle: t.common.back,
                      headerStyle: {
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E2E8F0',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                      },
                      headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#1F2937',
                      },
                    }}
                  />
                  <Stack.Screen 
                    name="Teams" 
                    component={TeamsScreen}
                    options={{
                      headerShown: true,
                      title: t.teams.title,
                      headerBackTitle: t.common.back,
                      headerStyle: {
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E2E8F0',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                      },
                      headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#1F2937',
                      },
                    }}
                  />
                  <Stack.Screen 
                    name="CreateTeam" 
                    component={CreateTeamScreen}
                    options={{
                      headerShown: true,
                      title: t.teams.createTeam,
                      headerBackTitle: t.common.back,
                      headerStyle: {
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E2E8F0',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                      },
                      headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#1F2937',
                      },
                    }}
                  />
                  <Stack.Screen 
                    name="TeamDetails" 
                    component={TeamDetailsScreen}
                    options={{
                      headerShown: true,
                      title: 'გუნდი',
                      headerBackTitle: t.common.back,
                      headerStyle: {
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E2E8F0',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                      },
                      headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#1F2937',
                      },
                    }}
                  />
                  <Stack.Screen 
                    name="TeamDetailsNew" 
                    component={TeamDetailsNewScreen}
                    options={{
                      headerShown: true,
                      title: 'გუნდი',
                      headerBackTitle: t.common.back,
                      headerStyle: {
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E2E8F0',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                      },
                      headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#1F2937',
                      },
                    }}
                  />
                  <Stack.Screen 
                    name="TeamSelection" 
                    component={TeamSelectionScreen}
                    options={{
                      headerShown: true,
                      title: 'გუნდის ცვლილება',
                      headerBackTitle: t.common.back,
                      headerStyle: {
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E2E8F0',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                      },
                      headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#1F2937',
                      },
                    }}
                  />
                  <Stack.Screen 
                    name="TeamMemberDetail" 
                    component={TeamMemberDetailScreen}
                    options={({ route }) => {
                      const member = (route.params as any)?.member;
                      return {
                        headerShown: true,
                        title: 'წევრი',
                        headerBackTitle: t.common.back,
                        headerStyle: {
                          backgroundColor: '#FFFFFF',
                          borderBottomWidth: 1,
                          borderBottomColor: '#E2E8F0',
                          elevation: 2,
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 1,
                          },
                          shadowOpacity: 0.1,
                          shadowRadius: 2,
                        },
                        headerTitleStyle: {
                          fontSize: 18,
                          fontWeight: '600',
                          color: '#1F2937',
                        },
                      };
                    }}
                  />
                  <Stack.Screen 
                    name="ElectionMain" 
                    component={VotingCardScreen}
                    options={{
                      headerShown: true,
                      title: 'ჩემი არჩევანი',
                      headerBackTitle: t.common.back,
                      headerStyle: {
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E2E8F0',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                      },
                      headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#1F2937',
                      },
                    }}
                  />
                  <Stack.Screen 
                    name="VotingBallot" 
                    component={VotingBallotScreen}
                    options={{
                      headerShown: true,
                      title: 'დააფიქრე არჩევანი',
                      headerBackTitle: t.common.back,
                      headerStyle: {
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E2E8F0',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                      },
                      headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#1F2937',
                      },
                    }}
                  />
                  <Stack.Screen 
                    name="VotingBallotItem" 
                    component={VotingBallotItemScreen}
                    options={{
                      headerShown: true,
                      title: t.navigation.myChoice,
                      headerBackTitle: t.common.back,
                      headerStyle: {
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E2E8F0',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                      },
                      headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#1F2937',
                      },
                    }}
                  />
                  <Stack.Screen 
                    name="VotingBallotItemPreview" 
                    component={VotingBallotItemPreviewScreen}
                    options={{
                      headerShown: true,
                      title: 'არჩევანის დადასტურება',
                      headerBackTitle: t.common.back,
                      headerStyle: {
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E2E8F0',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                      },
                      headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#1F2937',
                      },
                    }}
                  />
                  <Stack.Screen 
                    name="Invitations" 
                    component={InvitationsScreen}
                    options={{
                      headerShown: true,
                      title: t.invitations?.title || 'მოწვევები',
                      headerBackTitle: t.common.back,
                      headerStyle: {
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E2E8F0',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                      },
                      headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#1F2937',
                      },
                    }}
                  />
                  <Stack.Screen 
                    name="InvitationAdd" 
                    component={InvitationAddScreen}
                    options={{
                      headerShown: true,
                      title: t.invitations?.sendInvitation || 'მოწვევის გაგზავნა',
                      headerBackTitle: t.common.back,
                      headerStyle: {
                        backgroundColor: '#FFFFFF',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E2E8F0',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                      },
                      headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '600',
                        color: '#1F2937',
                      },
                    }}
                  />
                </>
              )}
              {user && (user.isVerified || user.skipVerified) && !isPasscodeSet && (
                // User is verified or skipped verification but passcode not set - show passcode setup
                <>
                  <Stack.Screen name="PasscodeNew" component={PasscodeNewScreen} />
                  <Stack.Screen name="PasscodeConfirm" component={PasscodeConfirmScreen} />
                </>
              )}
            </>
          ) : (
            // Not authenticated
            <>
              {isPasscodeSet ? (
                // Not authenticated but has passcode - show PassCodeLoginScreen
                <Stack.Screen name="PassCodeLogin" component={PassCodeLoginScreen} />
              ) : (
                // Not authenticated and no passcode - show auth screens
                <>
                  <Stack.Screen name="Welcome" component={WelcomeScreen} />
                  <Stack.Screen name="RegisterEmailConfirmation" component={RegisterEmailConfirmationScreen} />
                  <Stack.Screen name="RegisterMobileConfirmation" component={RegisterMobileConfirmationScreen} />
                  <Stack.Screen name="RegisterEmailMobile" component={RegisterEmailMobileScreen} />
                  <Stack.Screen name="RegisterPassword" component={RegisterPasswordScreen} />
                  <Stack.Screen name="OtpValidation" component={OtpValidationScreen} />
                  <Stack.Screen name="Login" component={LoginScreen} />
                </>
              )}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
