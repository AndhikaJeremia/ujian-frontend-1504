const INTIAL_STATE = {
    email: '',
    password: '',
    id: '',
    cart: []
}

// make reducer for users
const LoginUser_Reducer = (state = INTIAL_STATE, action) => {
    switch (action.type) {
        case 'LOG_IN':
            return {
                ...state,
                email: action.payload.email,
                password: action.payload.password,
                id: action.payload.id,
                cart: action.payload.cart
            }
        case 'LOG_OUT':
            return INTIAL_STATE
        default :
            return state
    }
}

export default LoginUser_Reducer