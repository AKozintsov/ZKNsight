import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { BucketClient } from 'bucket-protocol-sdk/dist';
import { api } from '../api/api';
import TotalBuckContainer from '../components/Bucket/TotalBuckContainer';
import ProtocolHeader from '../components/ProtocolHeader';
import TankItem from '../components/Bucket/TankItem';

export default function Bucket({ route, navigation }) {

    const { image } = route.params;

    const [loading, setLoading] = useState(true)
    const [buckSupply, setBuckSupply] = useState(null)
    const [tanks, setTanks] = useState(null)

    const retrievelAllPools = async () => {
        const buck = new BucketClient();
        const buckData = await buck.getProtocol()
        setBuckSupply(buckData.buckSupply)
        const tanksData = await buck.getAllTanks()
        const aprs = (await api.getTankAprs()).data
        for (const key in aprs) {
            if (tanksData.hasOwnProperty(key)) {
                tanksData[key].apr = aprs[key];
            }
        }
        for (const key in tanksData) {
            if (tanksData.hasOwnProperty(key)) {
                tanksData[key].name = key
            }
        }
        const tanksFiltered = Object.values(tanksData).filter(tank => tank.apr !== 0 && tank.apr !== undefined)
        
        const tanksWithImages = await Promise.all(tanksFiltered.map(async tank => {
            if (tank.name === 'afSUI') {
                return {...tank, logo: 'https://assets.coingecko.com/coins/images/32391/standard/coin_icon_afsui.png?1698051868'}
            } else {
                const tokenInfo = await api.getTokenInfo(tank.name)
                return {...tank, logo: tokenInfo.data.Data.LOGO_URL}
            }
        }))
        setTanks(tanksWithImages)
        setLoading(false)
    }

    const formatNumber = (num) => {
        return num.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    useEffect(() => {
        retrievelAllPools()
    }, [])

    return (
        <View style={styles.container}>
            <ProtocolHeader navigation={navigation} image={image} />
            {buckSupply !== null && !loading && (
                <TotalBuckContainer buckSupply={buckSupply} formatNumber={formatNumber} />
            )}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            ) : (
                <SafeAreaView style={styles.listContainer}>
                    <FlatList
                        data={tanks}
                        renderItem={({ item }) => <TankItem tank={item} />}
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
        backgroundColor: '#f5f5f5'
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});