import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import {
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import { Svg } from 'react-native-svg';
const { width, height } = Dimensions.get("window")
// Omitting imports for brevity

const AnimatedSVG = Animated.createAnimatedComponent(Svg)

const SwipeCards = () => {
    const API_KEY = 'qAKxm4Le3SMk3JiPE7iY3Tq4y8253FOxQ0QzkXeKTqswZ9X6YxSdTzap';
    const CARD_WIDTH = width * 0.8
    const CARD_MARGIN = 5
    const EMPTY_CARD = (width - CARD_WIDTH) / 2 - CARD_MARGIN
    const SEARCH_QUERY = 'nature';
    const [listData, setListData] = useState<any>([])
    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await axios.get(`https://api.pexels.com/v1/search?per_page=9&query=${SEARCH_QUERY}`, {
                    headers: {
                        Authorization: API_KEY,
                    },
                });
                setListData([{ "left": true }, ...response.data.photos, { "right": true }])
            } catch (error) {
                console.error('Error fetching photos:', error);
            }
        };
        fetchPhotos();
    }, [])

    const scrollX = useSharedValue(0);

    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x
        },
    })



    const renderCards = ({ item, index }: any) => {
        return <CardView item={item} index={index} scrollX={scrollX} />

    }



    return (
        <View >
            {listData && listData.length > 0 && (
                <Animated.FlatList
                    data={listData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderCards}
                    snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
                    decelerationRate={0}
                    bounces={false}
                    horizontal
                    scrollEventThrottle={16}
                    onScroll={handleScroll}
                />
            )}

        </View>
    )
}

export default SwipeCards

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        height: hp(60),
        backgroundColor: "transparent",
        borderRadius: 10,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        borderRadius: 10,
    }
})


const CardView = ({ item, index, scrollX }: any) => {
    const CARD_WIDTH = width * 0.8
    const CARD_MARGIN = 5
    const EMPTY_CARD = (width - CARD_WIDTH) / 2 - CARD_MARGIN

    const animatedStyle = useAnimatedStyle(() => {
        const x = interpolate(scrollX.value, [(index) * CARD_WIDTH, (index) * CARD_WIDTH], [width, 0])
        console.log("X", x)
        return {
            transform: [{ translateX: x }]
        }
    })
    if (!item.src) {
        return (
            <View style={{
                width: EMPTY_CARD, backgroundColor: "red",
                ...item.left ? { marginRight: CARD_MARGIN }
                    : { marginLeft: CARD_MARGIN }
            }}>

            </View>
        )
    }
    return (
        <Animated.View style={[styles.card,
        { width: CARD_WIDTH, marginHorizontal: CARD_MARGIN },
            animatedStyle
        ]} >
            <Image source={{ uri: item?.src?.original }}
                style={styles.image} />
        </Animated.View>
    );
}

