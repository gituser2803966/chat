import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CallScreen from './CallScreen';
import ContactScreen from './ContactScreen';
import ConversationScreen from './ConversationScreen';
import {ContactsProvider} from '../contexts/ContactsProvider';
const Tab = createBottomTabNavigator();

export default function MainTab() {
  return (
    <ContactsProvider>
      <Tab.Navigator
        initialRouteName="conversations"
        tabBarOptions={{
          activeTintColor: '#1DA1F2',
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen
          name="conversations"
          component={ConversationScreen}
          options={{
            tabBarLabel: 'conversations',
            // tabBarBadge:3,
          }}
        />
        <Tab.Screen
          name="contacts"
          component={ContactScreen}
          options={{
            tabBarLabel: 'contacts',
            // tabBarBadge:3,
          }}
        />
        <Tab.Screen
          name="calls"
          component={CallScreen}
          options={{
            tabBarLabel: 'calls',
          }}
        />
      </Tab.Navigator>
    </ContactsProvider>
  );
}
