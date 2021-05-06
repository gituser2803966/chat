const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      console.log("dispatch signIn")
      return {
        ...state,
        userToken: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      console.log("dispatch signIn")
      return {
        ...state,
        isSignout: false,
        userToken: action.token,
      };
    case 'SIGN_OUT':
      console.log("dispatch signIn")
      return {
        ...state,
        isSignout: true,
        userToken: null,
      };

    default:
      return state;
  }
};

export default AuthReducer;

// export const authReducer = React.useReducer(
//   (state, action) => {
//     switch (action.type) {
//       case 'RESTORE_TOKEN':
//         return {
//           ...state,
//           userToken: action.token,
//           isLoading: false,
//         };
//       case 'SIGN_IN':
//         return {
//           ...state,
//           isSignout: false,
//           userToken: action.token,
//         };
//       case 'SIGN_OUT':
//         return {
//           ...state,
//           isSignout: true,
//           userToken: null,
//         };
//     }
//   },
//   {
//     isLoading: true,
//     isSignout: false,
//     userToken: null,
//   },
// );
