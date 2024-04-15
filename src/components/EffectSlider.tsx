import React, { useState, useEffect } from 'react';
import { FlatList, Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { dragImages } from '../utils/constants';
import { colors } from '../utils/colors';

const EffectSlider = () => {
    const windowWidth = useWindowDimensions().width;
    const [itemWidth, setItemWidth] = useState((windowWidth) / 5); // Initially show 5 items on the screen
    const [selectedIndex, setSelectedIndex] = useState(Math.floor(dragImages.length / 2));
    const [paddingHorizontal, setPaddingHorizontal] = useState(0);


    useEffect(() => {
        setItemWidth(windowWidth / 5); // Recalculate item width whenever window width changes
        const totalPadding = windowWidth - itemWidth;
        setPaddingHorizontal(totalPadding / 2); // Recalculate horizontal padding
    }, [windowWidth]);


    const renderItem = ({ item, index }) => {
        return (
            <View style={[styles.circle, { width: itemWidth - 20, height: itemWidth - 20, borderRadius: itemWidth - 20 }]}>
                <Image style={[styles.image, { borderRadius: itemWidth }]} source={item?.path} />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                style={[styles.listView,]}
                contentContainerStyle={{ paddingHorizontal }}
                horizontal
                data={dragImages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                initialScrollIndex={selectedIndex}
                showsHorizontalScrollIndicator={false}
                getItemLayout={(data, index) => ({
                    length: itemWidth, // Set length equal to item width
                    offset: itemWidth * index,
                    index,
                })}
            />
            <View style={[styles.selectCircle, {
                width: itemWidth - 15,
                height: itemWidth - 15
            }]}></View>
        </View>
    );
};

export default EffectSlider;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    circle: {
        marginHorizontal: 10,
        borderWidth: 1
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: 'contain',
    },
    listView: {
        height: 65,
        borderWidth: 1,
    },
    selectCircle: {

        borderRadius: 65,
        borderWidth: 5,
        borderColor: colors.primary,
        marginHorizontal: 10,
        position: 'absolute',
        alignSelf: 'center',
    },
});
