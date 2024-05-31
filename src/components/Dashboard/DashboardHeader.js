import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const Header = ({ onBack, onAccount, onToggle, showSection }) => (
  <View style={styles.container}>
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.headerButton} onPress={onBack}>
        <Text style={styles.headerButtonText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerButton} onPress={onAccount}>
      <Text style={styles.headerButtonText}>Account</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.switchContainer}>
      <TouchableOpacity
        style={[styles.switchButton, showSection === 'coins' && styles.activeSwitchButton]}
        onPress={() => onToggle('coins')}
      >
        <Text style={[styles.switchButtonText, showSection === 'coins' && styles.activeSwitchButtonText]}>Coins</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.switchButton, showSection === 'nfts' && styles.activeSwitchButton]}
        onPress={() => onToggle('nfts')}
      >
        <Text style={[styles.switchButtonText, showSection === 'nfts' && styles.activeSwitchButtonText]}>NFTs</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.switchButton, showSection === 'protocols' && styles.activeSwitchButton]}
        onPress={() => onToggle('protocols')}
      >
        <Text style={[styles.switchButtonText, showSection === 'protocols' && styles.activeSwitchButtonText]}>Protocols</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.switchButton, showSection === 'events' && styles.activeSwitchButton]}
        onPress={() => onToggle('events')}
      >
        <Text style={[styles.switchButtonText, showSection === 'events' && styles.activeSwitchButtonText]}>Events</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  activeSwitchButton: {
    backgroundColor: '#333',
  },
  switchButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeSwitchButtonText: {
    color: '#fff',
  },
});

export default Header;