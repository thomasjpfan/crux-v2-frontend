import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from 'react-apollo';
import App from './components/App';
import { Provider } from 'react-redux';
import store from './redux/redux';
import client from './ApolloClient';

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>,
  </ApolloProvider>
  </Provider>,
  document.getElementById('root'));
