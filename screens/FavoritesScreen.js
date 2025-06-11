import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MovieItem from '../components/MovieItem';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    const favs = await AsyncStorage.getItem('favorites');
    setFavorites(favs ? JSON.parse(favs) : []);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={item => item.imdbID}
        renderItem={({ item }) => (
          <MovieItem
            movie={item}
            onPress={() => navigation.navigate('Details', { imdbID: item.imdbID })}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No favorites yet.</Text>}
        contentContainerStyle={{ flexGrow: 1 }}
      />
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#22223b', padding: 16 },
  title: { color: '#f2e9e4', fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  empty: { color: '#c9ada7', textAlign: 'center', marginTop: 30, fontSize: 18 },
  backBtn: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#4a4e69',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backText: { color: '#f2e9e4', fontSize: 18 },
});
