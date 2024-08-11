import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { interpolate, SensorType, useAnimatedSensor, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Defs, RadialGradient, Rect, Stop, Svg } from 'react-native-svg';
const { height, width } = Dimensions.get("window")
const GravityComponent = () => {


    const animatedSensor = useAnimatedSensor(SensorType.GRAVITY, {
        interval: 50
    })

    const animatedStyle = useAnimatedStyle(() => {
        const { x, y } = animatedSensor.sensor.value
        return {
            transform: [{ translateX: withSpring(x) }, { translateY: withSpring(y) }]
        }

    })

    const animatedInnerStyle = useAnimatedStyle(() => {
        const { x, y } = animatedSensor.sensor.value
        return {
            transform: [{ translateX: withSpring(x * 0.5) }, { translateY: withSpring(y * 0.5) }]
        }

    })
    const animatedShineStyle = useAnimatedStyle(() => {
        const { x, y } = animatedSensor.sensor.value
        return {
            left: interpolate(x, [-2, 2], [50, 100]),
            top: interpolate(y, [-10, 0], [-50, 100])

        }

    })

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>For ReactNative</Text>
                <View style={styles.categories}>
                    <Text style={styles.categoryText}>TV Shows</Text>
                    <Text style={styles.categoryText}>Movies</Text>
                    <Text style={styles.categoryText}>Categories</Text>
                </View>
            </View>
            <Animated.View style={[styles.mainContent, animatedStyle]}>
                <Animated.View style={[styles.shine, animatedShineStyle]}>
                    <Svg height={height * 0.55} width={width * 0.9}>
                        <Defs>
                            <RadialGradient id='gred' cx={"25%"} cy={"25%"} fx={"25%"} fy={"25%"} r={"25%"}>
                                <Stop offset={"0%"} stopColor={"rgba(255,255,255,0.5)"} stopOpacity={"0.2"} />
                                <Stop offset={"100%"} stopColor={"rgba(255,255,255,0)"} stopOpacity={"0"} />

                            </RadialGradient>
                        </Defs>
                        <Rect width={"100%"} height={"100%"} x={"0"} y={"0"} fill={'url(#gred)'} />

                    </Svg>

                </Animated.View>
                <Image
                    source={require('../assets/images/kalki.png')}
                    style={styles.mainImage}
                />
                <View style={styles.imageContentView}>
                    <Animated.View style={[styles.imageTxt, animatedInnerStyle]}>
                        <Text style={styles.title}>Kalki Avatar</Text>
                        <Text style={styles.subtitle}>Mythology • Fantasy • Adventure</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
                            <TouchableOpacity style={styles.playButton}>
                                <Text style={styles.playButtonText}>Play</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.myListButton}>
                                <Text style={styles.myListButtonText}>+ My List</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Animated.View>

            <View style={styles.mobileGames}>
                <Text style={styles.sectionTitle}>Mobile Games</Text>
                <ScrollView horizontal>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/100' }}
                        style={styles.gameImage}
                    />
                    <Image
                        source={{ uri: 'https://via.placeholder.com/100' }}
                        style={styles.gameImage}
                    />
                    <Image
                        source={{ uri: 'https://via.placeholder.com/100' }}
                        style={styles.gameImage}
                    />
                </ScrollView>
            </View>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3e3b47',
        paddingHorizontal: 10,
        paddingVertical: 40
    },
    header: {
        marginTop: 20,
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    categories: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    categoryText: {
        color: '#fff',
        marginRight: 20,
    },
    mainContent: {
        alignItems: 'center',
        marginVertical: 20,
        marginHorizontal: 20,
        overflow: "hidden",
        borderRadius: 10


    },
    mainImage: {
        width: '100%',
        height: height * 0.55,
        borderRadius: 10,
        resizeMode: "stretch",

    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    subtitle: {
        color: '#d3d3d3',
        fontSize: 14,
        marginBottom: 10,
    },
    playButton: {
        width: "43%",
        backgroundColor: '#fff',
        borderRadius: 5,
        marginVertical: 5,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    playButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    myListButton: {
        width: "43%",
        backgroundColor: '#6c757d',
        borderRadius: 5,
        marginVertical: 5,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    myListButtonText: {

        color: '#fff',
        fontWeight: 'bold',
    },
    mobileGames: {
        marginVertical: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    gameImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
    },
    imageContentView: {
        position: "absolute",
        bottom: -5,
        width: "100%",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingVertical: 15,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    imageTxt:
    {
        justifyContent: 'center',
        alignItems: 'center',
    },
    shine: {
        position: 'absolute',
        width: 100,
        height: 100,
        zIndex: 5
    }

});

export default GravityComponent;
