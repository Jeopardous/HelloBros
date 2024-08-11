import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Svg, { Defs, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg'
import Animated, { Easing, interpolateColor, runOnJS, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { colors } from '../utils/colors'

const AnimatedPath = Animated.createAnimatedComponent(Path)
const size = 200
const cx = size / 2
const cy = size / 2
const strokeWidth = 20
const { PI, cos, sin } = Math
const r = (size - strokeWidth) / 2
const startAngle = PI + PI * 0.25
const endAngle = 2 * PI - PI * 0.25

const A = PI + 0.5 * PI
const x1 = cx - r * cos(startAngle)
const y1 = cy - r * sin(startAngle)
const x2 = cx - r * cos(endAngle)
const y2 = cy - r * sin(endAngle)
const d = `M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2}`

const SpeedoMeter = () => {
    const [title, setTitle] = useState("Low")
    const progress = useSharedValue(0);
    const circumference = r * A


    const animatedProps = useAnimatedProps(() => {
        const alpha = (progress.value / 100) * circumference;
        return {
            strokeDashoffset: -(circumference - alpha),
        };
    });
    const animateTxtStyle = useAnimatedStyle(() => {
        const color = interpolateColor(progress.value, [0, 50, 100], ["#49ff35", "#f3ff26", "#fd2020"]);
        return {
            color: color
        }
    });
    const animateIndicator = useAnimatedStyle(() => {
        const angle = (PI - 0.25 * PI) + (progress.value / 100) * A
        const x = Math.cos(angle) * r
        const y = Math.sin(angle) * r
        const movingCircleX = x + r
        const movingCircleY = y + r
        return {
            transform: [{ translateX: movingCircleX }, { translateY: movingCircleY }]
        }
    });
    const onChangeTitle = (val: any) => {
        if (val < 33) {
            setTitle("Low");
        } else if (val < 66) {
            setTitle("Medium")
        } else {
            setTitle("High");
        }
    }

    const handleAnimation = (value: number) => {
        progress.value = withTiming(value, { duration: 1000, easing: Easing.inOut(Easing.ease) }, () => {
            runOnJS(onChangeTitle)(progress.value)
        });
    }

    return (
        <View style={styles.container}>

            <View>
                <Animated.View style={[
                    styles.indicator,
                    animateIndicator
                ]}>
                    { }
                    <View style={[styles.innerIndicator]} />
                </Animated.View>
                <Svg width={size} height={size}>
                    <Path
                        fill={"none"}
                        stroke={"#e2e2e8"}
                        strokeDasharray={`${circumference}${circumference}`}
                        {...{ d, strokeWidth }}
                        strokeLinecap='round'
                    >
                    </Path>
                    <AnimatedPath
                        fill={"none"}
                        stroke={"url(#grad)"}
                        strokeDasharray={`${circumference}${circumference}`}
                        {...{ d, strokeWidth }}
                        animatedProps={animatedProps}
                        strokeLinecap='round'

                    >
                    </AnimatedPath>

                    <Defs>
                        <SvgLinearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
                            <Stop offset={"0"} stopColor={"green"} />
                            <Stop offset={"0.5"} stopColor={"yellow"} />
                            <Stop offset={"1"} stopColor={"red"} />
                        </SvgLinearGradient>
                    </Defs>

                </Svg>
                <Animated.Text style={[styles.text, animateTxtStyle]}>{title}</Animated.Text>

            </View>

            <TouchableOpacity onPress={() => handleAnimation(Math.floor(Math.random() * 101))}
                style={{
                    width: 120, height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                    backgroundColor: colors.primary
                }}
            >
                <Text style={{ color: colors.white, fontSize: 16, fontWeight: "bold" }}>Animate</Text>
            </TouchableOpacity>
        </View >
    )
}

export default SpeedoMeter

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black"
    },
    indicator: {
        width: strokeWidth,
        height: strokeWidth,
        borderRadius: strokeWidth,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
        backgroundColor: "white"
    },
    innerIndicator: {
        width: strokeWidth - 8,
        height: strokeWidth - 8,
        borderRadius: strokeWidth / 2,
        backgroundColor: "black",
    },
    text: {
        position: "absolute",
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
        alignSelf: "center",
        top: size / 2 - 20
    }
})