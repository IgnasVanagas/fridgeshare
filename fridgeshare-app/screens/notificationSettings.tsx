import { View, Text, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import mainStyle from '@/styles/styles';
import colors from '@/constants/colors';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';

const NotificationSettings = () => {
  const [toggles, setToggles] = useState({
    receiveNotifications: true,
    sound: false,
    vibrate: true,
    showOnScreen: true,
    doNotDisturb: false,
  });

  const toggleSwitch = (key: keyof typeof toggles) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaView style={mainStyle.container3}>
        <StatusBar style="dark" hidden={false} />
        <Text style={mainStyle.styledH1}>Pranešimų nustatymai</Text>

        <View style={{ width: '90%' }}>
          {[
            {
              key: 'receiveNotifications',
              label: 'Gauti pranešimus',
              icon: <FontAwesome5 name="bell" size={22} color={colors.brandGreen} />,
            },
            {
              key: 'sound',
              label: 'Garsinis signalas',
              icon: <MaterialCommunityIcons name="volume-high" size={22} color={colors.brandGreen} />,
            },
            {
              key: 'vibrate',
              label: 'Vibruoti',
              icon: <MaterialCommunityIcons name="vibrate" size={22} color={colors.brandGreen} />,
            },
            {
              key: 'showOnScreen',
              label: 'Rodyti pranešimus ekrane',
              icon: <FontAwesome5 name="eye" size={20} color={colors.brandGreen} />,
            },
            {
              key: 'doNotDisturb',
              label: 'Tylos režimas',
              icon: <MaterialCommunityIcons name="do-not-disturb" size={22} color={colors.brandGreen} />,
            },
          ].map(({ key, label, icon }) => (
            <View key={key} style={mainStyle.settingRow}>
              <View style={mainStyle.inlineWithIcon}>
                {icon}
                <Text style={mainStyle.settingLabel}>{label}</Text>
              </View>
              <Switch
                value={toggles[key as keyof typeof toggles]}
                onValueChange={() => toggleSwitch(key as keyof typeof toggles)}
                trackColor={{ true: colors.brandGreen }}
              />
            </View>
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default NotificationSettings;
