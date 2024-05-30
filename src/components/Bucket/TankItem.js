import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const TankItem = ({ tank }) => (
    <View style={styles.item}>
        <View style={styles.coinPair}>
            <Image
                style={styles.coinImage}
                source={{ uri: tank.logo || 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg' }}
                contentFit="cover"
                transition={1000}
            />
            <View style={styles.coinPairInfo}>
                <Text style={styles.coinName}>{tank.name}</Text>
            </View>
        </View>
        <View style={styles.statisticsContainer}>
            <View style={styles.statistic}>
                <Text style={styles.statLabel}>APR:</Text>
                <Text style={styles.statValue}>{tank.apr ? `${parseFloat(tank.apr).toFixed(2)}%` : '0%'}</Text>
            </View>
            <View style={styles.statistic}>
                <Text style={styles.statLabel}>Total deposited:</Text>
                <Text style={styles.statValue}>{tank.buckReserve ? `${(parseFloat(tank.buckReserve / 1000000000000).toFixed(2))}K $BUCK` : '0'}</Text>
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
        flexDirection: 'column',
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
})

export default TankItem