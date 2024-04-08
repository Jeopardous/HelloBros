import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { colors } from '../../utils/colors';
import { useTranslation } from 'react-i18next';
import { fonts, fontSize } from '../../utils/fonts';
import CustomInput from '../../components/CustomInput';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { height } = Dimensions.get("window")

interface BottomSheetProps {
    onToggle: () => void
}
const SignInScreen: React.FC<BottomSheetProps> = ({ onToggle }) => {
    const { t } = useTranslation()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const offset = useSharedValue(height)

    const translateY = useAnimatedStyle(() => ({
        transform: [{
            translateY: offset.value
        }]
    }))

    const pan = Gesture.Pan().onChange((event) => {
        const offsetDelta = event.changeY + offset.value
        const clamp = 100
        offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp)
    }).onFinalize(() => {
        if (offset.value < height / 5) {
            offset.value = withSpring(0)
        } else {
            runOnJS(onToggle)()

        }
    })

    useEffect(() => {
        startAnimation()
    }, [])

    const startAnimation = () => {
        offset.value = withTiming(0, { duration: 500 })
    }

    return (
        <GestureDetector gesture={pan}>
            <Animated.View style={[styles.bottomSheet, translateY]}>
                <View style={styles.sheetHeader}>
                    <Text style={styles.headerTxt}> {t("signin-account")}</Text>
                </View>
                <CustomInput
                    value={email}
                    onChangeText={value => setEmail(value)}
                    label={t("email")}
                    leftIcon={require("../../assets/images/mail.png")}
                    type={"input"}

                />
                <CustomInput
                    value={password}
                    onChangeText={value => setPassword(value)}
                    label={t("password")}
                    leftIcon={require("../../assets/images/lock.png")}
                    type={"password"}
                    showPassword={require("../../assets/images/show_eye.png")}
                    hidePassword={require("../../assets/images/hide_eye.png")}

                />

                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.buttonPrimary}>
                        <Text style={styles.signinTxt}>{t("continue")}</Text>
                    </TouchableOpacity>
                </View>

            </Animated.View>
        </GestureDetector>

    )
}

export default SignInScreen

const styles = StyleSheet.create({
    bottomSheet: {
        width: wp(100),
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: wp(5),
        paddingVertical: hp(2),
        elevation: Platform.OS === "android" ? 10 : 0,
        shadowOffset: {
            width: 0, height: 2
        },
        shadowColor: "#3E3C49",
        shadowOpacity: 0.3,
        shadowRadius: 8

    },
    sheetHeader: {
        width: wp(90),
        height: hp(5),
        justifyContent: "center",

    },
    headerTxt: {
        color: colors.primary,
        alignSelf: "center",
        fontFamily: fonts.bold,
        fontSize: fontSize.font16
    },
    buttonPrimary: {
        width: wp(40),
        height: hp(6),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.primary,
        borderRadius: 5,
        alignSelf: "center",

    },
    signinTxt: {
        color: colors.white,
        alignSelf: "center",
        fontFamily: fonts.bold,
        fontSize: fontSize.font16
    },
    buttonView: {
        paddingVertical: hp(4)
    }
})