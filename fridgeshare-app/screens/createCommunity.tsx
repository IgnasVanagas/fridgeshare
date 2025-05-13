import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from '@/api_config';
import mainStyle from '@/styles/styles';
import buttonStyle from '@/styles/buttons';
import colors from '@/constants/colors';
import { useAuth } from '@/context/authContext';

const CreateCommunity = () => {
  const navigation = useNavigation();
  const { id } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateCommunity = async () => {
    if (!title || !description) {
      Alert.alert('Klaida', 'Prašome užpildyti visus laukus.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/community`, {
        title,
        description,
        managerId: id,
      });

      if (response.status === 201) {
        Alert.alert('Sukurta', 'Bendruomenė sukurta sėkmingai!');
        navigation.goBack(); // or navigate to CommunityView
      }
    } catch (error: any) {
      Alert.alert('Klaida', error.response?.data?.title ?? 'Nepavyko sukurti bendruomenės.');
    }
  };

  return (
    <View style={mainStyle.container3}>
      <Text style={mainStyle.styledH1}>Sukurti naują bendruomenę</Text>

      <TextInput
        placeholder="Pavadinimas"
        style={mainStyle.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Aprašymas"
        style={[mainStyle.input, { height: 100 }]}
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={buttonStyle.submitColorfulButton}
        onPress={handleCreateCommunity}
      >
        <Text style={buttonStyle.submitColorfulButtonText}>Sukurti</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateCommunity;
