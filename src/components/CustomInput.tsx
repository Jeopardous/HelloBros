import React, { forwardRef, useState } from 'react';
import {
    View,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Image,
    Modal,
    Text,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import dayjs from 'dayjs';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal';
import { useTranslation } from 'react-i18next';
interface CustomInputProps extends TextInputProps {
    label: string;
    style?: TextInput['props']['style'] | any;
    leftIcon?: any;
    rightIcon?: any;
    type?: string;
    selectedValue?: number | null;
    handleValueChange?: (text: number) => void;
    selectedDate?: DateType;
    handleChangeDate?: (date: string) => void;
    hidePassword?: any;
    showPassword?: any;
    error?: string;
    callingCode?: any;
    onCountryCodeChange?: (name: string, code: string) => void;
}

const initialStyle = {
    fontSize: 15,
    paddingVertical: hp(1.5),
    borderColor: 'grey',
    color: "#000000",
    width: '76%',
};

const CustomInput = forwardRef<TextInput, CustomInputProps>((props, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isGenderPicker, setGenderPicker] = useState(false);
    const [isOtpPicker, setOtpPicker] = useState(false);

    const [isDatePicker, setDatePicker] = useState(false);
    const [date, setDate] = useState(dayjs());
    const [isPasswordVisible, setPasswordVisible] = useState(true);
    const animatedValue = useSharedValue(0);

    const { t } = useTranslation()



    const handleFocus = () => {
        if (props.type === 'picker') {
            setGenderPicker(true);
        }
        if (props.type === 'date') {
            setDatePicker(true);
        }
        if (props.type === 'otp') {
            setOtpPicker(true);
        }
        setIsFocused(true);
        animatedValue.value = withTiming(1, { duration: 250 });
    };

    const handleBlur = () => {
        if (props.type === 'picker') {
            setGenderPicker(false);
        }
        if (props.type === 'date') {
            setDatePicker(false);
        }
        if (props.type === 'otp') {
            setOtpPicker(false);
        }
        if (!props.value) {
            setIsFocused(false);
            animatedValue.value = withTiming(0, { duration: 150 });
        }
    };

    const labelStyle = useAnimatedStyle(() => {
        const top =
            Platform.OS === 'ios'
                ? interpolate(animatedValue.value, [0, 1], [12, -12])
                : interpolate(animatedValue.value, [0, 1], [8, -12]);
        const fontSize = interpolate(animatedValue.value, [0, 1], [16, 12]);
        let left = props.type === 'phone' ? 27 : 12;
        if (props.type === 'phone') {
            left = interpolate(animatedValue.value, [0, 1], [27, 12]);
        }
        return {
            position: 'absolute',
            left: `${left}%`,
            top,
            fontSize,
            zIndex: 1,
            color: '#000000',
        };
    });

    const handleValue = (itemValue: number) => {
        console.log('ABJBAJSAS:::', itemValue);
        if (props.handleValueChange) props?.handleValueChange(itemValue);
        setGenderPicker(false);
        setOtpPicker(false);
    };

    const handleDate = (date: string) => {
        if (props.handleChangeDate) props?.handleChangeDate(date);
        // setDatePicker(false);
    };


    const renderGenderPicker = () => {
        return (
            <Modal
                visible={isGenderPicker}
                animationType="fade"
                onRequestClose={() => setGenderPicker(false)}
                transparent>
                <TouchableOpacity
                    onPress={() => setGenderPicker(false)}
                    style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            onPress={() => handleValue(1)}
                            style={styles.genderView}>
                            <Text style={styles.genderTxt}>Male</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleValue(2)}
                            style={styles.genderView}>
                            <Text style={styles.genderTxt}>Female</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    };
    const renderSelectModal = () => {
        return (
            <Modal
                visible={isOtpPicker}
                animationType="fade"
                onRequestClose={() => setOtpPicker(false)}
                transparent>
                <TouchableOpacity
                    onPress={() => setOtpPicker(false)}
                    style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            onPress={() => handleValue(1)}
                            style={styles.genderView}>
                            <Text style={styles.genderTxt}>Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleValue(2)}
                            style={styles.genderView}>
                            <Text style={styles.genderTxt}>Phone</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    };

    const renderDatePicker = () => {
        return (
            <Modal
                visible={isDatePicker}
                animationType="slide"
                onRequestClose={() => setDatePicker(false)}
                transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.dateModalView}>
                        <View style={styles.dateFooter}>
                            <View>
                                <Text style={styles.dateTxt}>Choose Date</Text>
                                <Text style={styles.dateInfo}>Set your date of birth here</Text>
                            </View>
                            <TouchableOpacity onPress={() => setDatePicker(false)}>
                                <Image
                                    source={require('../assets/images/dropdown.png')}
                                    style={styles.largeIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        <DateTimePicker
                            mode="single"
                            date={props.selectedDate}
                            onChange={(params: any) => handleDate(params.date)}
                            selectedItemColor={"#F0A210"}
                            calendarTextStyle={styles.calendarTextStyle}
                            dayContainerStyle={styles.dayContainer}
                            todayContainerStyle={styles.todayContainerStyle}
                            todayTextStyle={styles.todayTxtStyle}
                            selectedTextStyle={styles.selectedTxtStyle}
                            maxDate={dayjs()}
                        />
                        <View style={styles.dateFooter}>
                            <TouchableOpacity
                                onPress={() => setDatePicker(false)}
                                style={styles.cancelBtn}>
                                <Text style={styles.cancelTxt}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setDatePicker(false)}
                                style={[{
                                    width: "100%", height: "100%", justifyContent: 'center',
                                    backgroundColor: "#F0A210",
                                    borderRadius: hp(5),
                                }, styles.doneBtn]}

                            >

                                <Text style={styles.doneTxt}>Ok</Text>


                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };
    const handlePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const renderPasswordIcons = () => {
        return (
            <TouchableOpacity
                style={styles.inputIcon}
                onPress={handlePasswordVisibility}>
                <Image
                    source={isPasswordVisible ? props.hidePassword : props.showPassword}
                    style={styles.liteIcon}
                />
            </TouchableOpacity>
        );
    };

    const renderCountryPicker = () => {
        return (
            <View
                style={[
                    styles.row,
                    {
                        paddingHorizontal: wp(3),
                    },
                ]}>
                <CountryPicker
                    countryCode={props.callingCode}
                    withFlag
                    visible={false}
                    withFilter
                    onSelect={country => {
                        if (props.onCountryCodeChange)
                            props.onCountryCodeChange(country.cca2, country.callingCode[0]);
                    }}
                />
                <Image
                    source={require('../assets/images/dropdown.png')}
                    style={styles.liteIcon}
                />
                <View style={styles.divider}></View>
            </View>
        );
    };

    return (
        <TouchableOpacity
            onPress={handleFocus}
            style={[
                styles.inputBox,
                {
                    borderColor: props.error ? "#FF1919" : "#dddddd",
                    backgroundColor: props.error
                        ? "rgba(255, 25, 25, 0.1)"
                        : '#ffffff',
                },
            ]}>
            {props.type !== 'otp' ? (
                props.type === 'phone' ? (
                    <Animated.Text
                        style={[
                            labelStyle,
                            styles.labelView,
                            styles.phonePlaceholder,
                            ,
                            {
                                backgroundColor: isFocused ? '#ffffff' : 'transparent',
                            },
                        ]}>
                        {t(props.label)}
                    </Animated.Text>
                ) : (
                    <Animated.Text
                        style={[
                            labelStyle,
                            styles.labelView,
                            {
                                backgroundColor: isFocused ? '#ffffff' : 'transparent',
                            },
                        ]}>
                        {t(props.label)}
                    </Animated.Text>
                )
            ) : (
                <Text style={[styles.placeholder]}>
                    {props.selectedValue ? '' : t(props.label)}
                </Text>
            )}

            <View style={[styles.row, { justifyContent: 'space-between' }]}>
                {props.type !== 'phone' && (
                    <View style={styles.inputIcon}>
                        <Image source={props.leftIcon} style={styles.leftIcon} />
                    </View>
                )}
                {props.type === 'phone' && renderCountryPicker()}
                {isFocused && (
                    <TextInput
                        {...props}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        style={[initialStyle, props.style]}
                        autoFocus
                        autoCapitalize='none'
                        editable={
                            props.type === 'input' ||
                                props.type === 'password' ||
                                props.type === 'phone'
                                ? true
                                : false
                        }
                        secureTextEntry={props.type === 'password' && isPasswordVisible}
                    />
                )}
                {props.type === 'picker' && isGenderPicker && renderGenderPicker()}

                {props.type === 'password' && renderPasswordIcons()}

                {props.type !== 'password' && (
                    <View style={styles.inputIcon}>
                        {props.rightIcon && (
                            <Image source={props.rightIcon} style={styles.smallIcon} />
                        )}
                    </View>
                )}

                {props.type === 'otp' && renderSelectModal()}
            </View>
            {props.type === 'date' && isDatePicker && renderDatePicker()}
        </TouchableOpacity>
    );
});

export default CustomInput;



const styles = StyleSheet.create({
    liteIcon: {
        width: 18,
        height: 18,
        resizeMode: "contain",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    largeIcon: {
        width: 48,
        height: 48,
        resizeMode: "contain",
    },
    smallIcon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    leftIcon: {
        width: 22,
        height: 22,
        resizeMode: "contain",
    },
    labelView: {
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(2),
    },
    inputIcon: {
        width: '12%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputBox: {
        marginVertical: hp(1),
        borderWidth: 1,
        borderRadius: wp(2),
        height: hp(6),
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        width: wp(80),
        alignSelf: "center"
    },
    placeholder: {
        position: 'absolute',
        left: '12%',
        ...(Platform.OS === 'ios'
            ? {
                top: 16,
                fontSize: 16,
            }
            : {
                top: 12,
                fontSize: 16,
            }),
        zIndex: 1,
        color: '#000000',
    },
    phonePlaceholder: {
        position: 'absolute',
        left: '25%',
        ...(Platform.OS === 'ios'
            ? {
                top: 12,
                fontSize: 16,
            }
            : {
                top: 8,
                fontSize: 16,
            }),
        zIndex: 1,
        color: '#000000',
    },
    pickerView: {
        fontSize: 11,
        paddingVertical: hp(1.5),
        borderColor: "grey",
        color: '#000000',
        width: '76%',
        borderWidth: 2,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: wp(70),
        padding: wp(6),
        backgroundColor: '#ffffff',
        borderRadius: wp(2),
    },
    dateModalView: {
        position: 'absolute',
        bottom: 0,
        width: wp(100),
        padding: wp(6),
        backgroundColor: '#ffffff',
        borderRadius: wp(5),
    },
    genderView: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp(1),
        backgroundColor: '#EFF3FF',
        marginVertical: hp(0.5),
        borderRadius: wp(2),
    },
    genderTxt: {
        fontSize: 16,
        color: "#000000",
    },
    datePickerView: {
        backgroundColor: '#F5FCFF',
    },
    dayContainer: {
        width: wp(9),
        height: wp(9),
        textAlign: 'center',
        borderRadius: wp(2),
        backgroundColor: '#ffffff',
        marginVertical: hp(0.5),
        ...(Platform.OS === 'ios'
            ? {
                shadowColor: '#3E3C49',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
            }
            : {
                elevation: 2,
            }),
    },
    calendarTextStyle: {
        fontSize: 13,
        color: '#000000',
    },
    selectedTxtStyle: {
        fontSize: 13,
        color: '#ffffff',
    },
    todayTxtStyle: {
        fontSize: 13,
        color: '#000000',
    },
    todayContainerStyle: {
        borderColor: "#F0A210",
        borderWidth: 1,
    },

    dateFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: wp(88),
        paddingBottom: hp(2),
    },
    cancelBtn: {
        width: '48%',
        height: hp(6),
        justifyContent: 'center',
        backgroundColor: "#dddddd",
        borderRadius: hp(5),
    },
    cancelTxt: {
        fontSize: 13,
        color: '#000000',
        alignSelf: 'center',
    },
    doneBtn: {
        width: '48%',
        height: hp(6),
        justifyContent: 'center',
        backgroundColor: "#F0A210",
        borderRadius: hp(5),
    },
    doneTxt: {
        fontSize: 13,
        color: '#ffffff',
        alignSelf: 'center',
    },
    dateTxt: {
        fontSize: 16,
        color: '#000000',
    },
    dateInfo: {
        fontSize: 10,
        color: '#000000',
    },
    divider: {
        borderWidth: 0.5,
        height: hp(2.5),
        marginLeft: wp(2),
    },
});