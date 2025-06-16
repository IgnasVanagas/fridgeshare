import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import mainStyle from '@/styles/styles';
import colors from '@/constants/colors';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tutorial = () => {
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <SafeAreaView style={mainStyle.container3}>
                <StatusBar style="dark" hidden={false} />
                <View style={{ padding: 10 }}>
                    {/* Bendruomenės */}
                    <View style={{ marginBottom: 30 }}>
                        <View style={[mainStyle.inline, { marginBottom: 10, alignItems: 'center', flexDirection: 'row', width: 200, justifyContent: 'flex-start' }]}>
                            <FontAwesome name="group" size={20} color={colors.brandGreen} />
                            <Text style={mainStyle.styledH2}>Bendruomenės</Text>
                        </View>
                        <Text style={{ fontSize: 16, lineHeight: 24, color: colors.darkerGrey, marginBottom: 15 }}>
                            Bendruomenių valdymas:
                        </Text>
                        <View style={{ paddingLeft: 20 }}>
                            <Text style={{ fontSize: 16, lineHeight: 24, color: colors.darkerGrey, marginBottom: 10 }}>
                                • Sukurti bendruomenę: pasirinkite "Bendruomenės" → "Sukurti" ir užpildykite reikalingą informaciją
                            </Text>
                            <Text style={{ fontSize: 16, lineHeight: 24, color: colors.darkerGrey, marginBottom: 10 }}>
                                • Prisijungti prie bendruomenės: pasirinkite "Bendruomenės" → "Prisijungti" ir įveskite bendruomenės kodą. Tada jus turės patvirtinti tos bendruomenės administratorius
                            </Text>
                            <Text style={{ fontSize: 16, lineHeight: 24, color: colors.darkerGrey }}>
                                • Peržiūrėti savo bendruomenes: pasirinkite "Bendruomenės" ir pamatysite visų jūsų bendruomenių sąrašą
                            </Text>
                        </View>
                    </View>

                    {/* Produktai */}
                    <View style={{ marginBottom: 30 }}>
                        <View style={[mainStyle.inline, { marginBottom: 10, alignItems: 'center', flexDirection: 'row', width: 200, justifyContent: 'flex-start' }]}>
                            <FontAwesome5 name="shopping-basket" size={20} color={colors.brandGreen} />
                            <Text style={mainStyle.styledH2}>Produktai</Text>
                        </View>
                        <Text style={{ fontSize: 16, lineHeight: 24, color: colors.darkerGrey, marginBottom: 15 }}>
                            Produktų valdymas:
                        </Text>
                        <View style={{ paddingLeft: 20 }}>
                            <Text style={{ fontSize: 16, lineHeight: 24, color: colors.darkerGrey, marginBottom: 10 }}>
                                • Pridėti produktą: pasirinkite "Pridėti produktą" ir užpildykite produktų informaciją bei kuriai visuomenę jis priskiriamas
                            </Text>
                            <Text style={{ fontSize: 16, lineHeight: 24, color: colors.darkerGrey, marginBottom: 10 }}>
                                • Peržiūrėti produktus: pagrindiniame ekrane matote visus produktus
                            </Text>
                        </View>
                    </View>

                    {/* Naujienos */}
                    <View style={{ marginBottom: 30 }}>
                        <View style={[mainStyle.inline, { marginBottom: 10, alignItems: 'center', flexDirection: 'row', width: 200, justifyContent: 'flex-start' }]}>
                            <FontAwesome5 name="newspaper" size={20} color={colors.brandGreen} />
                            <Text style={mainStyle.styledH2}>Naujienos</Text>
                        </View>
                        <Text style={{ fontSize: 16, lineHeight: 24, color: colors.darkerGrey, marginBottom: 15 }}>
                            Naujienų skiltis:
                        </Text>
                        <View style={{ paddingLeft: 20 }}>
                            <Text style={{ fontSize: 16, lineHeight: 24, color: colors.darkerGrey, marginBottom: 10 }}>
                                • Peržiūrėti naujienas: pasirinkite "Naujienos" ir pamatysite visas naujienas
                            </Text>
                        </View>
                    </View>

                    {/* Nustatymai */}
                    <View style={{ marginBottom: 30 }}>
                        <View style={[mainStyle.inline, { marginBottom: 10, alignItems: 'center', flexDirection: 'row', width: 200, justifyContent: 'flex-start' }]}>
                            <Ionicons name="settings-sharp" size={20} color={colors.brandGreen} />
                            <Text style={mainStyle.styledH2}>Nustatymai</Text>
                        </View>
                        <Text style={{ fontSize: 16, lineHeight: 24, color: colors.darkerGrey, marginBottom: 15 }}>
                            Asmeniniai nustatymai:
                        </Text>
                        <View style={{ paddingLeft: 20 }}>
                            <Text style={{ fontSize: 16, lineHeight: 24, color: colors.darkerGrey, marginBottom: 10 }}>
                                • Pakeisti vartotojo vardą: "Nustatymai" → "Pakeisti vartotojo vardą"
                            </Text>
                            <Text style={{ fontSize: 16, lineHeight: 24, color: colors.darkerGrey, marginBottom: 10 }}>
                                • Pakeisti slaptažodį: "Nustatymai" → "Pakeisti slaptažodį"
                            </Text>
                            <Text style={{ fontSize: 16, lineHeight: 24, color: colors.darkerGrey }}>
                                • Atsijungti: pasirinkite "Atsijungti" apatiniame meniu
                            </Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default Tutorial; 