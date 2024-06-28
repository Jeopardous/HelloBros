
import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { DateType } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import NavigationActions from '../../navigation/NavigationActions'
import { validateEmail, validateName, validatePassword } from '../../utils/helper';
import { signupFields } from '../../utils/constants';
import CustomInput from '../../components/CustomInput';
import { colors } from '../../utils/colors';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { fonts, fontSize } from '../../utils/fonts';

const SignUpScreen = () => {
    const [formValues, setFormValues] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        dob: '',
    });
    const [fieldErrors, setFieldErrors] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        dob: '',
    });
    const [selectedValue, setSelectedValue] = useState('female');
    const [selectedDate, setSelectedDate] = useState<DateType>(dayjs());
    const [countryCode, setCountryCode] = useState('IN');

    const [lang, setLang] = useState('en')

    const { t } = useTranslation()

    const handleInputChange = (fieldName: string, value: string) => {
        let error = '';

        if (fieldName === 'email') {
            if (!validateEmail(value) && value !== '') {
                error = 'Please Enter Valid email Address';
            }
        }
        if (fieldName === 'name') {
            if (!validateName(value) && value !== '') {
                error = 'Please Enter Valid Name';
            }
        }
        if (fieldName === 'password') {
            if (!validatePassword(value) && value !== '') {
                error = `Passwords must be at least six characters long and include digits,lower and upper case letters and special characters.`;
            }
        }
        if (fieldName === 'confirmPassword') {
            if (!validatePassword(value) && value !== '') {
                error = `Passwords must be at least six characters long and include digits,lower and upper case letters and special characters.`;
            } else if (formValues.password !== value) {
                if (value === '') {
                    error = '';
                } else error = 'Password does not match';
            }
        }
        setFormValues(prevState => ({
            ...prevState,
            [fieldName]: value,
        }));

        setFieldErrors(prevErrors => ({
            ...prevErrors,
            [fieldName]: error,
        }));
    };

    const handleValueChange = (value: number) => {
        console.log('BASASASAS::::', value);
        setSelectedValue(value === 1 ? 'Male' : 'Female');
        setFormValues(prevState => ({
            ...prevState,
            gender: value === 1 ? 'Male' : 'Female',
        }));
        setFieldErrors(prevErrors => ({
            ...prevErrors,
            gender: "",
        }));
    };
    const handleDateChage = (date: DateType) => {
        const birthDate = dayjs(date).format('YYYY-MM-DD');
        setSelectedDate(date);
        setFormValues(prevState => ({
            ...prevState,
            dob: birthDate,
        }));
        setFieldErrors(prevErrors => ({
            ...prevErrors,
            dob: "",
        }));
    };

    const handleCountryCode = (name: string, code: string) => {
        setCountryCode(name);
    };

    const onChangeLang = () => {
        let newLang = "en"
        lang === "en" ? newLang = "hindi" : newLang = "en"
        i18next.changeLanguage(newLang)
        setLang(newLang)
    }

    return (
        <View>
            <View style={{ marginTop: 30 }}>
                {signupFields.map((fields, index) => {
                    const fieldName = fields.name as keyof typeof formValues
                    return (<View key={index}>
                        <View key={index}>
                            <CustomInput
                                value={formValues[fieldName]}
                                onChangeText={value => handleInputChange(fields.name, value)}
                                label={fields.label}
                                leftIcon={fields.leftIcon}
                                rightIcon={fields.rightIcon}
                                type={fields.type}
                                selectedValue={selectedValue}
                                selectedDate={selectedDate}
                                handleValueChange={handleValueChange}
                                handleChangeDate={handleDateChage}
                                hidePassword={fields.hidePassword}
                                showPassword={fields.showPassword}
                                error={fieldErrors[fieldName]}
                                callingCode={countryCode}
                                onCountryCodeChange={handleCountryCode}
                                keyboardType={
                                    fields.type === 'phone' ? 'numeric' : 'default'
                                }
                            />
                            {fieldErrors[fieldName] && (
                                <Text style={styles.errorText}>
                                    {fieldErrors[fieldName]}
                                </Text>
                            )}
                        </View>
                    </View>)
                })}
            </View>
            <View style={{ marginTop: 30 }}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.btnTxt}>{t("continue")}</Text>
                </TouchableOpacity>
            </View>

            <View style={{ marginTop: 30 }}>
                <TouchableOpacity onPress={() => onChangeLang()} style={styles.button}>
                    <Text style={styles.btnTxt}>{t("change-lang")}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F0A210"
    },
    box: {
        flexDirection: "row",
        width: "50%",
        height: "8%",
        borderRadius: 60,
        backgroundColor: "#ffffff",
        alignItems: "center",
        elevation: 10,
        shadowOffset: {
            height: 10,
            width: 2
        },
        shadowColor: "#000000",
        shadowOpacity: 0.1


    },
    circle: {
        width: "28%",
        height: "80%",
        borderRadius: 50,
        backgroundColor: "#F0A210",
        marginLeft: 10,
        justifyContent: "center",
        alignItems: "center"
    }
    ,
    swipeArrowIcon: {
        width: 24,
        height: 24,
        resizeMode: "contain"
    },
    swipeTxt: {
        fontSize: 12,
        color: "#000000",
        textAlign: "center",
        marginLeft: 10
    },

    errorText: {
        fontSize: 10,
        color: "#FF1919",
        marginVertical: 5,
    },
    button: {
        backgroundColor: colors.primary,
        width: wp(80),
        height: hp(6),
        borderRadius: wp(2),
        alignSelf: "center",
        justifyContent: "center"

    },
    btnTxt: {
        color: colors.white,
        alignSelf: "center",
        fontFamily: fonts.bold,
        fontSize: fontSize.font16

    }
})