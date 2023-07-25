

export const initialState = {
    status: 'checking', // 'authenticated', 'not-authenticated'
    user: {},
    errorMessage: undefined,
};

export const authenticatedState = {
    status: 'authenticated', //'checking' , 'not-authenticated'
    user: {
        uid: 'abc',
        name: 'Patricio'
    },
    errorMessage: undefined,
};

export const notAuthenticatedState = {
    status: 'not-authenticated', // 'authenticated', 'checking'
    user: {},
    errorMessage: undefined,
};