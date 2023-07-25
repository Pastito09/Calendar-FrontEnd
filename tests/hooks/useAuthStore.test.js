import { act, renderHook, waitFor } from "@testing-library/react";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../../src/store";
import { initialState, notAuthenticatedState } from "../fixtures/authStates";
import { testUserCredentials } from "../fixtures/testUser";
import calendarApi from "../../src/api/calendarApi";
import { authenticatedState } from "../fixtures/authStates";


const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState }
        }
    })
}

describe('pruebas en el useAuthStore', () => { 

    beforeEach( () => localStorage.clear() );
    
    test('debe de regresar los valores por defecto', () => {  
        const mockStore = getMockStore({
            status: "checking",
            user: {},
            errorMessage: undefined
        })

        const { result } = renderHook( () =>  useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{( children )}</Provider> 
        });
        expect( result.current ).toEqual({
            status: 'checking',
            user: {},
            errorMessage: undefined,
            startLogin: expect.any(Function),
            startRegister: expect.any(Function),
            checkAuthToken: expect.any(Function),
            startLogout: expect.any(Function)
        })

    });

    test('startLogin debe de realizar el login correctamente', async() => { 
        
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () =>  useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{( children )}</Provider> 
        });

        await act( async() => {
            await result.current.startLogin( testUserCredentials );
        });
        
        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test user', uid: '64483c6be8279c79fb89fee1' },
        });

        expect( localStorage.getItem('token') ).toEqual( expect.any(String) );
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any(String) );

     });

     test('startLogin debe de fallar la auntenticacion', async() => { 
        
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () =>  useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{( children )}</Provider> 
        });

        await act( async() => {
            await result.current.startLogin({ email: 'foo@bar.com', password: '124584' });
        });
        const { errorMessage, status, user } = result.current
        
        expect( localStorage.getItem('token') ).toBe(null);
        expect( localStorage.getItem('token-init-date') ).toBe(null);

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Credenciales incorrectas',
            status: 'not-authenticated',
            user: {}
        }); 

        await waitFor(
            () => expect( result.current.errorMessage ).toBe( undefined )
        )

      });

      test('startRegister debe de crear un usuario', async() => {

        const newUser = { email: 'foo@bar.com', password: '124584', name: 'Test User 2' };
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () =>  useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{( children )}</Provider> 
        });

        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data: {
                ok: true,
                uid: "ALGUN-ID",
                name: "Test User",
                token: "ALGUN-TOKEN"
            }
        });

        await act( async() => {
            await result.current.startRegister( newUser );
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: 'ALGUN-ID' }
        });

        spy.mockRestore();

      });

      test('startRegister debe fallar en la creacion de usuario', async() => { 
        
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () =>  useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{( children )}</Provider> 
        });

        await act( async() => {
            await result.current.startRegister( testUserCredentials );
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: "Un usuario ya existe con ese correo",
            status: 'not-authenticated',
            user: {}
        });

       });

       test('checkAuthToken debe de fallar si no hay token', async() => { 

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () =>  useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{( children )}</Provider> 
        });

        await act( async() => {
            await result.current.checkAuthToken();
        });
        
        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated',
            user: {}
        })

        });

        test('checkAuthToken debe de autenticar el usuario si hay un token', async() => { 
            
            const { data } = await calendarApi.post('/auth', testUserCredentials );
            localStorage.setItem( 'token', data.token );

            const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () =>  useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{( children )}</Provider> 
        });

        await act( async() => {
            await result.current.checkAuthToken();
        });
        
        const { errorMessage, status, user } = result.current;
        
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test user', uid: '64483c6be8279c79fb89fee1' }
        })

         });


        test('startLogout debe de desloguear al usuario', async() => { 
            const mockStore = getMockStore({ ...authenticatedState });
            const { result } = renderHook( () =>  useAuthStore(), {
                wrapper: ({ children }) => <Provider store={ mockStore }>{( children )}</Provider> 
            });

            await act( async() => {
                await result.current.startLogout();
            });

            const { errorMessage, status, user } = result.current;
            expect({errorMessage,status,user}).toEqual({
                errorMessage: undefined, 
                status: 'not-authenticated',
                user: {}
            })

         });

      

 });