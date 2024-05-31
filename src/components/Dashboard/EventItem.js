import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const EventItem = memo(({ nft }) => {
  const { name, imageURL, description } = nft;

  return (
    <View style={styles.item}>
        <View style={styles.infoContainer}>
            <Text style={styles.description}>{description}</Text>
        </View>
        <Image
            style={styles.image}
            source={{ uri: imageURL || 'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg' }}
            contentFit="cover"
            transition={1000}
        />
        <View style={styles.infoContainer}>
            <Text style={styles.coinName}>{name}</Text>
        </View>
    </View>
  );
});

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 15,
        marginBottom: 10
    },
    item: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'column',
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
        alignItems: 'center'
    },
    coinName: {
        fontSize: 18,
        marginBottom: 5,
    },
    description: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    coinValue: {
        fontSize: 16,
        color: '#333',
    },
});

export default EventItem;