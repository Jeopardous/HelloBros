/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomInput from './src/components/CustomInput';
import { signupFields } from './src/utils/constants';
import { validateEmail, validateName, validatePassword } from './src/utils/helper';
import { DateType } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';



const App: React.FC = () => {
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


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
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
    </GestureHandlerRootView>


  );
}

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



});

export default App;
