import './env';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateNonce, generateRandomness } from '@mysten/zklogin';
import { SuiClient } from "@mysten/sui.js/client";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();

export default function EphemeralKeyPair() {

  // const redirectUri = AuthSession.makeRedirectUri();

  const config = {
    androidClientId: '162663894145-7s2u94c6s4k37345f66d6cbd1ndpsbm2.apps.googleusercontent.com',
    webClientId: '162663894145-3lj29d0eqa71bhvs2slsau96612kmga7.apps.googleusercontent.com',
  };

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(config, nonce)
  const [userInfo, setUserInfo] = useState(null)
  const [token, setToken] = useState("");

  const suiClient = new SuiClient({ url: "https://fullnode.devnet.sui.io" });

  const randomness = generateRandomness();

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const res = await fetch(
          "https://www.googleapis.com/userinfo/v2/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      const user = await res.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

  useEffect(() => {
    handleEffect();
  }, [response, token]);

  async function handleEffect() {
    const user = await getLocalUser();
    console.log("user", user);
    if (!user) {
      if (response?.type === "success") {
        setToken(response.authentication.accessToken);
        getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(user);
      console.log("loaded locally");
    }
  }

  const createRandomEphemeralKeyPair = async () => {

    await promptAsync()

    const user = getUserInfo(response)

    const ephemeralKeyPair = new Ed25519Keypair();

    console.log(ephemeralKeyPair.getPublicKey(), ephemeralKeyPair.getSecretKey())

    const { epoch } = await suiClient.getLatestSuiSystemState()

    const maxEpoch = Number(epoch) + 10;

    const nonce = generateNonce(
        ephemeralKeyPair.getPublicKey(),
        maxEpoch,
        randomness
    );

  }

  return (
      <View style={styles.container}>
        <Text>Your key pair: {}</Text>
        <Pressable style={styles.btn} onPress={async() => await createRandomEphemeralKeyPair()}>
          <Text>Create random ephemeral KeyPair</Text>
        </Pressable>
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
    borderRadius: 10
  }
});
