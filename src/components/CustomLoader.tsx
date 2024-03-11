import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
    withSequence,
    withDelay,
    withRepeat,
} from 'react-native-reanimated';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CustomLoader = () => {
    const progress1 = useSharedValue(0);
    const progress2 = useSharedValue(0);
    const progress3 = useSharedValue(0);
    const progress4 = useSharedValue(0);
    const progressLeft1 = useSharedValue(0);
    const progressLeft2 = useSharedValue(0);
    const progressLeft3 = useSharedValue(0);



    const animatedStyle1 = useAnimatedStyle(() => {
        const radius = 50;
        const initialAngle = Math.PI / 2;
        const angle = initialAngle + progress1.value * 2 * Math.PI;
        const translateX = radius * Math.cos(angle);
        const translateY = radius * Math.sin(angle);
        return {
            transform: [{ translateX: translateX }, { translateY: translateY }],
            backgroundColor: 'blue',
        };
    });

    const animatedStyle2 = useAnimatedStyle(() => {
        const radius = 50;
        const initialAngle = Math.PI / 2;
        const left = interpolate(progressLeft1.value, [0, 1], [30, 0]);
        const angle = initialAngle + progress2.value * 2 * Math.PI;
        const translateX = radius * Math.cos(angle);
        const translateY = radius * Math.sin(angle);
        return {
            transform: [{ translateX: translateX + left }, { translateY: translateY }],
            backgroundColor: 'red',
        };
    });
    const animatedStyle3 = useAnimatedStyle(() => {
        const radius = 50;
        const initialAngle = Math.PI / 2;
        const left = interpolate(progressLeft2.value, [0, 1], [60, 0]);
        const angle = initialAngle + progress3.value * 2 * Math.PI;
        const translateX = radius * Math.cos(angle);
        const translateY = radius * Math.sin(angle);
        return {
            transform: [{ translateX: translateX + left }, { translateY: translateY }],
            backgroundColor: 'yellow',
        };
    });


    const startAnimation = () => {

        progress1.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.linear }), 5, false)
        progressLeft1.value = withTiming(1, { duration: 100, easing: Easing.linear })
        progress2.value = withDelay(100, withRepeat(withTiming(1, { duration: 2000, easing: Easing.linear }), 5, false))
        progressLeft2.value = withTiming(1, { duration: 200, easing: Easing.linear })
        progress3.value = withDelay(200, withRepeat(withTiming(1, { duration: 2000, easing: Easing.linear }), 5, false))
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.circle}>
                    <Animated.View style={[styles.dot, animatedStyle1]} />
                    <Animated.View style={[styles.dot, animatedStyle2]} />
                    <Animated.View style={[styles.dot, animatedStyle3]} />

                </View>

            </View>
            <TouchableOpacity onPress={() => startAnimation()} style={styles.button}>
                <Text style={styles.btnTxt}> Start Animation</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CustomLoader;

const styles = StyleSheet.create({
    container: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    dot: {
        position: "absolute",
        width: 20,
        height: 20,
        borderRadius: 20,
        left: 40
    },
    circle: {
        width: 100, height: 100, borderRadius: 50, borderWidth: 1,
        justifyContent: "center", alignItems: "center"
    },
    button: {
        width: wp(80),
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
        borderRadius: 60,
    },
    btnTxt: {
        fontWeight: "bold",
        color: "#ffffff",
        fontSize: 16
    }
});
