import { combineReducers } 
  from 'redux'

const initialMessageState = []

function messages(state = initialMessageState, action) {
  switch (action.type) {
    case 'add_message':
      return [...state, action.data]
    case 'clear_messages':
      return []
    default:
      return state
  }
}

const reducers = { messages }

export default combineReducers(reducers)
