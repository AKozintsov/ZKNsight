import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/pages/Login';
import Dashboard from './src/pages/Dashboard';
import Protocols from './src/pages/Protocols';
import FlowX from './src/pages/FlowX';
import Bucket from './src/pages/Bucket';
import Scallop from './src/pages/Scallop';
import Kriya from './src/pages/Kriya';
import Cetus from './src/pages/Cetus.js'

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}} >
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="Protocols" component={Protocols} />
                <Stack.Screen name="Cetus" component={Cetus} />
                <Stack.Screen name="Bucket" component={Bucket} />
                <Stack.Screen name="Scallop" component={Scallop} />
                <Stack.Screen name="Kriya" component={Kriya} />
                <Stack.Screen name="FlowX" component={FlowX} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
