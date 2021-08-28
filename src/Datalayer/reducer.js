export const initialState = {
  user: null,
  mode: true
};

export const actionType = {
  SET_USER: "SET_USER",
  SET_MODE: "SET_MODE"
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionType.SET_USER:
      return {
        ...state,
        user: action.user
      };
    case actionType.SET_MODE:
      return {
        ...state,
        mode: action.mode
      };
    default:
      return state;
  }
};

export default reducer;
