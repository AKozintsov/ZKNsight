import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OverviewStat = ({ label, value, formatNumber }) => (
    <View style={styles.stat}>
        <Text style={styles.statLabelOverview}>{label}</Text>
        <Text style={styles.statValueOverview}>${formatNumber(value)}</Text>
    </View>
);

const OverviewSection = ({ data, formatNumber }) => (
    <View style={styles.item}>
        <View style={styles.centered}>
            <Text style={styles.heading}>Overview</Text>
        </View>
        <View style={styles.statisticsContainer}>
            <OverviewStat label="Total Supply & Deposit" value={data.supplyValue} formatNumber={formatNumber} />
            <OverviewStat label="Scallop TVL" value={data.totalValue} formatNumber={formatNumber} />
            <OverviewStat label="Total Borrow" value={data.borrowValue} formatNumber={formatNumber} />
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
    centered: {
        alignItems: 'center',
    },
    heading: {
        fontSize: 20,
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
    stat: {
        alignItems: 'center',
    },
    statLabelOverview: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    statValueOverview: {
        fontSize: 16,
        fontWeight: 'bold',
    },
  });
  
  export default OverviewSection;