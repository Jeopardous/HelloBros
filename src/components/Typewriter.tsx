import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedProps, withTiming, withSequence, withRepeat, interpolate, Easing, withDelay, runOnJS } from 'react-native-reanimated';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
interface TypewriterProps {
    text: string;
}

const Dot = ({ value, onCompleteTyping }: { value: number, onCompleteTyping: () => void }) => {
    const dot = useSharedValue(0)
    useEffect(() => {
        const total = 1000;
        const bump = 250;

        dot.value = withRepeat(
            withSequence(
                withDelay(bump * value, withTiming(1, {
                    duration: bump,
                    easing: Easing.linear,
                })),
                withTiming(0, {
                    duration: bump,
                    easing: Easing.linear,
                }),

                withDelay(total - bump * 2 - bump * value, withTiming(0, {
                    duration: bump,
                    easing: Easing.linear,
                })),
            ),
            3,
            true, () => {
                runOnJS(onCompleteTyping)()
            }
        );

    }, [])
    const animatedDotStyle = useAnimatedStyle(() => {
        const translateY = interpolate(dot.value, [0, 1], [0, -10])
        return {
            transform: [{ translateY: translateY }]
        }
    })
    return <Animated.View style={[styles.dot, animatedDotStyle]} />;
};
const Typewriter: React.FC<TypewriterProps> = ({ text }) => {

    const [animatedText, setAnimatedText] = useState("")

    const typingWidth = useSharedValue(20)
    const [typing, setTyping] = useState(true)



    const onTypingDone = () => {
        typingWidth.value = withTiming(80, { duration: 400, easing: Easing.linear })
        setTyping(false)
        animateText(text, 30)
    }
    const animateText = (text: string, speed: number) => {
        let currentIndex = 0;
        let lastTime = 0;

        const updateText = (currentTime: number) => {
            if (currentTime - lastTime > speed) {
                setAnimatedText(text.slice(0, currentIndex));
                currentIndex++;
                lastTime = currentTime;
            }

            if (currentIndex <= text.length) {
                requestAnimationFrame(updateText);
            }
        };

        updateText(0);
    };

    const animatedTypingView = useAnimatedStyle(() => {
        return {
            width: `${typingWidth.value}%`
        }
    })

    useEffect(() => {
        // animateText(text)

    }, [])


    return (
        <View>

            <Animated.View style={[styles.typingView, animatedTypingView]}>
                {typing ?
                    <View style={styles.dotContainer}>
                        {[0, 1, 2].map((value) => (
                            <Dot key={value} value={value} onCompleteTyping={onTypingDone} />
                        ))}
                    </View> :
                    <Text style={[styles.text]}>
                        {animatedText}
                    </Text>}

            </Animated.View>

        </View>

    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        fontFamily: 'Arial',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typingView: {
        borderRadius: hp(2),
        backgroundColor: "#ffffff",
        shadowColor: '#3E3C49',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        marginLeft: wp(4),
        padding: 15,
        marginVertical: hp(2)
    },
    dotContainer: {
        flexDirection: 'row',
        borderRadius: hp(2),

    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 5,
        backgroundColor: 'grey',
        marginHorizontal: 5,
    },

});

export default Typewriter;


