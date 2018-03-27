import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import fetchMock from 'fetch-mock'

it.skip('renders without crashing', () => {
    fetchMock.get('*', {user: 'ron'})
    fetchMock.get('/user-info', {userId: 1})

    const div = document.createElement('div');
    ReactDOM.render(<App/>, div);
});
