import '../../env';
import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateNonce, generateRandomness, jwtToAddress, getExtendedEphemeralPublicKey, genAddressSeed, getZkLoginSignature } from '@mysten/zklogin';
import { SuiClient } from "@mysten/sui.js/client";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from "expo-web-browser";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { FULLNODE_URL, ANDROID_CLIENT_ID, WEB_CLIENT_ID, USER_SALT_LOCAL_STORAGE_KEY, SUI_DEVNET_FAUCET, SUI_PROVER_DEV_ENDPOINT} from '../../constants'
import { Image } from 'expo-image';

WebBrowser.maybeCompleteAuthSession();

const suiClient = new SuiClient({ url: FULLNODE_URL });

export default function Login({ navigation }) {
    const [nonceData, setNonceData] = useState('');
    const [ephemeralKeyPairData, setEphemeralKeyPairData] = useState(null);
    const [authLoading, setAuthLoading] = useState(false);
    const [maxEpochData, setMaxEpochData] = useState(null);
    const [jwtRandomness, setJwtRandomness] = useState(null);

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: ANDROID_CLIENT_ID,
        webClientId: WEB_CLIENT_ID,
        extraParams: {
            nonce: nonceData || '',
        },
    });

    console.log(response, request)

    useEffect(() => {
        const initialize = async () => {
            try {
                const keyPair = new Ed25519Keypair();
                setEphemeralKeyPairData(keyPair);

                const { epoch } = await suiClient.getLatestSuiSystemState();
                const maxEpoch = Number(epoch) + 10;
                setMaxEpochData(maxEpoch);

                const randomness = generateRandomness();
                setJwtRandomness(randomness);

                const nonce = generateNonce(keyPair.getPublicKey(), maxEpoch, randomness);

                if (nonce.length !== 27) {
                    throw new Error(`Nonce length is incorrect: expected 27, got ${nonce.length}`);
                }

                setNonceData(nonce);
            } catch (error) {
                console.error('Initialization error:', error);
            }
        };

        initialize();
    }, []);

    const createRandomEphemeralKeyPair = async () => {
        if (!nonceData) {
            console.error('Nonce not generated yet');
            return;
        }

        await promptAsync();
    };

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication?.idToken) {
                setAuthLoading(true);
                const decodedJwt = jwtDecode(authentication.idToken);
                const salt = USER_SALT_LOCAL_STORAGE_KEY;
                const zkLoginUserAddress = jwtToAddress(authentication.idToken, salt);
                handleAuthenticationSuccess(authentication.idToken, zkLoginUserAddress, salt, decodedJwt);
            }
        }
    }, [response]);

    const handleAuthenticationSuccess = async (authToken, zkLoginUserAddress, salt, decodedJwt) => {
        try {
            await AsyncStorage.setItem('zkLoginUserAddress', zkLoginUserAddress)

            // await requestFaucet(zkLoginUserAddress);

            // const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(ephemeralKeyPairData.getPublicKey());
            // const partialZkLoginSignature = await zkProofApi(authToken, extendedEphemeralPublicKey, salt);

            // await signTransaction(partialZkLoginSignature, decodedJwt, salt, zkLoginUserAddress);

            setAuthLoading(false);
            navigation.navigate('Dashboard', { email: decodedJwt.email, address: zkLoginUserAddress });
        } catch (error) {
            console.error('Error in handleAuthenticationSuccess:', error);
            setAuthLoading(false);
        }
    };

    const requestFaucet = async (zkLoginUserAddress) => {
        if (!zkLoginUserAddress) {
            return;
        }
        try {
            await axios.post(SUI_DEVNET_FAUCET, {
                FixedAmountRequest: { recipient: zkLoginUserAddress },
            });
        } catch (error) {
            console.error('Faucet request failed:', error);
        }
    };

    const zkProofApi = async (jwt, extendedEphemeralPublicKey, salt) => {
        try {
            const response = await axios.post(
                SUI_PROVER_DEV_ENDPOINT,
                {
                    jwt,
                    extendedEphemeralPublicKey,
                    maxEpoch: maxEpochData,
                    jwtRandomness,
                    salt,
                    keyClaimName: "sub",
                },
                { headers: { "Content-Type": "application/json" } }
            );
            return response.data;
        } catch (error) {
            console.error('zkProofApi request failed:', error);
            throw error;
        }
    };

    // this could be used for swap and liquidity operations
    const signTransaction = async (partialZkLoginSignature, decodedJwt, salt, zkLoginUserAddress) => {
        try {
            const txb = new TransactionBlock();
            const [coin] = txb.splitCoins(txb.gas, [MIST_PER_SUI * 1n]);
            txb.transferObjects([coin], "0xfa0f8542f256e669694624aa3ee7bfbde5af54641646a3a05924cf9e329a8a36");
            txb.setSender(zkLoginUserAddress);

            const { bytes, signature: userSignature } = await txb.sign({
                client: suiClient,
                signer: ephemeralKeyPairData,
            });

            const addressSeed = genAddressSeed(BigInt(salt), "sub", decodedJwt.sub, decodedJwt.aud).toString();
            const zkLoginSignature = getZkLoginSignature({
                inputs: { ...partialZkLoginSignature, addressSeed },
                maxEpoch: maxEpochData,
                userSignature,
            });

            const result = await suiClient.executeTransactionBlock({
                transactionBlock: bytes,
                signature: zkLoginSignature,
            });

            console.log(result);
        } catch (error) {
            console.error('Error in signTransaction:', error);
        }
    };

    return (
        <>
            {authLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={styles.container}>
                    <Text style={styles.heading}>MANAGING ASSETS</Text>
                    <Text style={styles.heading}>HAS NEVER BEEN</Text>
                    <Text style={[styles.heading, {marginBottom: 20}]}>EASIER</Text>
                    <TouchableOpacity
                        style={styles.googleButton}
                        onPress={async() => await createRandomEphemeralKeyPair()}
                        disabled={!request}
                    >
                        <Image
                            style={styles.image}
                            source={{ uri: 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' }}
                            contentFit="cover"
                            transition={1000}
                        />
                        <Text style={styles.buttonText}>Sign In with Google</Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
      },
      heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      googleButton: {
        flexDirection: 'row',
        backgroundColor: '#050505',
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 50,
      },
      buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        justifyContent: 'center',
        alignSelf: 'center'
      },
      image: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
});
