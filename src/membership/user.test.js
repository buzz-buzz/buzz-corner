import React from 'react';
import CurrentUser from "./user";
import fetchMock from 'fetch-mock';

it('gets current user id', async () => {
    fetchMock.getOnce('/user-info', {
        body: {userId: 1}
    });

    let userId = await CurrentUser.getUserId();

    expect(userId).toEqual(1);
})