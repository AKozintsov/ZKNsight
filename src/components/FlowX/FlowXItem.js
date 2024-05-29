import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const FlowXItem = ({ item, formatNumber, formatPercentage }) => (
    <View style={styles.item}>
      <View style={styles.coinPair}>
        <Image
          style={styles.image}
          source={{ uri: item.coinX.iconUrl || 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg' }}
          contentFit="cover"
          transition={1000}
        />
        <Image
          style={styles.image}
          source={{ uri: item.coinY.iconUrl || 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg' }}
          contentFit="cover"
          transition={1000}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.coinName}>{`${item.coinX.symbol}/${item.coinY.symbol}`}</Text>
        </View>
      </View>
      <View style={styles.statisticsContainer}>
        <View style={styles.statistic}>
          <Text style={styles.statLabel}>Reward:</Text>
          <Text style={styles.statValue}>{`$${formatNumber(item.poolReward[0].amount / 1000000000)}`}</Text>
        </View>
        <View style={[styles.statistic, styles.middleStatistic]}>
          <Text style={styles.statLabel}>APR:</Text>
          <Text style={styles.statValue}>{`${(formatPercentage(item.rewardApr) + formatPercentage(item.tradingApr)).toFixed(2)}%`}</Text>
        </View>
        <View style={styles.statistic}>
          <Text style={styles.statLabel}>Total Liquid:</Text>
          <Text style={styles.statValue}>{`$${formatNumber(parseFloat(item.totalLiquid))}`}</Text>
        </View>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    item: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
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
    image: {
        width: 40,
        height: 40,
        borderRadius: 25,
        marginRight: 10,
    },
    infoContainer: {
        alignItems: 'center',
    },
    coinName: {
        fontSize: 18,
        fontWeight: 'bold',
        alignItems: 'center',
    },
    coinValue: {
        fontSize: 16,
        color: '#333',
    },
    coinPair: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statisticsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: '#f4f4f4',
        borderRadius: 10,
    },
    statistic: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '33%',
    },
    statLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 5,
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
  });
  
  export default FlowXItem;