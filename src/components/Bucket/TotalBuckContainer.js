import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TotalBuckContainer = ({ buckSupply, formatNumber }) => (
    <View style={styles.supplyContainer}>
        <Text style={styles.supply}>Total BUCK in Circulation: {formatNumber(buckSupply)}</Text>
    </View>
);

const styles = StyleSheet.create({
    supplyContainer: {
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
    supply: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default TotalBuckContainer