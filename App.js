import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/pages/Login';
import Dashboard from './src/pages/Dashboard';
import FlowX from './src/pages/FlowX';
import Bucket from './src/pages/Bucket';
import ScallopP from './src/pages/Scallop';
import Kriya from './src/pages/Kriya';
import Cetus from './src/pages/Cetus.js'
import Swap from './src/pages/Swap.js';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 0);

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}} >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="Cetus" component={Cetus} />
                <Stack.Screen name="Bucket" component={Bucket} />
                <Stack.Screen name="Scallop" component={ScallopP} />
                <Stack.Screen name="Kriya" component={Kriya} />
                <Stack.Screen name="FlowX" component={FlowX} />
                <Stack.Screen name="Swap" component={Swap} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
