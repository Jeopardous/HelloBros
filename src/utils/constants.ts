export const signupFields = [
  {
    name: 'name',
    label: 'full-name',
    leftIcon: require('../assets/images/full_name.png'),
    type: 'input',
  },
  {
    name: 'email',
    label: 'email',
    type: 'input',
    leftIcon: require('../assets/images/mail.png'),
  },
  {
    name: 'phone',
    label: 'phone',
    leftIcon: require('../assets/images/full_name.png'),
    type: 'phone',
  },

  {
    name: 'password',
    label: 'password',
    type: 'password',
    leftIcon: require('../assets/images/lock.png'),
    showPassword: require('../assets/images/show_eye.png'),
    hidePassword: require('../assets/images/hide_eye.png'),
  },
  {
    name: 'confirmPassword',
    label: 'confirm-password',
    leftIcon: require('../assets/images/lock.png'),
    showPassword: require('../assets/images/show_eye.png'),
    hidePassword: require('../assets/images/hide_eye.png'),
    type: 'password',
  },
];

export const dragImages = [
  {id: 1, path: require('../assets/images/dragdrop/table.png')},
  {id: 2, path: require('../assets/images/dragdrop/chair.png')},
  {id: 3, path: require('../assets/images/dragdrop/desklamp.png')},
  {id: 4, path: require('../assets/images/dragdrop/carpet.png')},
  {id: 5, path: require('../assets/images/dragdrop/brickwall.png')},
];
