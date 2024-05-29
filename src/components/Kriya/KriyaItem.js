import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const KriyaItem = ({ item, formatNumber }) => (
    <View style={styles.item}>
      <View style={styles.coinPair}>
        <Image
          style={styles.coinImage}
          source={{ uri: item.tokenX.iconUrl || 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg' }}
          contentFit="cover"
          transition={1000}
        />
        <Image
          style={styles.coinImage}
          source={{ uri: item.tokenY.iconUrl || 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg' }}
          contentFit="cover"
          transition={1000}
        />
        <View style={styles.coinPairInfo}>
          <Text style={styles.coinName}>{`${item.tokenX.tokenName}/${item.tokenY.tokenName}`}</Text>
        </View>
      </View>
      <View style={styles.statisticsContainer}>
        <View>
          <View style={styles.statistic}>
            <Text style={styles.statLabel}>Base APY:</Text>
            <Text style={styles.statValue}>{`${item.apy ? formatNumber(item.apy, 3) : formatNumber(item.feeApy, 3)}%`}</Text>
          </View>
          <View style={styles.statistic}>
            <Text style={styles.statLabel}>Max APY:</Text>
            <Text style={styles.statValue}>{`${item.maxApy ? formatNumber(item.maxApy, 3) : formatNumber(item.feeApy, 3)}%`}</Text>
          </View>
        </View>
        <View>
          <View style={styles.statistic}>
            <Text style={styles.statLabel}>TVL:</Text>
            <Text style={styles.statValue}>{formatNumber(item.tvl, 2)}</Text>
          </View>
          <View style={styles.statistic}>
            <Text style={styles.statLabel}>Pool Type:</Text>
            <Text style={styles.statValue}>{item.isStable ? 'Stable' : 'Uncorrelated'}</Text>
          </View>
        </View>
      </View>
    </View>
  );

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
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
  });
  
  export default KriyaItem;