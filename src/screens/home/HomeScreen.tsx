import { FlatList, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostData } from '../../store/action/home/homeActions'
import { AppDispatch } from '../../store/types/types'
import { getPostData } from '../../store/reducers/home/homeSlice'
import { fonts, fontSize } from '../../utils/fonts'
import { colors } from '../../utils/colors'

const HomeScreen = () => {

    const postData = useSelector(getPostData)

    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(fetchPostData())
    }, [dispatch])

    console.log("POST DATA:::", postData)

    const renderItem = ({ item, index }: any) => {
        return (
            <View style={styles.postCard}>
                <Text style={styles.header}>{item.title}</Text>
                <Text>{item.body}</Text>

            </View>
        )
    }
    return (
        <View>
            <FlatList
                data={postData.data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />


        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    postCard: {
        width: "80%",
        padding: 10,
        backgroundColor: "white",
        elevation: Platform.OS === "android" ? 5 : 0,
        shadowOffset: {
            width: 0, height: 2
        },
        shadowColor: "#2c2c2c",
        shadowOpacity: 0.3,
        shadowRadius: 8,
        borderRadius: 10,
        alignSelf: "center",
        marginVertical: 10
    },
    header: {
        fontFamily: fonts.bold,
        fontSize: fontSize.font16,
        color: colors.text,
        marginVertical: 10
    }
})