
import dayjs from 'dayjs';
import i18next from 'i18next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    StyleSheet,
    View
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { DateType } from 'react-native-ui-datepicker';
import SpeedoMeter from '../../components/SpeedoMeter';
import { colors } from '../../utils/colors';
import { fonts, fontSize } from '../../utils/fonts';
import { validateEmail, validateName, validatePassword } from '../../utils/helper';
import Gauge from '../../components/Gauge';

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

    const [title, setTitle] = useState("Low")
    const [title1, setTitle1] = useState("Low")
    const [title2, setTitle2] = useState("Low")
    const [title3, setTitle3] = useState("Low")




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
    const onChangeTitle = (val: any) => {
        if (val < 33) {
            setTitle("Low");
        } else if (val < 66) {
            setTitle("Medium")
        } else {
            setTitle("High");
        }
    }
    const onChangeTitle1 = (val: any) => {
        if (val < 33) {
            setTitle1("Low");
        } else if (val < 66) {
            setTitle1("Medium")
        } else {
            setTitle1("High");
        }
    }
    const onChangeTitle2 = (val: any) => {
        if (val < 33) {
            setTitle2("Low");
        } else if (val < 66) {
            setTitle2("Medium")
        } else {
            setTitle2("High");
        }
    }
    const onChangeTitle3 = (val: any) => {
        if (val < 33) {
            setTitle3("Low");
        } else if (val < 66) {
            setTitle3("Medium")
        } else {
            setTitle3("High");
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <SpeedoMeter />

            </View>
            {/* <View style={{ flex: 0.5, backgroundColor: "black", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                <Gauge
                    size={150}
                    strokeWidth={20}
                    startAngle={195}
                    endAngle={-15}
                    percentage={20}
                    gradientColors={["#49ff35", "#f3ff26", "#fd2020"]}
                    indicator={true}
                    title={title}
                    onEndAnimation={(val: any) => onChangeTitle(val)}
                    titleStyle={{ bottom: 20, }}
                    containerStyle={{ backgroundColor: "transparent", marginLeft: 10, height: 110, marginTop: 10, }}
                    indicatorViewStyle={{}}
                    indicatorInnerViewStyle={{}}
                />
                <Gauge
                    size={200}
                    strokeWidth={20}
                    startAngle={359}
                    endAngle={0}
                    percentage={50}
                    gradientColors={["#56EEF4", "#56B5F5"]}
                    indicator={true}
                    title={title1}
                    onEndAnimation={(val: any) => onChangeTitle1(val)}
                    titleStyle={{ bottom: 90, }}
                    containerStyle={{ backgroundColor: "transparent", marginLeft: 10, height: 200, marginTop: 10, }}
                    indicatorViewStyle={{}}
                    indicatorInnerViewStyle={{}}
                />
                <Gauge
                    size={200}
                    strokeWidth={20}
                    startAngle={225}
                    endAngle={-45}
                    percentage={80}
                    gradientColors={["white", "#f3ff26", "#fd2020"]}
                    indicator={true}
                    title={title2}
                    onEndAnimation={(val: any) => onChangeTitle2(val)}
                    titleStyle={{ bottom: 0, }}
                    containerStyle={{ backgroundColor: "transparent", marginLeft: 10, height: 110, marginTop: 10, }}
                    indicatorViewStyle={{}}
                    indicatorInnerViewStyle={{}}
                />
                <Gauge
                    size={150}
                    strokeWidth={20}
                    startAngle={180}
                    endAngle={0}
                    percentage={100}
                    gradientColors={["#49ff35", "#f3ff26", "#fd2020", "blue"]}
                    indicator={true}
                    title={title3}
                    onEndAnimation={(val: any) => onChangeTitle3(val)}
                    titleStyle={{ bottom: 20, }}
                    containerStyle={{ backgroundColor: "transparent", marginLeft: 10, height: 110, marginTop: 10, }}
                    indicatorViewStyle={{}}
                    indicatorInnerViewStyle={{}}
                />
            </View> */}
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