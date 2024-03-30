import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';

const SwipeCards = () => {
    const API_KEY = 'qAKxm4Le3SMk3JiPE7iY3Tq4y8253FOxQ0QzkXeKTqswZ9X6YxSdTzap';
    const SEARCH_QUERY = 'nature';
    const [listData, setListData] = useState([])
    const flatListRef = useRef(null);
    const { width: screenWidth } = Dimensions.get('window');


    useEffect(() => {

        const fetchPhotos = async () => {
            try {
                const response = await axios.get(`https://api.pexels.com/v1/search?per_page=9&query=${SEARCH_QUERY}`, {
                    headers: {
                        Authorization: API_KEY,
                    },
                });

                // console.log("RESPONSE:::", response.data)
                setListData(response.data.photos);
            } catch (error) {
                console.error('Error fetching photos:', error);
            }
        };

        fetchPhotos();

    }, [])

    const getItemLayout = (data: any, index: number) => ({
        length: wp(87), // width of the card + margin
        offset: (wp(87) - wp(1.5)) * index, // position of the card in the FlatList
        index, // index of the item in the data array
    });

    const handleScroll = (event: any) => {
        console.log("EVENT::", event.nativeEvent)
        const scrollPosition = event.nativeEvent.contentOffset.x

        // const offset=
        // const index = (scrollPosition) / screenWidth

        // if(scrollPosition)

    };

    const renderCards = ({ item, index }: any) => {
        return (
            <View style={styles.card}>
                <Image source={{ uri: item?.src?.original }} style={styles.image} />
            </View>
        )

    }

    return (
        <View>
            {listData && listData.length > 0 && <FlatList
                ref={flatListRef}
                data={listData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderCards}
                horizontal
                pagingEnabled
                initialScrollIndex={Math.floor(listData.length / 2)}
                getItemLayout={getItemLayout}
                onScroll={handleScroll}
            />}
        </View>
    )
}

export default SwipeCards

const styles = StyleSheet.create({
    card: {
        width: wp(85),
        height: hp(60),
        backgroundColor: "#ffffff",
        borderRadius: 10,
        shadowOffset: {
            height: 2,
            width: 2
        },
        shadowColor: "#2c2c2c",
        shadowOpacity: 0.3,
        shadowRadius: 10,
        marginHorizontal: wp(1),
        marginVertical: hp(1)
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        borderRadius: 10,
    }
})