import React, { ReactNode, useEffect } from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import Animated, { Easing, interpolateColor, runOnJS, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Defs, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const { PI, cos, sin } = Math;
interface GaugeProps {
    size?: number;
    strokeWidth?: number;
    startAngle?: number;
    endAngle?: number;
    percentage?: number;
    gradientColors?: string[];
    indicator?: boolean;
    title?: string;
    onEndAnimation?: (val: any) => void;
    titleStyle?: TextStyle;
    containerStyle?: ViewStyle;
    indicatorViewStyle?: ViewStyle;
    indicatorInnerViewStyle?: ViewStyle;
    children?: ReactNode;
}

const degreesToRadians = (degrees: number) => degrees * (PI / 180);
const Gauge: React.FC<GaugeProps> = ({
    size = 200,
    strokeWidth = 20,
    startAngle = Math.PI + Math.PI * 0.25,
    endAngle = 2 * Math.PI - Math.PI * 0.25,
    percentage = 0,
    gradientColors = ["#49ff35", "#f3ff26", "#fd2020"],
    indicator = true,
    title = "Low",
    onEndAnimation,
    titleStyle,
    containerStyle,
    indicatorViewStyle,
    indicatorInnerViewStyle,

}) => {

    const r = (size - strokeWidth) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const startAngleRadians = degreesToRadians(startAngle);
    const endAngleRadians = degreesToRadians(endAngle);
    const sharedPercentage = useSharedValue(0);
    const A = startAngleRadians - endAngleRadians
    const x1 = cx - r * cos(startAngleRadians);
    const y1 = -r * sin(startAngleRadians) + cy;
    const x2 = cx - r * cos(endAngleRadians);
    const y2 = -r * sin(endAngleRadians) + cy;
    const d = `M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2}`;
    const circumference = r * A;

    console.log("PATH::", d)

    const defaultIndicator = {
        width: strokeWidth,
        height: strokeWidth,
        borderRadius: strokeWidth / 2,
        backgroundColor: "white",
        ...styles.indicator,
        ...indicatorViewStyle
    }
    const defaultInnerIndicator = {
        width: strokeWidth - 8,
        height: strokeWidth - 8,
        borderRadius: strokeWidth / 2,
        backgroundColor: "black",
        ...indicatorInnerViewStyle
    }



    const animatedProps = useAnimatedProps(() => {
        const alpha = (sharedPercentage.value / 100) * circumference;
        return {
            strokeDashoffset: -(circumference - alpha),
        };
    });

    const animateTxtStyle = useAnimatedStyle(() => {
        const color = interpolateColor(sharedPercentage.value, [0, 50, 100], ["#49ff35", "#f3ff26", "#fd2020"]);
        return {
            color: color
        }
    });

    const animateIndicator = useAnimatedStyle(() => {
        const angle = (PI + endAngleRadians) + (sharedPercentage.value / 100) * A
        const x = Math.cos(angle) * r
        const y = Math.sin(angle) * r
        const movingCircleX = x + r
        const movingCircleY = y + r
        return {
            transform: [{ translateX: movingCircleX }, { translateY: movingCircleY }]
        }
    });

    useEffect(() => {
        sharedPercentage.value = withTiming(percentage, { duration: 1000, easing: Easing.inOut(Easing.ease) }, () => {
            runOnJS(handleEndAnimation)(sharedPercentage.value)
        });
    })

    const handleEndAnimation = (val: number) => {
        if (onEndAnimation) {
            onEndAnimation(val);
        }
    };

    return (
        <View style={[{ width: size, height: size }, { ...containerStyle }]}>
            <View>
                {indicator && (
                    <Animated.View style={[
                        defaultIndicator,
                        animateIndicator,
                    ]}>
                        { }
                        <View style={[defaultInnerIndicator]} />
                    </Animated.View>
                )}

                <Svg width={size} height={size}>
                    <Path
                        stroke="#E2E2E8"
                        fill="none"
                        strokeDasharray={`${circumference}, ${circumference}`}
                        {...{ d, strokeWidth }}
                        strokeLinecap="round"
                    />
                    <AnimatedPath
                        stroke="url(#grad)"
                        fill="none"
                        strokeDasharray={`${circumference}, ${circumference}`}
                        animatedProps={animatedProps}
                        {...{ d, strokeWidth }}
                        strokeLinecap="round"
                    />
                    <Defs>
                        <SvgLinearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
                            {gradientColors.map((color, index) => (
                                <Stop key={index} offset={`${index / (gradientColors.length - 1)}`} stopColor={color} />
                            ))}
                        </SvgLinearGradient>
                    </Defs>

                </Svg>
            </View>
            <Animated.Text style={[styles.text, { ...titleStyle }, animateTxtStyle]}>{title}</Animated.Text>
        </View>
    );
};

export default Gauge;

const styles = StyleSheet.create({
    container: {

    },
    indicator: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1
    },
    text: {
        position: "absolute",
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
        alignSelf: "center",
    }
});
