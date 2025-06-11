import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, StyleSheet, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';
import MovieItem from '../components/MovieItem';
import { Ionicons } from '@expo/vector-icons';

const API_KEY = '1014e10e'; // OMDb API key

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [query]);

  const fetchMovies = async (nextPage = 1) => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${nextPage}`);
      if (res.data.Response === 'True') {
        setMovies(prev => nextPage === 1 ? res.data.Search : [...prev, ...res.data.Search]);
        setHasMore(res.data.Search.length === 10);
      } else {
        setMovies([]);
        setHasMore(false);
      }
    } catch (e) {
      setMovies([]);
      setHasMore(false);
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage);
    }
  };

  useEffect(() => {
    if (query) fetchMovies(page);
  }, [page, query]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Movie Search</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
          <Ionicons name="heart" size={28} color="#f2e9e4" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Search movies..."
        placeholderTextColor="#c9ada7"
        value={query}
        onChangeText={text => {
          setQuery(text);
          setPage(1);
        }}
        onSubmitEditing={() => fetchMovies(1)}
      />
      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#9a8c98" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={item => item.imdbID}
          renderItem={({ item }) => (
            <MovieItem
              movie={item}
              onPress={() => navigation.navigate('Details', { imdbID: item.imdbID })}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            query && !loading ? <Text style={styles.noResults}>No movies found.</Text> : null
          }
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#22223b', paddingHorizontal: 16, paddingTop: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { color: '#f2e9e4', fontSize: 28, fontWeight: 'bold', letterSpacing: 1 },
  input: {
    backgroundColor: '#4a4e69',
    color: '#f2e9e4',
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    marginBottom: 10,
  },
  noResults: { color: '#c9ada7', textAlign: 'center', marginTop: 30, fontSize: 18 },
});
