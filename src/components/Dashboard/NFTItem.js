import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import PropTypes from 'prop-types';

const NFTItem = memo(({ nft }) => {
  const { name, lastPrice, image } = nft;

  return (
    <View style={styles.item}>
      <Image
        style={styles.image}
        source={{ uri: image || 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg' }}
        contentFit="cover"
        transition={1000}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.coinName}>{name}</Text>
        <Text style={styles.coinValue}>{lastPrice || 0} $</Text>
      </View>
    </View>
  );
});

NFTItem.propTypes = {
  nft: PropTypes.shape({
    name: PropTypes.string.isRequired,
    lastPrice: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
};

const styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    item: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    infoContainer: {
        flex: 1,
    },
    coinName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    coinValue: {
        fontSize: 16,
        color: '#333',
    },
});

export default NFTItem;