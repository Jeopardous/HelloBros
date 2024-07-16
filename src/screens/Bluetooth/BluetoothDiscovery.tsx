import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, PermissionsAndroid, ToastAndroid } from 'react-native';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

const BluetoothDiscovery = () => {
    const [devices, setDevices] = useState([]);
    const [discovering, setDiscovering] = useState(false);


    async function requestAccessFineLocationPermission() {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Access fine location required for discovery',
                message: 'In order to perform discovery, you must enable/allow fine location access.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    useEffect(() => {
        requestAccessFineLocationPermission();
    }, []);

    const startDiscovery = async () => {
        try {
            setDiscovering(true);
            const unpairedDevices = await RNBluetoothClassic.startDiscovery();
            console.log("UNPAIRED DEVICES")
            setDevices(unpairedDevices);

            ToastAndroid.show(`Found ${unpairedDevices.length} unpaired devices.`, ToastAndroid.SHORT);
        } catch (err) {
            ToastAndroid.show(err.message, ToastAndroid.SHORT);
        } finally {
            setDiscovering(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={{ padding: 10 }}>
            <Text>{item.name || 'Unnamed Device'}</Text>
            <Text>{item.address}</Text>
        </View>
    );

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Discover Devices" onPress={startDiscovery} disabled={discovering} />
            <FlatList
                data={devices}
                renderItem={renderItem}
                keyExtractor={(item) => item.address}
            />
        </View>
    );
};

export default BluetoothDiscovery;
