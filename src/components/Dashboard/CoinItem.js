import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import PropTypes from 'prop-types';

const CoinItem = memo(({ coin }) => {
  const { name, usdValue, priceChangePercentage24H, logo } = coin;

  return (
    <View style={styles.item}>
      <Image
        style={styles.image}
        source={{ uri: logo || 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg' }}
        contentFit="cover"
        transition={1000}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.coinName}>{name}</Text>
        <Text style={styles.coinValue}>{usdValue || 0} $</Text>
        <Text style={[styles.priceChange, { color: priceChangePercentage24H > 0 ? 'green' : 'red' }]}>
          {priceChangePercentage24H ? priceChangePercentage24H + '%' : null}
        </Text>
      </View>
    </View>
  );
});

CoinItem.propTypes = {
  coin: PropTypes.shape({
    name: PropTypes.string.isRequired,
    usdValue: PropTypes.string,
    priceChangePercentage24H: PropTypes.string,
    logo: PropTypes.string,
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
    priceChange: {
        fontSize: 14,
        marginTop: 5,
    }
});

export default CoinItem;