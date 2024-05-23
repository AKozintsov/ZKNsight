import './env';
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

WebBrowser.maybeCompleteAuthSession();

const suiClient = new SuiClient({ url: "https://fullnode.devnet.sui.io" });

export default function Login({ navigation }) {
    const [nonceData, setNonceData] = useState(null);
    const [ephemeralKeyPairData, setEphemeralKeyPairData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [token, setToken] = useState("");
    const [maxEpochData, setMaxEpochData] = useState(null);
    const [jwtRandomness, setJwtRandomness] = useState(null);

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '162663894145-7s2u94c6s4k37345f66d6cbd1ndpsbm2.apps.googleusercontent.com',
        webClientId: '162663894145-3lj29d0eqa71bhvs2slsau96612kmga7.apps.googleusercontent.com',
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

        // Wait for nonce to be set
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
                const salt = '121397862192512892096244528342159433147';
                const zkLoginUserAddress = jwtToAddress(authentication.idToken, salt);
                console.log('zkLoginUserAddress:', zkLoginUserAddress);
                handleAuthenticationSuccess(authentication.idToken, zkLoginUserAddress, salt, decodedJwt);
            }
        }
    }, [response]);

    const handleAuthenticationSuccess = async (authToken, zkLoginUserAddress, salt, decodedJwt) => {
        try {
            await requestFaucet(zkLoginUserAddress);

            const extendedEphemeralPublicKey = getExtendedEphemeralPublicKey(ephemeralKeyPairData.getPublicKey());
            const partialZkLoginSignature = await zkProofApi(authToken, extendedEphemeralPublicKey, salt);

            const txb = new TransactionBlock();
            const [coin] = txb.splitCoins(txb.gas, [MIST_PER_SUI * 1n]);
            txb.transferObjects([coin], "0xfa0f8542f256e669694624aa3ee7bfbde5af54641646a3a05924cf9e329a8a36");
            txb.setSender(zkLoginUserAddress);

            const { signature: userSignature } = await txb.sign({
                client: suiClient,
                signer: ephemeralKeyPairData,
            });

            await signTransaction(zkLoginUserAddress, partialZkLoginSignature, userSignature, decodedJwt, salt);

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
            await axios.post("https://faucet.devnet.sui.io/gas", {
                FixedAmountRequest: { recipient: zkLoginUserAddress },
            });
        } catch (error) {
            console.error('Faucet request failed:', error);
        }
    };

    const zkProofApi = async (jwt, extendedEphemeralPublicKey, salt) => {
        try {
            const response = await axios.post(
                "https://prover-dev.mystenlabs.com/v1",
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

    const signTransaction = async (zkLoginUserAddress, partialZkLoginSignature, userSignature, decodedJwt, salt) => {
        try {
            const addressSeed = genAddressSeed(BigInt(salt), "sub", decodedJwt.sub, decodedJwt.aud).toString();
            const zkLoginSignature = getZkLoginSignature({
                inputs: { ...partialZkLoginSignature, addressSeed },
                maxEpoch: maxEpochData,
                userSignature,
            });

            const txb = new TransactionBlock();
            const [coin] = txb.splitCoins(txb.gas, [MIST_PER_SUI * 1n]);
            txb.transferObjects([coin], "0xfa0f8542f256e669694624aa3ee7bfbde5af54641646a3a05924cf9e329a8a36");
            txb.setSender(zkLoginUserAddress);

            const { bytes } = await txb.sign({
                client: suiClient,
                signer: ephemeralKeyPairData,
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
                    <Pressable style={styles.btn} onPress={createRandomEphemeralKeyPair} disabled={loading}>
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
