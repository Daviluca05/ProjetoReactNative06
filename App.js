import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

export default function App() {
  const [data, setData] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    // Obter dados da API
    axios.get('http://192.168.1.5:5000/data') // Atualize para o IP da sua máquina
      .then(response => {
        console.log("Dados da API:", response.data);
        setData(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar dados da API", error);
      });

    // Obter localização
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar a localização foi negada');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Localização</Text>
      <Text style={styles.location}>
        {errorMsg ? errorMsg : location ? JSON.stringify(location.coords) : 'Carregando...'}
      </Text>

      <Text style={styles.title}>Dados da API:</Text>
      <FlatList
        data={data}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />

      <Button
        title="Recarregar Dados"
        onPress={() => {
          axios.get('http://192.168.1.5:5000/data')
            .then(response => {
              setData(response.data);
            })
            .catch(error => {
              console.error("Erro ao buscar dados da API", error);
            });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  location: {
    fontSize: 16,
    marginBottom: 20,
  },
  item: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
  },
  itemTitle: {
    fontWeight: 'bold',
  },
});
