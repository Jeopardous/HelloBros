import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Animated, { AnimatedRef, Extrapolation, interpolate, SharedValue, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { FlatList } from 'react-native-gesture-handler';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
const { width, height } = Dimensions.get("window");

const CARD_WIDTH = width;
const CARD_HEIGHT = height * 0.5

const SNAP_TO_INTERVAL = CARD_WIDTH + (width * 0.1);

const FixedSwipeCards = () => {
    const API_KEY = 'qAKxm4Le3SMk3JiPE7iY3Tq4y8253FOxQ0QzkXeKTqswZ9X6YxSdTzap';
    const SEARCH_QUERY = 'nature';
    const [listData, setListData] = useState<any>([]);
    const contentOffset = useSharedValue(0)
    const flatListRef = useRef<FlatList<any>>(null);
    const [listRendered, setListRendered] = useState(false);
    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await axios.get(`https://api.pexels.com/v1/search?per_page=9&query=${SEARCH_QUERY}`, {
                    headers: {
                        Authorization: API_KEY,
                    },
                });
                setListData(response.data.photos);

            } catch (error) {
                console.error('Error fetching photos:', error);
            }
        };
        fetchPhotos();
    }, []);

    const scrollToMiddleItem = () => {
        if (listData.length > 0 && flatListRef.current) {
            const initialIndex = Math.floor(listData.length / 2);
            const initialOffset = initialIndex * CARD_WIDTH;
            flatListRef.current.scrollToOffset({ offset: initialOffset, animated: false });
        }
    };
    useEffect(() => {
        scrollToMiddleItem();
    }, [listData]);


    const renderCards = ({ item, index }: any) => {
        return <CardView item={item} index={index} contentOffset={contentOffset} />;
    };

    return (
        <View style={styles.container}>
            {listData && listData.length > 0 && (
                <FlatList
                    ref={flatListRef}
                    data={listData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderCards}
                    snapToInterval={width}
                    decelerationRate={0}
                    bounces={false}
                    horizontal
                    scrollEventThrottle={16}
                    onScroll={(event) => {
                        contentOffset.value = event.nativeEvent.contentOffset.x
                    }}

                />
            )}


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",

    },
    card: {


    },
    image: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        resizeMode: "cover",

    },
    listView: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    }
});

const CardView = ({ item, index, contentOffset }: { item: any; index: number; contentOffset: SharedValue<number> }) => {

    console.log("item?.src?.original", item?.src?.original)
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 1) * (CARD_WIDTH),
            (index) * (CARD_WIDTH),
            (index + 1) * (CARD_WIDTH)
        ];

        const outputRange = [
            -CARD_WIDTH * 0.9,
            0,
            CARD_WIDTH * 0.9
        ];

        const translateX = interpolate(contentOffset.value, inputRange, outputRange, Extrapolation.CLAMP);

        return {
            transform: [{ translateX }],
        };


    });



    return (

        <View style={{
            shadowOffset: {
                height: 10,
                width: 2
            },
            shadowColor: "#000000",
            shadowOpacity: 0.1,
            padding: 5,
            backgroundColor: "#ffffff"

        }}>
            <View style={[
                {
                    width: CARD_WIDTH - 10, height: CARD_HEIGHT, overflow: "hidden",
                    backgroundColor: "white",
                    alignItems: "center",
                    borderRadius: 10,
                    borderWidth: 0,
                    borderColor: "white"
                }
            ]}>
                <Animated.Image
                    source={{ uri: item?.src?.original }}
                    style={[styles.image, animatedStyle]} />
            </View>
        </View>



    );
}

export default FixedSwipeCards;
