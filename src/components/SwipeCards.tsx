import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Animated, { AnimatedRef, interpolate, SharedValue, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { FlatList } from 'react-native-gesture-handler';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
const { width } = Dimensions.get("window");

const CARD_WIDTH = width;
const CARD_MARGIN = 0;
const EMPTY_CARD = (width - CARD_WIDTH) / 2 - CARD_MARGIN;

const SwipeCards = () => {
    const API_KEY = 'qAKxm4Le3SMk3JiPE7iY3Tq4y8253FOxQ0QzkXeKTqswZ9X6YxSdTzap';
    const SEARCH_QUERY = 'nature';
    const [listData, setListData] = useState<any>([]);
    const flatListRef = useAnimatedRef<FlatList>()
    const contentOffset = useSharedValue(0)

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await axios.get(`https://api.pexels.com/v1/search?per_page=9&query=${SEARCH_QUERY}`, {
                    headers: {
                        Authorization: API_KEY,
                    },
                });
                // setListData([{ "left": true }, ...response.data.photos, { "right": true }]);
                setListData(response.data.photos);

            } catch (error) {
                console.error('Error fetching photos:', error);
            }
        };
        fetchPhotos();
    }, []);


    const renderCards = ({ item, index }: any) => {
        return <CardView item={item} index={index} contentOffset={contentOffset} />;
    };

    return (
        <View style={{ flex: 1 }}>
            {listData && listData.length > 0 && (
                <FlatList
                    data={listData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderCards}
                    snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
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
    },
    card: {
        height: hp(100),
        backgroundColor: "transparent",
        // borderRadius: 10,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        // borderRadius: 10,
    }
});

const CardView = ({ item, index, contentOffset }: { item: any; index: number; contentOffset: SharedValue<number> }) => {
    const initialTranslateX = index * (CARD_WIDTH + CARD_MARGIN);
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 1) * (CARD_WIDTH + CARD_MARGIN), // Start of previous card
            index * (CARD_WIDTH + CARD_MARGIN), // Start of current card
            (index + 1) * (CARD_WIDTH + CARD_MARGIN) // Start of next card
        ];

        const outputRange = [
            0, // Translate left to show previous card
            0, // Center current card
            CARD_WIDTH * 0.8 // Translate right to show next card
        ];

        const translateX = interpolate(contentOffset.value, inputRange, outputRange);


        return {
            transform: [{ translateX }] // Apply the translation
        };
    });



    if (!item.src) {
        return (
            <View style={{
                width: EMPTY_CARD, backgroundColor: "red",
                ...item.left ? { marginRight: CARD_MARGIN } : { marginLeft: CARD_MARGIN }
            }} />
        )
    }

    return (
        <Animated.View style={[styles.card, { width: CARD_WIDTH, height: "100%", marginHorizontal: CARD_MARGIN },
            animatedStyle
        ]}>
            <Image source={{ uri: item?.src?.original }} style={styles.image} />
        </Animated.View>
    );
}

export default SwipeCards;
