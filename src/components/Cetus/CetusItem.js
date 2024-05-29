import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Image } from 'expo-image';

const CetusItem = ({ poolData }) => {
  const { tokenPair, logoUrlA, logoUrlB, poolAPR, TVL, volume24h, fees24h } = poolData;

  return (
    <View style={styles.item}>
      <View style={styles.coinPair}>
        <Image
          style={styles.coinImage}
          source={{ uri: logoUrlA || 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg' }}
          contentFit="cover"
        />
        <Image
          style={styles.coinImage}
          source={{ uri: logoUrlB || 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg' }}
          contentFit="cover"
        />
        <View style={styles.coinPairInfo}>
          <Text style={styles.coinName}>{tokenPair}</Text>
        </View>
      </View>
      <View style={styles.statisticsContainer}>
        <View>
          <View style={styles.statistic}>
            <Text style={styles.statLabel}>APR:</Text>
            <Text style={styles.statValue}>{poolAPR}</Text>
          </View>
          <View style={styles.statistic}>
            <Text style={styles.statLabel}>TVL:</Text>
            <Text style={styles.statValue}>{TVL}</Text>
          </View>
        </View>
        <View>
          <View style={styles.statistic}>
            <Text style={styles.statLabel}>Volume (24h):</Text>
            <Text style={styles.statValue}>{volume24h}</Text>
          </View>
          <View style={styles.statistic}>
            <Text style={styles.statLabel}>Fees (24h):</Text>
            <Text style={styles.statValue}>{fees24h}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

CetusItem.propTypes = {
  poolData: PropTypes.shape({
    tokenPair: PropTypes.string.isRequired,
    logoUrlA: PropTypes.string,
    logoUrlB: PropTypes.string,
    poolAPR: PropTypes.string.isRequired,
    TVL: PropTypes.string.isRequired,
    volume24h: PropTypes.string.isRequired,
    fees24h: PropTypes.string.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
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
  coinPair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  coinPairInfo: {
    alignItems: 'center',
  },
  coinName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 10,
  },
  statistic: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  statValue: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CetusItem;