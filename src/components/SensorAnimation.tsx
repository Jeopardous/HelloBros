import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Animated, { SensorType, useAnimatedSensor, useAnimatedStyle, useDerivedValue, withSpring } from 'react-native-reanimated'



const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground)
const SensorAnimation = () => {

    const animatedSensor = useAnimatedSensor(SensorType.ROTATION, {
        interval: 50
    })



    const frontAnimatedStyle = useAnimatedStyle(() => {
        const { pitch, roll, yaw } = animatedSensor.sensor.value
        return {
            transform: [
                {
                    translateX: withSpring(-roll * 60)
                }, {
                    translateY: withSpring(-pitch * 60)
                }
            ]
        }
    })

    const backAnimatedStyle = useAnimatedStyle(() => {
        const { pitch, roll, yaw } = animatedSensor.sensor.value
        return {
            transform: [
                {
                    translateX: withSpring(roll * 50)
                }, {
                    translateY: withSpring(pitch * 50)
                }
            ]
        }
    })

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <AnimatedImageBackground style={[styles.backImage, backAnimatedStyle]}
                source={require('../assets/images/bg_image.jpeg')}>
                <Animated.Image style={[styles.frontImage, frontAnimatedStyle]}
                    source={require("../assets/images/front.png")} />

            </AnimatedImageBackground>
        </View>
    )
}

export default SensorAnimation

const styles = StyleSheet.create({
    backImage: {
        flex: 1,
        width: "130%",
        height: "120%",
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    frontImage: {
        position: "absolute",
        bottom: -50,
        width: "80%",
        height: "50%",
        resizeMode: "contain",
        justifyContent: "center",
        alignItems: "center",
    }
})