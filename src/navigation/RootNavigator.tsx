import { View, Text } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { NavigationContainer, NavigationContainerRef, ParamListBase } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignUpScreen from '../screens/auth/SignUpScreen'
import SignInScreen from '../screens/auth/SignInScreen'
import NavigationActions from './NavigationActions'
import AuthScreen from '../screens/auth/AuthScreen'
import HomeScreen from '../screens/home/HomeScreen'
import ConnectDevice from '../screens/Bluetooth/ConnectDevice'
import BluetoothDiscovery from '../screens/Bluetooth/BluetoothDiscovery'

const RootNavigator = () => {
    const Stack = createNativeStackNavigator()
    const navigationRef = useRef<NavigationContainerRef<ParamListBase>>(null)

    useEffect(() => {
        NavigationActions.setNavigationRef(navigationRef.current)

    }, [])
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name='Connect' component={ConnectDevice}></Stack.Screen>

                {/* <Stack.Screen name='Descovery' component={BluetoothDiscovery}></Stack.Screen> */}

                {/* <Stack.Screen name='Connect' component={ConnectDevice}></Stack.Screen> */}

                <Stack.Screen name='Auth' component={AuthScreen}></Stack.Screen>
                <Stack.Screen name='SignUp' component={SignUpScreen}></Stack.Screen>
                {/* <Stack.Screen name='SignIn' component={SignInScreen}></Stack.Screen> */}
                <Stack.Screen name='Home' component={HomeScreen}></Stack.Screen>




            </Stack.Navigator>

        </NavigationContainer>
    )
}

export default RootNavigator