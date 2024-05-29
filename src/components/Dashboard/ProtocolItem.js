import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const ProtocolItem = ({ protocol }) => {
  const { project_name, categories, project_image_url } = protocol;

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri:
            project_image_url ||
            'https://as1.ftcdn.net/jpg/01/09/84/42/220_F_109844212_NnLGUrn3RgMHQIuqSiLGlc9d419eK2dX.jpg',
        }}
        contentFit="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.protocolName}>{project_name}</Text>
        <Text>{categories}</Text>
      </View>
    </View>
  );
};

ProtocolItem.propTypes = {
  protocol: PropTypes.shape({
    project_name: PropTypes.string.isRequired,
    categories: PropTypes.string.isRequired,
    project_image_url: PropTypes.string,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  protocolName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default ProtocolItem;