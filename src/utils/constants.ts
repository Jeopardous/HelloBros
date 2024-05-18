export const signupFields = [
  {
    name: 'name',
    label: 'Full Name',
    leftIcon: require('../assets/images/full_name.png'),
    type: 'input',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'input',
    leftIcon: require('../assets/images/mail.png'),
  },
  {
    name: 'phone',
    label: 'Phone',
    leftIcon: require('../assets/images/full_name.png'),
    type: 'phone',
  },
  {
    name: 'gender',
    label: 'Gender',
    leftIcon: require('../assets/images/gender.png'),
    rightIcon: require('../assets/images/dropdown.png'),
    type: 'picker',
  },
  {
    name: 'dob',
    label: 'DOB',
    leftIcon: require('../assets/images/dob.png'),
    rightIcon: require('../assets/images/calendar.png'),
    type: 'date',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    leftIcon: require('../assets/images/lock.png'),
    showPassword: require('../assets/images/show_eye.png'),
    hidePassword: require('../assets/images/hide_eye.png'),
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
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

export const IMAGES = [
  {src: 'https://images.pexels.com/photos/733860/pexels-photo-733860.jpeg'},
  {src: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg'},
  {src: 'https://images.pexels.com/photos/1820563/pexels-photo-1820563.jpeg'},
  {src: 'https://images.pexels.com/photos/707344/pexels-photo-707344.jpeg'},
  {src: 'https://images.pexels.com/photos/2086622/pexels-photo-2086622.jpeg'},
];
