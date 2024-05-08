import React from 'react';
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Typewriter from '../../components/Typewriter';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomInput from '../../components/CustomInput';
import { colors } from '../../utils/colors';

const ChatBot = () => {

    const sendSms = () => {

    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <Typewriter text={`In this video we are going to create typing indicator with the typewriter animation.`} />
            </View>
            <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : hp(4)}
                behavior={Platform.OS === 'ios' ? 'padding' : "height"}>
                <View style={styles.inputView}>
                    <TextInput placeholder={"Start Chat"} style={styles.textInput} />
                    <TouchableOpacity onPress={() => sendSms()} style={styles.sendBtn}>
                        <Image style={styles.sendImg} source={require('../../assets/images/send.png')} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatBot;

const styles = StyleSheet.create({
    inputView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: wp(3),
        paddingBottom: hp(1),
    },
    textInput: {
        flex: 1,
        height: hp(6),
        backgroundColor: "#ffffff",
        borderRadius: 5,
        paddingHorizontal: 10,
        shadowColor: '#3E3C49',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        fontSize: 16
    },
    sendBtn: {
        width: hp(5),
        height: hp(5),
        borderRadius: hp(5),
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: wp(2),
    },
    sendImg: {
        width: 20,
        height: 20,
        resizeMode: "contain",
    }
});
