import { View, Text } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { NavigationContainer, NavigationContainerRef, ParamListBase } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignUpScreen from '../screens/auth/SignUpScreen'
import SignInScreen from '../screens/auth/SignInScreen'
import NavigationActions from './NavigationActions'
import ChatBot from '../screens/chat/ChatBot'

const RootNavigator = () => {
    const Stack = createNativeStackNavigator()
    const navigationRef = useRef<NavigationContainerRef<ParamListBase>>(null)

    useEffect(() => {
        NavigationActions.setNavigationRef(navigationRef.current)

    }, [])
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName='ChatBot' screenOptions={{ headerShown: false }}>
                <Stack.Screen name='SignUp' component={SignUpScreen}></Stack.Screen>
                <Stack.Screen name='SignIn' component={SignInScreen}></Stack.Screen>
                <Stack.Screen name='ChatBot' component={ChatBot}></Stack.Screen>

            </Stack.Navigator>

        </NavigationContainer>
    )
}

export default RootNavigator