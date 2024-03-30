import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import NavigationActions from '../../navigation/NavigationActions'

const SignInScreen = () => {
    return (
        <View>
            <Text>SignInScreen</Text>
            <Button />
        </View>
    )
}

const Button = () => {
    return (
        <TouchableOpacity onPress={() => NavigationActions.goBack()} style={styles.button}>
            <Text style={{ color: "#fff" }}>Go Back</Text>
        </TouchableOpacity>
    )
}
export default SignInScreen

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