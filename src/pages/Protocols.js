// Dashboard.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, FlatList, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { api } from '../api/api';

export default function Protocols({ navigation }) {

    const supportedProtocols = ['flowx', 'bucket', 'cetus', 'kriya', 'scallop']

    const [portfoliosData, setPortfoliosData] = useState(null)

    const fetchAndFilterPortfolios = async () => {
        const data = await api.getPortfolios()
        const filteredPortfolios = data.data.data.records.filter((protocol) => {
            let supported = false
            supportedProtocols.forEach(item => {
                if (protocol.project_name.toLowerCase().includes(item)) {
                    supported = true
                }
            })

            if (supported) {
                return true
            }
        })
        setPortfoliosData(filteredPortfolios)
    }

    const navigateToProtocol = (protocolName, image) => {
        console.log(protocolName)
        switch (protocolName) {
            case 'Cetus':
                navigation.navigate('Cetus', { protocolName, image })
            case 'Bucket Protocol':
                navigation.navigate('Bucket', { protocolName, image })
            case 'Kriya DEX':
                navigation.navigate('Kriya', { protocolName, image })
            case 'FlowX Finance':
                navigation.navigate('FlowX', { protocolName, image })
            case 'Scallop':
                navigation.navigate('Scallop', { protocolName, image })
        }
    }

    useEffect(() => {
        fetchAndFilterPortfolios()
    }, [])

    console.log(portfoliosData)
    
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
                {/* <Pressable style={styles.btn} onPress={() => Alert.alert('Account Info', `Wallet Address:\n\n${address}\n\nGoogle Email: ${email}`)}>
                    <Text style={styles.label}>Account</Text>
                </Pressable> */}
            </View>
            {portfoliosData !== null ? (
                <SafeAreaView style={styles.itemContainer}>
                    <FlatList
                        data={portfoliosData}
                        renderItem={({item}) => (
                            <Pressable style={styles.item} onPress={() => navigateToProtocol(item.project_name, item.project_image_url)}>
                                <Image
                                    style={styles.image}
                                    source={{uri: item.project_image_url !== '' ? item.project_image_url : 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg'}}
                                    contentFit="cover"
                                    transition={1000}
                                />
                                <View style={styles.infoContainer}>
                                    <Text style={styles.coinName}>{item.project_name}</Text>
                                    <Text>{item.categories}</Text>
                                </View>
                            </Pressable>
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
