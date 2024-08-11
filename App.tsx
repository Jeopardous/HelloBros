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
import DragDrop from './src/components/DragDrop';
import RootNavigator from './src/navigation/RootNavigator';
import { I18nextProvider } from 'react-i18next';
import i18next from './src/services/i18next';
import { Provider } from 'react-redux';
import { persister, store } from './src/store/store';
import { PersistGate } from 'redux-persist/integration/react';





const App: React.FC = () => {


  return (
    <I18nextProvider i18n={i18next}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persister}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootNavigator />
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    </I18nextProvider>



  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff"
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
