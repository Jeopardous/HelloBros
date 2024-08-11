import { Button, Dimensions, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';

const { height, width } = Dimensions.get("window")
interface Touch {
    absoluteX: number;
    absoluteY: number;
    id: number;
    [key: string]: any;
}

interface TimerProps {
    duration: number;
    onComplete: () => void;
}

interface CircleProps {
    x: number;
    y: number;
    isWinner: boolean;
    color: string;
}

interface FingerTouchAreaProps {
    onTouch: (event: any) => void;
}

const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const FingerPicker: React.FC = () => {
    const [touches, setTouches] = useState<Touch[]>([]);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [winner, setWinner] = useState<Touch | null>(null);
    const [colors, setColors] = useState<{ [key: number]: string }>({});

    const handleTouch = (event: any) => {
        const newTouches = event?.allTouches || [];
        const newColors = { ...colors };

        newTouches.forEach((touch: Touch) => {
            if (!newColors[touch.id]) {
                newColors[touch.id] = getRandomColor();
            }
        });

        setTouches(newTouches);
        setColors(newColors);
    };

    const startGame = () => {
        setIsTimerRunning(true);
    };

    const handleTimerComplete = () => {
        if (touches.length > 0) {
            const randomIndex = Math.floor(Math.random() * touches.length);
            setWinner(touches[randomIndex]);
        }
        setIsTimerRunning(false);
    };

    const resetGame = () => {
        setTouches([]);
        setIsTimerRunning(false);
        setWinner(null);
        setColors({});
    };

    return (
        <View style={styles.container}>
            <View style={styles.gameArea}>
                <FingerTouchArea onTouch={handleTouch} />
                {!isTimerRunning && touches.length < 2 && <Text style={styles.startTxt}>Put Your Fingers Here To Play</Text>}
                {isTimerRunning && <Timer duration={5} onComplete={handleTimerComplete} />}
            </View>
            {touches.map((touch, index) => (
                <Circle key={index} x={touch.absoluteX || 50} y={touch.absoluteY || 50} isWinner={winner === touch} color={colors[touch.id]} />
            ))}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.startButton}
                    disabled={touches.length < 2} onPress={startGame}
                >
                    <Text style={styles.buttonTxt}>START GAME</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={resetGame}
                >
                    <Text style={styles.buttonTxt}>RESET GAME</Text>
                </TouchableOpacity>



            </View>
        </View>
    );
}

const Timer: React.FC<TimerProps> = ({ duration, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const scaleValue = useSharedValue(1);
    const opacityValue = useSharedValue(0);

    useEffect(() => {
        if (timeLeft === 0) {
            onComplete();
            return;
        }

        const intervalId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [timeLeft, onComplete]);


    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scaleValue.value }],
        opacity: opacityValue.value
    }));

    useEffect(() => {
        scaleValue.value = withSequence(
            withTiming(10, { duration: 500 }),
            withTiming(1, { duration: 500 })
        );
        opacityValue.value = withSequence(
            withTiming(1, { duration: 500 }),
            withTiming(0, { duration: 500 })
        );
    }, [timeLeft]);

    return (
        <Animated.Text style={[styles.timer, animatedStyle]}>
            {timeLeft}
        </Animated.Text>
    );
};

const Circle: React.FC<CircleProps> = ({ x, y, isWinner, color }) => {

    const rotate = useSharedValue(0)
    const largeCircle = 30
    const renderCircles = (distance: number, radius: number) => {
        const smallCircle = radius
        const numOfCircles = Math.floor((2 * Math.PI * largeCircle) / (2 * smallCircle * 1.2))

        let circles = []
        for (let i = 0; i < numOfCircles; i++) {
            const angle = (2 * Math.PI * i) / numOfCircles
            const x = Math.cos(angle) * (largeCircle + distance)
            const y = Math.sin(angle) * (largeCircle + distance)

            circles.push(
                <View key={i} style={[{
                    left: x - smallCircle + largeCircle,
                    top: y - smallCircle + largeCircle,
                    backgroundColor: color,
                    width: 2 * smallCircle,
                    height: 2 * smallCircle,
                    borderRadius: smallCircle,
                    position: "absolute"
                }]}>

                </View>
            )

        }
        return circles
    }


    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotate.value}rad` }]
    }))
    useEffect(() => {
        if (isWinner) {
            rotate.value = withRepeat(withTiming(2 * Math.PI, {
                duration: 1000,
                easing: Easing.linear
            }), -1, false)
        }
    }, [isWinner])


    return (
        <Animated.View style={[styles.circle, {
            left: x - largeCircle, top: y - largeCircle,
            backgroundColor: isWinner ? 'green' : color,
            width: 2 * largeCircle,
            height: 2 * largeCircle,
            borderRadius: largeCircle,
        }, isWinner && animatedStyle]} >
            {renderCircles(10, 6)}
            {renderCircles(25, 4)}
            {renderCircles(35, 2)}

            {isWinner && <Text>🏆</Text>}
        </Animated.View>
    );
};

const FingerTouchArea: React.FC<FingerTouchAreaProps> = ({ onTouch }) => {
    const panGesture = Gesture.Pan()
        .minPointers(1)
        .onTouchesDown((event) => {
            runOnJS(onTouch)(event);
        });

    return (
        <GestureHandlerRootView style={{ width: "100%", height: "100%" }}>
            <GestureDetector gesture={panGesture}>
                <View style={styles.touchArea} />
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    gameArea: {
        width: '100%',
        height: height * 0.8,
        justifyContent: 'center',
    },
    buttonContainer: {
        width: "100%",
        height: height * 0.2,
        backgroundColor: "black"
    },
    timer: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "white",
        position: "absolute",
        top: height * 0.8 / 2,
        left: width / 2,
    },
    circle: {
        position: 'absolute',
        justifyContent: "center",
        alignItems: "center",
    },
    touchArea: {
        flex: 1,
        backgroundColor: 'black',
    },
    startButton: {
        backgroundColor: "#A6A867",
        borderRadius: 5,
        margin: 10,
        width: '80%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#ffffff",
        shadowOffset: {
            height: 3,
            width: 3
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        alignSelf: 'center',
    },
    resetButton: {
        backgroundColor: "#FF0000",
        borderRadius: 5,
        margin: 10,
        width: '80%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#ffffff",
        shadowOffset: {
            height: 3,
            width: 3
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        alignSelf: 'center',
    },
    buttonTxt: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    startTxt: {

        position: "absolute", zIndex: 5,
        color: "#007CBE",
        alignSelf: "center",
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,

    }
});

export default FingerPicker;
