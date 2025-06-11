import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function MovieItem({ movie, onPress }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Image
        source={{ uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/80x120?text=No+Image' }}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{movie.Title}</Text>
        <Text style={styles.year}>{movie.Year}</Text>
        <Text style={styles.type}>{movie.Type.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: '#4a4e69',
    borderRadius: 10,
    marginVertical: 6,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
  },
  poster: { width: 60, height: 90, borderRadius: 6, backgroundColor: '#c9ada7' },
  info: { marginLeft: 14, flex: 1 },
  title: { color: '#f2e9e4', fontSize: 18, fontWeight: 'bold' },
  year: { color: '#c9ada7', fontSize: 14, marginTop: 2 },
  type: { color: '#9a8c98', fontSize: 12, marginTop: 2 },
});
