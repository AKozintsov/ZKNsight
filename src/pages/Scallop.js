import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import {
    Scallop,
} from '@scallop-io/sui-scallop-sdk'
import { api } from '../api/api';
import ProtocolHeader from '../components/ProtocolHeader';
import OverviewSection from '../components/Scallop/OverviewSection';
import ScallopItem from '../components/Scallop/ScallopItem';

export default function ScallopP({ route ,navigation }) {
    const scallopSDK = new Scallop({
        networkType: 'mainnet',
    });

    const { image } = route.params;

    const [filteredPoolsData, setFilteredPoolsData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [overviewData, setOverviewData] = useState(null)

    const retrievelAllPools = async () => {
        try {
            const scallopIndexer = await scallopSDK.createScallopIndexer();
            const marketData = await scallopIndexer.getMarket();

            const pools = Object.values(marketData.pools).filter(
                pool => !['BTC', 'APT', 'SOL'].includes(pool.symbol)
            );

            const dataWithImages = await Promise.all(
                pools.map(async pool => {
                    if (pool.symbol === 'afSUI') {
                        return { ...pool, logo: 'https://assets.coingecko.com/coins/images/32391/standard/coin_icon_afsui.png?1698051868' };
                    } else {
                        const tokenInfo = await api.getTokenInfo(pool.symbol);
                        return { ...pool, logo: tokenInfo.data.Data.LOGO_URL };
                    }
                })
            );

            const overview = await scallopIndexer.getTotalValueLocked();
            setOverviewData(overview);
            setFilteredPoolsData(dataWithImages);
            setLoading(false)
        } catch (error) {
            console.error('Error retrieving pools data:', error);
            setLoading(false)
        }
    }

    const formatNumber = (num) => {
        if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
        if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
        return num.toFixed(2);
    };

    useEffect(() => {
        retrievelAllPools()
    }, [])

    return (
        <View style={styles.container}>
            <ProtocolHeader navigation={navigation} image={image} />
            {overviewData && !loading && <OverviewSection data={overviewData} formatNumber={formatNumber} />}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            ) : (
                <>
                    <View style={styles.headingContainer}>
                        <View style={styles.centered}>
                            <Text style={styles.heading}>Pools</Text>
                        </View>
                    </View>
                    <SafeAreaView style={styles.listContainer}>
                        <FlatList
                            data={filteredPoolsData}
                            renderItem={({ item }) => <ScallopItem item={item} formatNumber={formatNumber} />}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </SafeAreaView>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headingContainer: {
        backgroundColor: '#fff',
        marginTop: 8,
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
    centered: {
        alignItems: 'center',
        alignSelf: 'center'
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        width: '30%',
        alignSelf: 'center',
    },
});