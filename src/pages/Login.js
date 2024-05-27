import '../../env';
import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Pressable, ActivityIndicator} from 'react-native';
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

WebBrowser.maybeCompleteAuthSession();

const suiClient = new SuiClient({ url: FULLNODE_URL });

export default function Login({ navigation }) {
    const [nonceData, setNonceData] = useState('');
    const [ephemeralKeyPairData, setEphemeralKeyPairData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [token, setToken] = useState("");
    const [maxEpochData, setMaxEpochData] = useState(null);
    const [jwtRandomness, setJwtRandomness] = useState(null);

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: ANDROID_CLIENT_ID,
        // webClientId: WEB_CLIENT_ID,
        extraParams: {
            nonce: nonceData || '',
        },
    });

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

                // Ensure nonce is of the correct length
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
        setLoading(true);

        if (!nonceData) {
            console.error('Nonce not generated yet');
            setLoading(false);
            return;
        }

        setLoading(false);

        await promptAsync();
    };

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication?.idToken) {
                setAuthLoading(true); // Start auth loading
                console.log('token:', authentication.idToken);
                setToken(authentication.idToken);
                const decodedJwt = jwtDecode(authentication.idToken);
                const salt = USER_SALT_LOCAL_STORAGE_KEY;
                const zkLoginUserAddress = jwtToAddress(authentication.idToken, salt);
                console.log('zkLoginUserAddress:', zkLoginUserAddress);
                handleAuthenticationSuccess(authentication.idToken, zkLoginUserAddress, salt, decodedJwt);
            }
        }
    }, [response]);

    const handleAuthenticationSuccess = async (authToken, zkLoginUserAddress, salt, decodedJwt) => {
        try {
            await AsyncStorage.setItem('zkLoginUserAddress', zkLoginUserAddress)

            await requestFaucet(zkLoginUserAddress);

            const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(ephemeralKeyPairData.getPublicKey());
            const partialZkLoginSignature = await zkProofApi(authToken, extendedEphemeralPublicKey, salt);

            await signTransaction(partialZkLoginSignature, decodedJwt, salt, zkLoginUserAddress);

            // Navigate to Dashboard
            setAuthLoading(false); // End auth loading
            navigation.navigate('Dashboard', { email: decodedJwt.email, address: zkLoginUserAddress });
        } catch (error) {
            console.error('Error in handleAuthenticationSuccess:', error);
            setAuthLoading(false); // End auth loading
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
        <View style={styles.container}>
            {authLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <Text>Log in with Google</Text>
                    <Pressable style={styles.btn} onPress={async() => await createRandomEphemeralKeyPair()} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text>Log in with Google</Text>}
                    </Pressable>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        borderWidth: 1,
        borderColor: "black",
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
});
