import { View, Text, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import mainStyle from '@/styles/styles';
import colors from '@/constants/colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';

const PrivacySettings = () => {
  const [toggles, setToggles] = useState({
    publicProfile: true,
    messagesFromAll: false,
    useLocation: true,
    sharingPermissions: false,
    activityStatus: true,
  });

  const toggleSwitch = (key: keyof typeof toggles) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaView style={mainStyle.container3}>
        <StatusBar style="dark" hidden={false} />
        <Text style={mainStyle.styledH1}>Privatumas</Text>

        <View style={{ width: '90%' }}>
          {[
            {
              key: 'publicProfile',
              label: 'Rodyti mano paskyrą viešai',
              icon: <FontAwesome name="lock" size={22} color={colors.brandGreen} />,
            },
            {
              key: 'messagesFromAll',
              label: 'Leisti žinutes iš visų',
              icon: <FontAwesome5 name="envelope-open-text" size={22} color={colors.brandGreen} />,
            },
            {
              key: 'useLocation',
              label: 'Naudoti vietos informaciją',
              icon: <MaterialCommunityIcons name="map-marker" size={22} color={colors.brandGreen} />,
            },
            {
              key: 'sharingPermissions',
              label: 'Bendrinimo leidimai',
              icon: <MaterialCommunityIcons name="share-variant" size={22} color={colors.brandGreen} />,
            },
            {
              key: 'activityStatus',
              label: 'Veiklos būsena',
              icon: <FontAwesome5 name="user-check" size={22} color={colors.brandGreen} />,
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

export default PrivacySettings;
