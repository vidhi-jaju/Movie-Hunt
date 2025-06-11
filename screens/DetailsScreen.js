import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const API_KEY = '1014e10e'; // OMDb API key

export default function DetailsScreen({ route }) {
  const { imdbID } = route.params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchMovie();
    checkFavorite();
  }, []);

  const fetchMovie = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`);
      setMovie(res.data);
    } catch (e) {
      Alert.alert('Error', 'Failed to load movie details.');
    }
    setLoading(false);
  };

  const checkFavorite = async () => {
    const favs = await AsyncStorage.getItem('favorites');
    if (favs) {
      setIsFavorite(JSON.parse(favs).some(m => m.imdbID === imdbID));
    }
  };

  const toggleFavorite = async () => {
    let favs = await AsyncStorage.getItem('favorites');
    favs = favs ? JSON.parse(favs) : [];
    if (isFavorite) {
      favs = favs.filter(m => m.imdbID !== imdbID);
      setIsFavorite(false);
    } else {
      favs.push({ imdbID, Title: movie.Title, Poster: movie.Poster, Year: movie.Year, Type: movie.Type });
      setIsFavorite(true);
    }
    await AsyncStorage.setItem('favorites', JSON.stringify(favs));
  };

  if (loading || !movie) {
    return <ActivityIndicator size="large" color="#9a8c98" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image' }}
        style={styles.poster}
      />
      <View style={styles.headerRow}>
        <Text style={styles.title}>{movie.Title}</Text>
        <TouchableOpacity onPress={toggleFavorite}>
          <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={32} color="#f2e9e4" />
        </TouchableOpacity>
      </View>
      <Text style={styles.info}>{movie.Year} • {movie.Genre}</Text>
      <Text style={styles.rating}>⭐ {movie.imdbRating} / 10</Text>
      <Text style={styles.plot}>{movie.Plot}</Text>
      <Text style={styles.section}>Director: <Text style={styles.value}>{movie.Director}</Text></Text>
      <Text style={styles.section}>Actors: <Text style={styles.value}>{movie.Actors}</Text></Text>
      <Text style={styles.section}>Runtime: <Text style={styles.value}>{movie.Runtime}</Text></Text>
      <Text style={styles.section}>Language: <Text style={styles.value}>{movie.Language}</Text></Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#22223b', padding: 16 },
  poster: { width: '100%', height: 400, borderRadius: 12, marginBottom: 16, backgroundColor: '#c9ada7' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#f2e9e4', fontSize: 28, fontWeight: 'bold', flex: 1, flexWrap: 'wrap' },
  info: { color: '#c9ada7', fontSize: 16, marginVertical: 6 },
  rating: { color: '#f2e9e4', fontSize: 18, marginBottom: 10 },
  plot: { color: '#f2e9e4', fontSize: 16, marginBottom: 16 },
  section: { color: '#9a8c98', fontSize: 15, marginTop: 6 },
  value: { color: '#f2e9e4', fontWeight: 'bold' },
});
