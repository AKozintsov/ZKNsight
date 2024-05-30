import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Alert, FlatList, SafeAreaView } from 'react-native';
import { api } from '../api/api';
import CoinItem from '../components/Dashboard/CoinItem';
import NFTItem from '../components/Dashboard/NFTItem';
import Header from '../components/Dashboard/DashboardHeader';
import ProtocolItem from '../components/Dashboard/ProtocolItem';

export default function Dashboard({ route, navigation }) {
    const { email, address } = route.params;

    const supportedProtocols = ['flowx', 'bucket', 'cetus', 'kriya', 'scallop']

    const [coinsData, setCoinsData] = useState(null);
    const [NFTsData, setNFTsData] = useState(null);
    const [portfoliosData, setPortfoliosData] = useState(null)
    const [showSection, setShowSection] = useState('coins');

    const fetchCoins = async () => {
        try {
            const res = await api.getCoins(address); // address
            setCoinsData(res.data.result.coins);
        } catch (error) {
            console.error('Error fetching coins:', error);
        }
    }

    const fetchNFTs = async () => {
        try {
            const res = await api.getNFTs(address); // address
            setNFTsData(res.data.result.data);
        } catch (error) {
            console.error('Error fetching NFTs:', error);
        }
    }

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
        switch (protocolName) {
            case 'Cetus':
                navigation.navigate('Cetus', { image })
                break
            case 'Bucket Protocol':
                navigation.navigate('Bucket', { image })
                break
            case 'Kriya DEX':
                navigation.navigate('Kriya', { image })
                break
            case 'FlowX Finance':
                navigation.navigate('FlowX', { image })
                break
            case 'Scallop':
                navigation.navigate('Scallop', { image })
                break
        }
    }

    const goBack = () => {
        navigation.goBack()
    }

    const showAccountInfo = () => {
        Alert.alert('Account Info', `Wallet Address:\n\n${address}\n\nGoogle Email: ${email}`)
    }

    useEffect(() => {
        fetchCoins()
        fetchNFTs()
        fetchAndFilterPortfolios()
    }, [])

    return (
        <View style={styles.container}>
            <Header onBack={goBack} onAccount={showAccountInfo} onToggle={setShowSection} showSection={showSection} />
            {coinsData && showSection === 'coins' && (
                <SafeAreaView style={styles.itemContainer}>
                    <FlatList
                        data={coinsData}
                        renderItem={({item}) => <CoinItem coin={item} />}
                    />
                </SafeAreaView>
            )}
            {NFTsData && showSection === 'nfts' && (
                <SafeAreaView style={styles.itemContainer}>
                    <FlatList
                        data={NFTsData}
                        renderItem={({item}) => <NFTItem nft={item} />}
                    />
                </SafeAreaView>
            )}
            {portfoliosData && showSection === 'protocols' && (
                <SafeAreaView style={styles.itemContainer}>
                    <FlatList
                        data={portfoliosData}
                        renderItem={({item}) => (
                            <Pressable
                                style={styles.protocolItem}
                                onPress={() => navigateToProtocol(item.project_name, item.project_image_url)}
                            >
                                <ProtocolItem protocol={item} />
                            </Pressable>
                        )}
                    />
                </SafeAreaView>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    protocolItem: {
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
    itemContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});
