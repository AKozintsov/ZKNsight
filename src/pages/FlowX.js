// Dashboard.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, FlatList, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { getFaasV2 } from "@flowx-pkg/ts-sdk"

export default function FlowX({ route ,navigation }) {

    const { protocolName, image } = route.params;

    const [filteredPoolsData, setFilteredPoolsData] = useState(null)

    const fetchPoolsAndFilter = async () => {
        const lpObjectIds = [
            '0x0678a21b6c0225d15d4f2e15f667fd1b0db16494b1798673d7dcfc4cf6764d21',
            '0x081c3d15266e5059213024048bd4b486a50cfda820eef122d263e4388d058256',
            '0x3d0e0fc11224ab360adc04fd91324aea4d33253b84cab2186127c329054ecda7',
            '0x74de1ef7880c63398a55de8c893fc88dac3bc30e5601476eee8d21c06ea4a7ec'
        ];
        let listGenesisX = await getFaasV2();
        const filteredPools = listGenesisX.filter(pool => lpObjectIds.includes(pool.id));
        console.log(filteredPools[0])
        setFilteredPoolsData(filteredPools)
    }

    useEffect(() => {
        fetchPoolsAndFilter()
    }, [])

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
                        data={filteredPoolsData}
                        renderItem={({item}) => (
                            <View style={styles.item}>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <Image
                                        style={styles.image}
                                        source={{uri: item.coinX.iconUrl !== '' ? item.coinX.iconUrl : 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg'}}
                                        contentFit="cover"
                                        transition={1000}
                                    />
                                    <Image
                                        style={styles.image}
                                        source={{uri: item.coinY.iconUrl !== '' ? item.coinY.iconUrl : 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg'}}
                                        contentFit="cover"
                                        transition={1000}
                                    />
                                    <View style={styles.infoContainer}>
                                        <Text style={styles.coinName}>{item.coinX.symbol}{'/'}{item.coinY.symbol}</Text>
                                        {/* <Text>{item.categories}</Text> */}
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10}}>
                                    <View style={{flexDirection: 'column', flex: 1.3}}>
                                        <Text>{'Reward: '}</Text>
                                        <Text>{item.poolReward[0].amount / 1000000000}{' '}</Text>
                                    </View>
                                    <View style={{flexDirection: 'column', flex: 0.8}}>
                                        <Text>{'APR: '}</Text>
                                        <Text>{(Number(parseFloat(item.rewardApr).toFixed(2)) + Number(parseFloat(item.tradingApr).toFixed(2))).toFixed(2)}{' % '}</Text>
                                    </View>
                                    <View style={{flexDirection: 'column', flex: 0.8}}>
                                        <Text>{'Total Liquid: '}</Text>
                                        <Text>{'$'}{Number(parseFloat(item.totalLiquid).toFixed(2))}</Text>
                                    </View>

                                    
                                    <Text></Text>
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
