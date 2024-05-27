// Dashboard.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, FlatList, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
// import CetusClmmSDK, { SdkOptions } from '@cetusprotocol/cetus-sui-clmm-sdk'
import axios from 'axios';
import coins from '../../coins.json'

const lpObjectIds = [
    '0xcf994611fd4c48e277ce3ffd4d4364c914af2c3cbb05f7bf6facd371de688630',
    '0x871d8a227114f375170f149f7e9d45be822dd003eba225e83c05ac80828596bc',
    '0xc8d7a1503dc2f9f5b05449a87d8733593e2f0f3e7bffd90541252782e4d2ca20',
    '0xa528b26eae41bcfca488a9feaa3dca614b2a1d9b9b5c78c256918ced051d4c50',
];

export default function Cetus({ route ,navigation }) {

    const { protocolName, image } = route.params;

    const [filteredPoolsData, setFilteredPoolsData] = useState(null)
    const [addres, setAddres] = useState(null)
    const [statistics, setStatistics] = useState(null)
    

    const retrievelAllPools = async () => {
        const pools = await axios.get('https://api-sui.cetus.zone/v2/sui/swap/count')
        const filteredPools = pools.data.data.pools.filter(pool => lpObjectIds.includes(pool.swap_account))
        setFilteredPoolsData(filteredPools)
    }

    const calculateStatistics = () => {
        const res = filteredPoolsData.map(pool => {
            const poolAPR = parseFloat(pool.total_apr) * 100;
            const tvl = parseFloat(pool.tvl_in_usd);
            const volume24h = parseFloat(pool.vol_in_usd_24h);
            const feeRate = parseFloat(pool.fee);
            const fees24h = volume24h * feeRate;
        
            // Format the results
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
    }

    useEffect(() => {
        retrievelAllPools()
    }, [])

    useEffect(() => {
        if (filteredPoolsData !== null) {
            calculateStatistics()
        }
    }, [filteredPoolsData])

    

    console.log(statistics)

    return (
        <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
            <View style={styles.btnContainer}>
                <Pressable style={styles.btnBack} onPress={() => navigation.goBack()}>
                    <Text style={styles.label}>Back</Text>
                </Pressable>
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <Image
                        style={styles.image}
                        source={{uri: image !== '' ? image : 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg'}}
                        contentFit="cover"
                        transition={1000}
                    />
                    <Text style={styles.coinName}>{protocolName}</Text>
                </View>
                {/* <Pressable style={styles.btnBack} onPress={async () => {
                    await fetchNFTs()
                    await fetchCoins()
                }}>
                    <Text style={styles.label}>Update</Text>
                </Pressable> */}
                {/* <Pressable style={styles.btn} onPress={() => Alert.alert('Account Info', `Wallet Address:\n\n${address}\n\nGoogle Email: ${email}`)}>
                    <Text style={styles.label}>Account</Text>
                </Pressable> */}
            </View>
            
            {filteredPoolsData !== null ? (
                <SafeAreaView style={styles.itemContainer}>
                    <FlatList
                        data={statistics}
                        renderItem={({item}) => (
                            <View style={styles.item}>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <Image
                                        style={styles.image}
                                        source={{uri: item.logoUrlA !== '' ? item.logoUrlA : 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg'}}
                                        contentFit="cover"
                                        transition={1000}
                                    />
                                    <Image
                                        style={styles.image}
                                        source={{uri: item.logoUrlB !== '' ? item.logoUrlB : 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg'}}
                                        contentFit="cover"
                                        transition={1000}
                                    />
                                    <View style={styles.infoContainer}>
                                        <Text style={styles.coinName}>{item.tokenPair}</Text>
                                        {/* <Text>{item.categories}</Text> */}
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10}}>
                                    {/* <View style={{flexDirection: 'column', flex: 1.3}}>
                                        <Text>{'Reward: '}</Text>
                                        <Text>{item.poolReward[0].amount / 1000000000}{' '}</Text>
                                    </View> */}
                                    <View style={{flexDirection: 'column', flex: 0.8}}>
                                        <Text>{'APR: '}</Text>
                                        <Text>{item.poolAPR}</Text>
                                    </View>
                                    <View style={{flexDirection: 'column', flex: 0.8}}>
                                        <Text>{'TVL: '}</Text>
                                        <Text>{item.TVL}</Text>
                                    </View>
                                    <View style={{flexDirection: 'column', flex: 0.8}}>
                                        <Text>{'Volume (24h): '}</Text>
                                        <Text>{item.volume24h}</Text>
                                    </View>
                                    <View style={{flexDirection: 'column', flex: 0.8}}>
                                        <Text>{'Fees (24h): '}</Text>
                                        <Text>{item.fees24h}</Text>
                                    </View>
                                </View>
                            </View>
                            
                        )}
                    />
                </SafeAreaView>
            ) : null}
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
        width: 20,
        height: 20,
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
    infoContainer: {
        // flex: 1,
    },
    coinName: {
        fontSize: 18,
        fontWeight: 'bold',
        // marginBottom: 5,
        alignItems: 'center',
        // marginTop: 3
    },
    coinValue: {
        fontSize: 16,
        color: '#333',
    },
    priceChange: {
        fontSize: 14,
        marginTop: 5,
    }
});




