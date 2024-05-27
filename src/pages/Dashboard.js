// Dashboard.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, FlatList, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { api } from '../api/api';

export default function Dashboard({ route, navigation }) {
    // const { email, address } = route.params;
    const address = ''
    const email = ''
    const [coinsData, setCoinsData] = useState(null)
    const [NFTsData, setNFTsData] = useState(null)
    const [toggle, setToggle] = useState(true)

    const fetchCoins = async () => {
        const res = await api.getCoins()
        setCoinsData(res.data.result.coins)
    }

    const fetchNFTs = async () => {
        const res = await api.getNFTs()
        setNFTsData(res.data.result.data)
    }

    useEffect(() => {
        fetchCoins()
        fetchNFTs()
    }, [])
    console.log(NFTsData)
    return (
        <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
            <View style={styles.btnContainer}>
                <Pressable style={styles.btnBack} onPress={() => navigation.goBack()}>
                    <Text style={styles.label}>Back</Text>
                </Pressable>
                {/* <Pressable style={styles.btnBack} onPress={async () => {
                    await fetchNFTs()
                    await fetchCoins()
                }}>
                    <Text style={styles.label}>Update</Text>
                </Pressable> */}
                <Pressable style={styles.btnBack} onPress={() => navigation.navigate('Protocols')}>
                    <Text style={styles.label}>Proto</Text>
                </Pressable>
                <Pressable style={styles.btn} onPress={() => Alert.alert('Account Info', `Wallet Address:\n\n${address}\n\nGoogle Email: ${email}`)}>
                    <Text style={styles.label}>Account</Text>
                </Pressable>
            </View>
            <View style={styles.btnContainer}>
                <Pressable style={styles.btnBack} onPress={() => setToggle(true)}>
                    <Text style={styles.label}>Coins</Text>
                </Pressable>
                <Pressable style={styles.btnBack} onPress={async () => setToggle(false)}>
                    <Text style={styles.label}>NFTs</Text>
                </Pressable>
            </View>
            {coinsData !== null && toggle ? (
                <SafeAreaView style={styles.itemContainer}>
                    <FlatList
                        data={coinsData}
                        renderItem={({item}) => (
                            <View style={styles.item}>
                                <Image
                                    style={styles.image}
                                    source={{uri: item.logo !== '' ? item.logo : 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg'}}
                                    contentFit="cover"
                                    transition={1000}
                                />
                                <View style={styles.infoContainer}>
                                    <Text style={styles.coinName}>{item.name}</Text>
                                    <Text style={styles.coinValue}>{item.usdValue !== '' ? item.usdValue : 0}{' $'}</Text>
                                    {item.priceChangePercentage24H > 0
                                    ? (
                                        <Text style={[styles.priceChange, {color: 'green'}]}>{item.priceChangePercentage24H !== '' ? item.priceChangePercentage24H : 0}{' %'}</Text>
                                    )
                                    : (
                                        item.priceChangePercentage24H === '' 
                                        ?
                                        <Text style={styles.priceChange}>{item.priceChangePercentage24H !== '' ? item.priceChangePercentage24H : 0}{' %'}</Text>
                                        :
                                        <Text style={[styles.priceChange, {color: 'red'}]}>{item.priceChangePercentage24H !== '' ? item.priceChangePercentage24H : 0}{' %'}</Text>
                                    )}
                                </View>
                            </View>
                        )}
                    />
                </SafeAreaView>
            ) : null}
            {NFTsData !== null && !toggle ? (
                <SafeAreaView style={styles.itemContainer}>
                    <FlatList
                        data={NFTsData}
                        renderItem={({item}) => (
                            <View style={styles.item}>
                                <Image
                                    style={styles.image}
                                    source={{uri: item.image !== '' ? item.image : 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg'}}
                                    contentFit="cover"
                                    transition={1000}
                                />
                                <View style={styles.infoContainer}>
                                    <Text style={styles.coinName}>{item.name}</Text>
                                    <Text style={styles.coinValue}>{item.lastPrice !== '' ? item.lastPrice : 0}{' $'}</Text>
                                    {/* {item.priceChangePercentage24H > 0
                                    ? (
                                        <Text style={[styles.priceChange, {color: 'green'}]}>{item.priceChangePercentage24H !== '' ? item.priceChangePercentage24H : 0}{' %'}</Text>
                                    )
                                    : (
                                        item.priceChangePercentage24H === '' 
                                        ?
                                        <Text style={styles.priceChange}>{item.priceChangePercentage24H !== '' ? item.priceChangePercentage24H : 0}{' %'}</Text>
                                        :
                                        <Text style={[styles.priceChange, {color: 'red'}]}>{item.priceChangePercentage24H !== '' ? item.priceChangePercentage24H : 0}{' %'}</Text>
                                    )} */}
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
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    itemContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    item: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
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
        flex: 1,
    },
    coinName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
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
