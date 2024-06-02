import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View, FlatList, FlatListProps, NativeUIEvent } from 'react-native';
import Animated, { Extrapolation, interpolate, runOnJS, SensorType, SharedValue, useAnimatedSensor, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../utils/colors';

const { width, height } = Dimensions.get("window");

const CARD_WIDTH = width * 0.8; // Decrease the card width
const CARD_HEIGHT = height * 0.5;
const VISIBLE_OFFSET = (width - CARD_WIDTH) / 2; // Visible offset for left and right cards
const SNAP_TO_INTERVAL = CARD_WIDTH + 12.5 // Add some space between cards

interface Photo {
    src: {
        original: string;
    };
}

const SwipeCards: React.FC = () => {
    const API_KEY = 'qAKxm4Le3SMk3JiPE7iY3Tq4y8253FOxQ0QzkXeKTqswZ9X6YxSdTzap';
    const SEARCH_QUERY = 'nature';
    const [listData, setListData] = useState<Photo[]>([]);
    const contentOffset = useSharedValue(0);
    const flatListRef = useRef<FlatList<Photo>>(null);
    const currentIndex = useSharedValue(0);
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
            const initialOffset = initialIndex * (SNAP_TO_INTERVAL);
            flatListRef.current.scrollToOffset({ offset: initialOffset, animated: true });
        }
    };

    const setCurrentIndex = (index: number) => {
        currentIndex.value = index;
    };
    const handleScroll = (event: any) => {
        contentOffset.value = event.nativeEvent.contentOffset.x;
        const index = Math.round(event.nativeEvent.contentOffset.x / SNAP_TO_INTERVAL);
        runOnJS(setCurrentIndex)(index);
    };
    useEffect(() => {
        scrollToMiddleItem();
    }, [listData]);

    const renderCards: FlatListProps<Photo>['renderItem'] = ({ item, index }) => {
        return <CardView item={item} index={index} contentOffset={contentOffset} currentIndex={currentIndex} />;
    };

    return (
        <View style={styles.container}>
            <View style={styles.listView}>
                {listData && listData.length > 0 && (
                    <FlatList
                        ref={flatListRef}
                        data={listData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderCards}
                        snapToInterval={SNAP_TO_INTERVAL}
                        decelerationRate={0}
                        bounces={false}
                        horizontal
                        scrollEventThrottle={16}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: VISIBLE_OFFSET }} // Add padding to center the first and last cards
                        onScroll={handleScroll}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: hp(10),
        backgroundColor: "#000000"
    },
    card: {},
    image: {
        width: width,
        height: CARD_HEIGHT,
        resizeMode: "cover",
    },
    listView: {
        width: "100%",
        height: hp(60),
        justifyContent: "center",
        alignItems: "center"
    }
});

interface CardViewProps {
    item: Photo;
    index: number;
    contentOffset: SharedValue<number>;
    currentIndex: SharedValue<number>;
}

const CardView: React.FC<CardViewProps> = ({ item, index, contentOffset, currentIndex }) => {

    const gravitySensor = useAnimatedSensor(SensorType.GRAVITY);
    const animatedCardStyle = useAnimatedStyle(() => {
        // Apply translation only to the currently centered card
        const isCenteredCard = index === currentIndex.value;
        const translateXGravity = isCenteredCard ? gravitySensor.sensor.value.x : 0;
        const translateYGravity = isCenteredCard ? gravitySensor.sensor.value.y : 0;

        return {
            transform: [
                { translateX: translateXGravity },
                { translateY: translateYGravity },
            ],
        };
    });
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 1) * SNAP_TO_INTERVAL,
            index * SNAP_TO_INTERVAL,
            (index + 1) * SNAP_TO_INTERVAL
        ];

        const translateX = interpolate(contentOffset.value, inputRange, [-CARD_WIDTH * 0.8, 0, CARD_WIDTH * 0.8]);

        return {
            transform: [{ translateX }],
        };
    });

    return (
        <Animated.View style={[{
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            marginHorizontal: 5,
        }, animatedCardStyle]}>
            <View style={[
                {
                    width: "100%",
                    overflow: "hidden",
                    alignItems: "center",
                    borderRadius: 10,
                    borderWidth: 5,
                    borderColor: "white"
                }
            ]}>
                <Animated.Image
                    source={{ uri: item?.src?.original }}
                    style={[styles.image, animatedStyle]} />
            </View>
        </Animated.View>
    );
};

export default SwipeCards;
