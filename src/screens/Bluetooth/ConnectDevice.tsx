import { FlatList, NativeEventEmitter, NativeModules, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import BleManager from 'react-native-ble-manager';
import { colors } from '../../utils/colors';
import { fonts, fontSize } from '../../utils/fonts';
import RippleEffect from '../../components/RippleEffect';
const ConnectDevice = () => {
    const [bluetoothDevices, setBluetoothDevices] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const BleManagerModule = NativeModules.BleManager;
    const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);
    const [currentDevice, setCurrentDevice] = useState(null)

    useEffect(() => {
        BleManager.enableBluetooth().then(() => {
            console.log('Bluetooth is turned on!');
        });
        requestPermission();

        return () => { };
    }, []);

    useEffect(() => {
        BleManager.start({ showAlert: false }).then(() => {
            console.log('BleManager initialized');
        });
    }, []);

    const requestPermission = async () => {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE);
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        startScanning()
    };

    const startScanning = () => {
        if (!isScanning) {
            BleManager.scan([], 10, true)
                .then(() => {
                    console.log('Scan is started.....');

                    setIsScanning(true);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    useEffect(() => {
        let stopListener = BleManagerEmitter.addListener(
            'BleManagerStopScan',
            () => {
                setIsScanning(false);
                console.log('Scan is stopped');
                handleGetConnectedDevices();
            },
        );

        let disconnected = BleManagerEmitter.addListener(
            'BleManagerDisconnectPeripheral',
            peripheral => {
                console.log('Disconnected Device', peripheral);
            },
        );

        let characteristicValueUpdate = BleManagerEmitter.addListener(
            'BleManagerDidUpdateValueForCharacteristic',
            data => {
                // Handle received data
                // bleServices.onCharacteristicChanged(data);
                console.log('BleManagerDidUpdateValueForCharacteristic Event!', data);
            },
        );
        let BleManagerDidUpdateState = BleManagerEmitter.addListener(
            'BleManagerDidUpdateState',
            data => {
                // Handle received data
                console.log('BleManagerDidUpdateState Event!', data);
            },
        );

        return () => {
            stopListener.remove();
            disconnected.remove();
            characteristicValueUpdate.remove();
            BleManagerDidUpdateState.remove();
        };
    }, [bluetoothDevices]);

    const handleGetConnectedDevices = () => {
        BleManager.getDiscoveredPeripherals().then((results: any) => {
            if (results.length == 0) {
                console.log('No connected bluetooth devices');
                startScanning();
            } else {
                const allDevices = results.filter((item: any) => item.name !== null)
                setBluetoothDevices(allDevices)
            }
        });
    };

    const onConnect = async (item: any, index: number) => {
        try {
            await BleManager.connect(item.id);
            console.log('Connected');
            setCurrentDevice(item)

            const res = await BleManager.retrieveServices(item.id);
            console.log("RES::::", JSON.stringify(res))
            onServicesDiscovered(res, item)
        } catch (error) {
            // Failure code
            console.error(error);
        }
    };

    const onDisconnect = () => {
        BleManager.disconnect(currentDevice?.id).then(() => {
            setCurrentDevice(null)
        })
    }

    const onServicesDiscovered = (result: any, item: any) => {
        const services = result?.services;
        const characteristics = result?.characteristics;

        services.forEach((service: any) => {
            const serviceUUID = service.uuid;

            onChangeCharacteristics(serviceUUID, characteristics, item)
        });
    };

    const onChangeCharacteristics = (serviceUUID: any, result: any, item: any) => {
        console.log("SERVICE UUIDS:::", serviceUUID)
        // console.log("RESULT", result)
        result.forEach((characteristic: any) => {
            const characteristicUUID = characteristic.characteristic
            if (characteristicUUID === "00002a01-0000-1000-8000-00805f9b34fb") {
                readCharacteristic(characteristicUUID, serviceUUID, item)
            }

        })

    }

    const readCharacteristic = (characteristicUUID: any, serviceUUID: any, item: any) => {
        console.log("CURRENT DEVICE ID:::", item?.id)
        if (characteristicUUID === "2a01") {
            BleManager.read(
                item?.id,
                serviceUUID,
                characteristicUUID,
            )
                .then(result => {
                    console.log("CHARACTERISTIC " + characteristicUUID, result)
                    extractDeviceName(result)
                    // if (characteristicUUID === "2a00") {

                    // }

                })
                .catch(error => {
                    console.error('Error during BLE read:', error);
                });
            // } else {
            //     console.log("INSIDE ELSE")
        }


    };

    const extractDeviceName = (valueArray: any) => {
        const deviceName = bytesToString(valueArray);
        console.log("DEVICE NAME:::", deviceName)
    };

    const bytesToString = (bytes: any) => {
        return String.fromCharCode(...bytes);
    };


    const renderItem = ({ item, index }: any) => {
        return (
            <View style={styles.bleCard}>
                <Text style={styles.nameTxt}>{item.name}</Text>
                <TouchableOpacity onPress={() => item.id === currentDevice?.id ? onDisconnect() : onConnect(item, index)} style={styles.button}>
                    <Text style={styles.btnTxt}>{item.id === currentDevice?.id ? "Disconnect" : "Connect"}</Text>
                </TouchableOpacity>

            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {isScanning ? <View style={{
                flex: 1, justifyContent: "center",
                alignItems: "center"
            }}>
                <RippleEffect />
            </View> :

                <FlatList data={bluetoothDevices}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                />
            }
        </View>
    )
}

export default ConnectDevice

const styles = StyleSheet.create({
    bleCard: {
        width: "90%",
        padding: 10,
        alignSelf: "center",
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.secondary,
        elevation: 5,
        borderRadius: 5
    },
    nameTxt: {
        fontFamily: fonts.bold,
        fontSize: fontSize.font18,
        color: colors.text
    },
    button: {
        width: 100,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.primary,
        borderRadius: 5
    },
    btnTxt: {
        fontFamily: fonts.bold,
        fontSize: fontSize.font18,
        color: colors.white
    }
})