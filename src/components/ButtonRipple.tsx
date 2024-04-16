import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { measure, useAnimatedRef, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const ButtonRipple = () => {

    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const scale = useSharedValue(0)
    const boxWidth = useSharedValue(0)
    const boxHeight = useSharedValue(0)
    const opacity = useSharedValue(0.3)


    const boxRef = useAnimatedRef()

    const tap = Gesture.Tap().onStart((event) => {
        opacity.value = 0.4
        translateX.value = event.x
        translateY.value = event.y
        scale.value = 0
        scale.value = withTiming(1, { duration: 1000 })


        console.log("ON TAP", event)
    }).onFinalize(() => {
        console.log("ON onFinalize")
        opacity.value = withTiming(0, { duration: 1000 })
    })

    const animatedCircle = useAnimatedStyle(() => {
        const boxLayout = measure(boxRef)
        // console.log("BOX LAYOUT", boxLayout)

        if (boxLayout) {
            boxWidth.value = boxLayout.width,
                boxHeight.value = boxLayout.height
        }


        const radius = Math.sqrt(boxWidth.value ** 2 + boxHeight.value ** 2)
        const width = radius * 2
        const height = radius * 2



        return {
            width,
            height,
            borderRadius: radius,
            backgroundColor: colors.secondary,
            position: "absolute",
            top: 0,
            left: 0,
            opacity: opacity.value,
            transform: [{ translateX: translateX.value - radius }, { translateY: translateY.value - radius }, { scale: scale.value }]
        }

    })
    return (
        <GestureDetector gesture={tap}>
            <View style={styles.boxView}>
                <Animated.View ref={boxRef} style={styles.box}>
                    <Animated.View style={animatedCircle}>

                    </Animated.View>

                </Animated.View>
            </View>

        </GestureDetector>

    )
}

export default ButtonRipple

const styles = StyleSheet.create({
    boxView: {
        shadowColor: "#2c2c2c",
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    box: {
        width: 200,
        height: 200,
        backgroundColor: colors.primary,
        shadowOffset: {
            width: 0, height: 2
        },
        borderRadius: 10,
        overflow: "hidden"

    }
})