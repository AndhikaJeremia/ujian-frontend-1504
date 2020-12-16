import {
    combineReducers,
} from 'redux'
// import reducer
import LoginUser_Reducer from './loginuserReducer'
import {historyReducer} from './historyreducer'

const AllReducers = combineReducers({
    user: LoginUser_Reducer,
    history: historyReducer
})

export default AllReducers