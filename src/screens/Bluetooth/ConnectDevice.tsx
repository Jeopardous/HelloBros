import { FlatList, Image, NativeEventEmitter, NativeModules, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import BleManager from 'react-native-ble-manager';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { colors } from '../../utils/colors';
import { fonts, fontSize } from '../../utils/fonts';
import RippleEffect from '../../components/RippleEffect';
import { HUMIDITY_UUID, TEMPERATURE_UUID } from './BleConstants';
const ConnectDevice = () => {
    const [bluetoothDevices, setBluetoothDevices] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const BleManagerModule = NativeModules.BleManager;
    const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);
    const [currentDevice, setCurrentDevice] = useState(null)
    const [temperature, setTemperature] = useState<string | null>(null);
    const [humidity, setHumidity] = useState<string | null>(null);
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
        // startScanning()
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

                readCharacteristicFromEvent(data)
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
        console.log("CONNECTED DEVICE:::", item)
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
            if (characteristicUUID === TEMPERATURE_UUID || characteristicUUID === HUMIDITY_UUID) {
                BleManager.startNotification(item.id, serviceUUID, characteristicUUID)
                    .then(() => {
                        console.log('Notification started for characteristic:', characteristicUUID);
                    })
                    .catch(error => {
                        console.error('Notification error:', error);
                    });
            }

        })

    }

    const readCharacteristicFromEvent = (data: any) => {
        const { characteristic, value } = data;

        if (characteristic === TEMPERATURE_UUID) {
            const temperature = bytesToString(value);
            setTemperature(temperature);
            console.log('Temperature:', temperature);
        } else if (characteristic === HUMIDITY_UUID) {
            const humidity = bytesToString(value);
            setHumidity(humidity);
            console.log('Humidity:', humidity);
        }

    };
    const readCharacteristic = (characteristicUUID: any, serviceUUID: any, item: any) => {
        console.log("CURRENT DEVICE ID:::", item?.id)

        BleManager.read(item.id, serviceUUID, characteristicUUID)
            .then(result => {
                if (characteristicUUID === "2a01") {
                    console.log("CHARACTERISTIC " + characteristicUUID, result)
                    extractDeviceName(result)
                }
            })
            .catch(error => {
                console.error('Error during BLE read:', error);
            });


    };

    const extractDeviceName = (valueArray: any) => {
        const deviceName = bytesToString(valueArray);
        console.log("DEVICE NAME:::", deviceName)
    };

    const bytesToString = (bytes: any) => {
        return String.fromCharCode(...bytes);
    };


    const calculateDistance = (rssi: number) => {
        const txPower = -59; // Adjust this value based on your device's TX power
        if (rssi === 0) {
            return -1.0;
        }

        const ratio = rssi * 1.0 / txPower;

        console.log("RATIO::::", ratio)
        if (ratio < 1.0) {
            console.log("RATIO<1::::", ratio, Math.pow(ratio, 10))

            return Math.pow(ratio, 10);
        } else {
            const distance = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
            return distance;
        }
    };
    const renderItem = ({ item, index }: any) => {
        console.log("BLE ITEM:::", JSON.stringify(item))
        return (
            <View>
                <View style={styles.bleCard}>
                    <Text style={styles.nameTxt}>{item.name}</Text>
                    <TouchableOpacity onPress={() => item.id === currentDevice?.id ? onDisconnect() : onConnect(item, index)} style={styles.button}>
                        <Text style={styles.btnTxt}>{item.id === currentDevice?.id ? "Disconnect" : "Connect"}</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text>{`Proximity Distance: ${calculateDistance(item.rssi).toFixed(2)}`}</Text>
                </View>


            </View>

        )
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.fullRow}>
                <View style={styles.tempCard}>
                    <Text style={styles.label}>Temperature</Text>
                    <Image style={styles.icon} source={require('../../assets/images/temperature.png')} />
                    <Text style={styles.label}>{temperature ? temperature : 'N/A'} °C</Text>
                </View>
                <View style={styles.tempCard}>
                    <Text style={styles.label}>Humidity</Text>
                    <Image style={styles.icon} source={require('../../assets/images/humidity.png')} />
                    <Text style={styles.label}>{humidity ? humidity : 'N/A'} %</Text>
                </View>
            </View>
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



            <TouchableOpacity onPress={() => startScanning()} style={styles.scanBtn}>
                <Text style={styles.btnTxt}>Start Scan</Text>
            </TouchableOpacity>
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
    },
    label: {
        fontSize: 20,
        textAlign: 'center',
        color: colors.text,
        fontFamily: fonts.bold,
    },
    icon: {
        width: 60,
        height: 60,
        resizeMode: "contain",
        marginVertical: hp(2)
    },
    tempCard: {
        width: wp(45),
        backgroundColor: colors.secondary,
        elevation: 2,
        paddingVertical: hp(1.5),
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    fullRow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: hp(2)
    },
    scanBtn: {
        width: "90%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.primary,
        borderRadius: 5,
        alignSelf: "center",
        marginBottom: hp(2)
    }
})