import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { HomeScreen } from '../modules/home';
import { ActionListScreen } from '../modules/actions';
import { TeamsScreen } from '../modules/teams';
import { DelegatesScreen } from '../modules/delegates';
import { InvitationsScreen } from '../modules/invitations';
import BottomTabHeader from './BottomTabHeader';
import { colors } from '../constants';
import { useTranslation } from '../i18n';
import { useAuth, useSelection } from '../contexts';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { t } = useTranslation();
  

  return (
    <Tab.Navigator
      screenOptions={{
        header: (props) => <BottomTabHeader {...props} />,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: colors.tabBarBorder,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: t.navigation.home,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size || 24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Teams" 
        component={TeamsScreen}
        options={{
          tabBarLabel: t.navigation.teams,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="team" size={size || 24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Invitations" 
        component={InvitationsScreen}
        options={{
          tabBarLabel: t.navigation.invitations || 'მოწვევები',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="notification" size={size || 24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Delegates" 
        component={DelegatesScreen}
        options={{
          tabBarLabel: t.navigation.delegates,
          tabBarIcon: ({ color, size }) => (
            <AntDesign 
              name="appstore" 
              size={size || 24} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Action" 
        component={ActionListScreen}
        options={{
          tabBarLabel: t.navigation.actions,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="bars" size={size || 24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

