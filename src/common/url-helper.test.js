import React from 'react';
import URLHelper from './url-helper';

it('parse search parameters', () => {
    expect(URLHelper.getSearchParam('?return_url=home', 'return_url')).toEqual('home')
    expect(URLHelper.getSearchParam('?return_url=far', 'return_url')).toEqual('far')
});
