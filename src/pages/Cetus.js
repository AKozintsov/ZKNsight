import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { api } from '../api/api';
import CetusItem from '../components/Cetus/CetusItem';
import ProtocolHeader from '../components/ProtocolHeader';

const lpObjectIds = [
    '0xcf994611fd4c48e277ce3ffd4d4364c914af2c3cbb05f7bf6facd371de688630',
    '0x871d8a227114f375170f149f7e9d45be822dd003eba225e83c05ac80828596bc',
    '0xc8d7a1503dc2f9f5b05449a87d8733593e2f0f3e7bffd90541252782e4d2ca20',
    '0xa528b26eae41bcfca488a9feaa3dca614b2a1d9b9b5c78c256918ced051d4c50',
    '0x2e041f3fd93646dcc877f783c1f2b7fa62d30271bdef1f21ef002cebf857bded',
    '0xaa57c66ba6ee8f2219376659f727f2b13d49ead66435aa99f57bb008a64a8042',
    '0x6c545e78638c8c1db7a48b282bb8ca79da107993fcb185f75cedc1f5adb2f535',
    '0x0254747f5ca059a1972cd7f6016485d51392a3fde608107b93bbaebea550f703',
    '0x81fe26939ed676dd766358a60445341a06cea407ca6f3671ef30f162c84126d5',
    '0xaa72bd551b25715b8f9d72f226fa02526bdf2e085a86faec7184230c5209bb6e',
];

export default function Cetus({ route ,navigation }) {

    const { image } = route.params;

    const [filteredPoolsData, setFilteredPoolsData] = useState(null)
    const [statistics, setStatistics] = useState(null)
    const [loading, setLoading] = useState(true)

    const retrievelAllPools = async () => {
        try {
          const pools = await api.getCetusPools();
          const filteredPools = pools.data.data.pools.filter((pool) => lpObjectIds.includes(pool.swap_account));
          setFilteredPoolsData(filteredPools);
        } catch (error) {
          console.error('Error fetching Cetus pools:', error);
        }
      };

    const calculateStatistics = () => {
        const res = filteredPoolsData.map(pool => {
            const poolAPR = parseFloat(pool.total_apr) * 100;
            const tvl = parseFloat(pool.tvl_in_usd);
            const volume24h = parseFloat(pool.vol_in_usd_24h);
            const feeRate = parseFloat(pool.fee);
            const fees24h = volume24h * feeRate;

            return {
                tokenPair: `${pool.token_a_reserves}/${pool.token_b_reserves}`,
                logoUrlA: pool.coin_a.logo_url,
                logoUrlB: pool.coin_b.logo_url,
                poolAPR: `${poolAPR.toFixed(2)}%`,
                TVL: `$${tvl.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                volume24h: `$${volume24h.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                fees24h: `$${fees24h.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
            };
        })
        setStatistics(res)
        setLoading(false);
    }

    useEffect(() => {
        retrievelAllPools()
    }, [])

    useEffect(() => {
        if (filteredPoolsData !== null) {
            calculateStatistics()
        }
    }, [filteredPoolsData])

    return (
        <View style={styles.container}>
            <ProtocolHeader navigation={navigation} image={image} />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            ) : (
                <SafeAreaView style={styles.listContainer}>
                <FlatList
                    data={statistics}
                    renderItem={({ item }) => <CetusItem poolData={item} />}
                    keyExtractor={(item, index) => index.toString()}
                />
                </SafeAreaView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
      },
      listContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
      },
      loader: {
        flex: 1,
        justifyContent: 'center',
      },
});




