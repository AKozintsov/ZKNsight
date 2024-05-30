import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Image } from 'expo-image';

const ProtocolHeader = ({ navigation, image }) => (
  <View style={styles.headerContainer}>
    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
      <Text style={styles.label}>Back</Text>
    </Pressable>
    <Pressable style={styles.swapButton} onPress={() => navigation.navigate('Swap')}>
      <Text style={styles.buttonLabel}>Swap</Text>
    </Pressable>
    <View style={styles.protocolInfo}>
      <Image
        style={styles.protocolImage}
        source={{ uri: image || 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg' }}
        contentFit="cover"
      />
    </View>
  </View>
);

ProtocolHeader.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  image: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  swapButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  protocolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  protocolImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default ProtocolHeader;