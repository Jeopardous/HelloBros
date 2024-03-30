import {CommonActions, NavigationContainerRef} from '@react-navigation/native';

let navigationRef: NavigationContainerRef<any> | null = null;

const setNavigationRef = (ref: NavigationContainerRef<any> | null) => {
  navigationRef = ref;
};

const navigate = (name: string, params?: any) => {
  navigationRef?.navigate(name, params);
};

const goBack = () => {
  navigationRef?.goBack();
};
const resetToScreen = (name: string) => {
  navigationRef?.dispatch(state => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{name}],
    });

    return resetAction;
  });
};

export default {
  setNavigationRef,
  navigate,
  goBack,
  resetToScreen,
};
