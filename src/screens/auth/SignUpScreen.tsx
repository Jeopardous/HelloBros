import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import NavigationActions from '../../navigation/NavigationActions'
import SwipeCards from '../../components/SwipeCards'
import FixedSwipeCards from '../../components/FixedSwipeCards'

const SignUpScreen = () => {
    return (
        <View style={{ flex: 1 }}>
            <FixedSwipeCards />
        </View>
    )
}
const Button = () => {
    return (
        <TouchableOpacity onPress={() => NavigationActions.navigate("SignIn")} style={styles.button}>
            <Text style={{ color: "#fff" }}>Next Screen</Text>
        </TouchableOpacity>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    button: {
        width: "80%",
        height: 60,
        borderRadius: 5,
        backgroundColor: "blue",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "baseline",
        marginTop: 20,
        marginLeft: "10%"
    }
})