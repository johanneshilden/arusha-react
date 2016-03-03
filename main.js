import React    from 'react'
import ReactDOM from 'react-dom'
import app      from './reducers'

import { createStore } 
  from 'redux'
import { Provider, connect } 
  from 'react-redux'

const store = createStore(app)

const ws = new WebSocket('ws://localhost:8001')

ws.onopen  = () => { console.log('WebSocket connection established.') }
ws.onclose = () => { console.log('WebSocket connection closed.') }
ws.onerror = e  => { console.log(e) }

ws.onmessage = e => {
  store.dispatch(addMessage(e.data))
}

function addMessage(text) {
  return {
    type : 'add_message',
    data : { text }
  }
}

function clearMessages() {
  return {
    type : 'clear_messages'
  }
}

const MessageList = React.createClass({
  render() {
    const { messages } = this.props
    return (
      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.text}
          </div>
        ))}
      </div>
    )
  },
})

const MessageListComponent = connect(state => {
  return {
    messages : state.messages
  }
})(MessageList)

const App = React.createClass({
  sendMessage() {
    const { textArea } = this.refs
    ws.send(textArea.value)
    textArea.value = ''
  },
  clearMessages() {
    store.dispatch(clearMessages())
  },
  render() {
    return (
      <div>
        <div>
          <textarea ref='textArea' />
        </div>
        <button onClick={this.sendMessage}>
          Send message
        </button>
        <button onClick={this.clearMessages}>
          Clear
        </button>
        <MessageListComponent />
      </div>
    )
  },
})

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('main')
)
