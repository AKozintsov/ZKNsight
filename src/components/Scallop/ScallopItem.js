import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const Stat = ({ label, value, formatNumber }) => (
    <View style={styles.statistic}>
        <Text style={styles.statLabel}>{label}:</Text>
        <Text style={styles.statValue}>{formatNumber !== undefined ? formatNumber(value) : value}</Text>
    </View>
);

const ScallopItem = ({ item, formatNumber }) => (
    <View style={styles.item}>
        <View style={styles.coinPair}>
            <Image
                style={styles.coinImage}
                source={{ uri: item.logo || 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg' }}
                contentFit="cover"
                transition={1000}
            />
            <View style={styles.coinPairInfo}>
                <Text style={styles.coinName}>{item.symbol}</Text>
            </View>
        </View>
        <View style={styles.statisticsContainer}>
            <View>
                <Stat label="Total Supply" value={item.supplyCoin} formatNumber={formatNumber} />
                <Stat label="Total Borrow" value={item.borrowCoin} formatNumber={formatNumber} />
            </View>
            <View>
                <Stat label="Utilization Rate" value={`${(item.utilizationRate * 100).toFixed(2)}%`} />
                <Stat label="Supply APR" value={`${(item.supplyApr * 100).toFixed(2)}%`} />
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    coinPair: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
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
  
  export default ScallopItem;