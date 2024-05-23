// Dashboard.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Dashboard({ route }) {
    const { email, address } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Wallet Address:</Text>
            <Text style={styles.value}>{address}</Text>
            <Text style={styles.label}>Google Email:</Text>
            <Text style={styles.value}>{email}</Text>
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
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
    value: {
        fontSize: 16,
        marginTop: 10,
    },
});
