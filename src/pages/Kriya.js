import React, { useEffect, useState } from 'react';
import {StyleSheet, View, FlatList, SafeAreaView, ActivityIndicator, Text} from 'react-native';
import { api } from '../api/api';
import ProtocolHeader from '../components/ProtocolHeader';
import KriyaItem from '../components/Kriya/KriyaItem';

export default function Kriya({ route ,navigation }) {

    const { image } = route.params;

    const [filteredPoolsData, setFilteredPoolsData] = useState(null)
    const [loading, setLoading] = useState(true)

    const calculateMaxAPY = (tokenPairData) => {
        let baseAPY = tokenPairData.apy;
        const lockPeriodWeeks = 5

        if (baseAPY === 0) {
            return tokenPairData.feeApy
        }
      
        return baseAPY * lockPeriodWeeks;
      }

    const retrievelAllPools = async () => {
        try {
            const poolsData = await api.getKriyaPools();
            const filteredPools = poolsData.data.filter(item => item.feeApy);
            const finalPools = filteredPools.map(pool => ({
              ...pool,
              maxApy: calculateMaxAPY(pool),
            }));
            setFilteredPoolsData(finalPools);
            setLoading(false)
        } catch (error) {
            console.error('Error fetching Kriya pools:', error);
            setLoading(false)
        }
    }

    useEffect(() => {
        retrievelAllPools()
    }, [])

    const formatNumber = (num, to) => {
        let abbr;
        if (num >= 1000000) {
          abbr = 'M';
          num /= 1000000;
        } else if (num >= 1000) {
          abbr = 'K';
          num /= 1000;
        } else {
          abbr = '';
        }

        return `${num.toFixed(to)}${abbr}`;
    }

    return (
        <View style={styles.container}>
            <ProtocolHeader navigation={navigation} image={image} />
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
                        renderItem={({ item }) => <KriyaItem item={item} formatNumber={formatNumber} />}
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
        backgroundColor: '#f5f5f5'
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
});