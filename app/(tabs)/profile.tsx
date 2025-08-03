import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563EB',
  },
});
