import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../utils/colors';
import { fonts, fontSize } from '../../utils/fonts';
import SignInScreen from './SignInScreen';
const AuthScreen = () => {
    const animationRef = useRef<LottieView>(null)
    const { t } = useTranslation()
    const [isSignIn, setIsSignIn] = useState(false)
    const [speed, setSpeed] = useState(1)
    const onSignIn = () => {
        setIsSignIn(true)
        setSpeed(1)
        animationRef.current?.play()
    }
    const onToggle = () => {
        setIsSignIn(false)
        setSpeed(-1)
        animationRef.current?.play()
    }
    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <LottieView
                    ref={animationRef}
                    source={require('../../utils/handshake.json')}
                    autoPlay={false}
                    loop={false}
                    style={styles.lottieView}
                    speed={speed}
                />
            </View>
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => onSignIn()} style={styles.buttonPrimary}>
                    <Text style={styles.signinTxt}>{t("signin")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSec}>
                    <Text style={styles.signupTxt}>{t("signup")}</Text>
                </TouchableOpacity>

            </View>

            {isSignIn && <SignInScreen onToggle={onToggle} />}

        </View>
    )
}

export default AuthScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    body: {
        width: wp(100),
        height: hp(50),
    },
    lottieView: {
        width: "100%",
        height: "100%"
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        position: "absolute",
        bottom: hp(8),
        width: wp(100),
    },
    buttonPrimary: {
        width: wp(40),
        height: hp(6),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.primary,
        borderRadius: 5

    },
    buttonSec: {
        width: wp(40),
        height: hp(6),
        justifyContent: "center",
        alignItems: "center",
        borderColor: colors.primary,
        borderRadius: 5,
        borderWidth: 2

    },
    signinTxt: {
        color: colors.white,
        alignSelf: "center",
        fontFamily: fonts.bold,
        fontSize: fontSize.font16
    },
    signupTxt: {
        color: colors.primary,
        alignSelf: "center",
        fontFamily: fonts.bold,
        fontSize: fontSize.font16
    },

})