import React from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
export default class Map extends React.Component {
  constructor() {
    super();
    this.state = {
      markers: [
        {
          title: 'hello',
          coordinates: {
            latitude: 78.1351,
            longitude: 78.1351,
          },
        },
        {
          title: 'hello',
          coordinates: {
            latitude: 29.3732,
            longitude: 78.1351,
          },
        },
      ],
    };
  }
  render() {
    return (
      <MapView
        style={{flex: 1}}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        initialRegion={{
          latitude: 29.3732,
          longitude: 78.1351,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker coordinate={{latitude: 29.3732, longitude: 78.1351}} />
      </MapView>
    );
  }
}
