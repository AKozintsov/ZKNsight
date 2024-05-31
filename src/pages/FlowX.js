import React, { useEffect, useState } from 'react';
import {StyleSheet, View, FlatList, SafeAreaView, ActivityIndicator, Text} from 'react-native';
import { getFaasV2 } from "@flowx-pkg/ts-sdk"
import ProtocolHeader from '../components/ProtocolHeader';
import FlowXItem from '../components/FlowX/FlowXItem';

export default function FlowX({ route ,navigation }) {

    const { image } = route.params;

    const [filteredPoolsData, setFilteredPoolsData] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    const fetchPoolsAndFilter = async () => {
        const lpObjectIds = [
            '0x0678a21b6c0225d15d4f2e15f667fd1b0db16494b1798673d7dcfc4cf6764d21',
            '0x081c3d15266e5059213024048bd4b486a50cfda820eef122d263e4388d058256',
            '0x3d0e0fc11224ab360adc04fd91324aea4d33253b84cab2186127c329054ecda7',
            '0x74de1ef7880c63398a55de8c893fc88dac3bc30e5601476eee8d21c06ea4a7ec'
        ];
        try {
            const listGenesisX = await getFaasV2();
            const filteredPools = listGenesisX.filter(pool => lpObjectIds.includes(pool.id));
            setFilteredPoolsData(filteredPools);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching pools:', error);
            setIsLoading(false);
        }
    }

    const formatNumber = (num) => {
        return num.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const formatPercentage = (num) => {
        return Number(parseFloat(num).toFixed(2))
    }

    useEffect(() => {
        fetchPoolsAndFilter()
    }, [])

    return (
        <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
            <ProtocolHeader navigation={navigation} image={image} />
            {isLoading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : filteredPoolsData !== null && (
                <>
                <View style={styles.headingContainer}>
                    <View style={styles.centered}>
                        <Text style={styles.heading}>Pools</Text>
                    </View>
                </View>
                <SafeAreaView style={styles.itemContainer}>
                    <FlatList
                        data={filteredPoolsData}
                        renderItem={({item}) => <FlowXItem item={item} formatNumber={formatNumber} formatPercentage={formatPercentage} />}
                    />
                </SafeAreaView>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    btnContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    btn: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnBack: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 25,
        marginRight: 10,
    },
    itemContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
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
    coinName: {
        fontSize: 18,
        fontWeight: 'bold',
        alignItems: 'center',
    },
    coinValue: {
        fontSize: 16,
        color: '#333',
    },
    priceChange: {
        fontSize: 14,
        marginTop: 5,
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
    swapButton: {
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
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
