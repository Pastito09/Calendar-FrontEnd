import { onCloseModal, onOpenModal, uiSlice } from "../../../src/store/ui/uiSlice";

describe('Pruebas en uiSlice', () => { 

    test('debe de regresar el estado por defecto', () => { 
        
    expect( uiSlice.getInitialState() ).toEqual({ isDateModalOpen: false });

     });

     test('debe de cambiar el isDateModalOpen correctamente', () => { 

        let state = uiSlice.getInitialState();
        state = uiSlice.reducer( state, onOpenModal() );
        expect( state.isDateModalOpen ).toBeTruthy();

        state = uiSlice.reducer( state, onCloseModal() );
        expect(state.isDateModalOpen ).toBeFalsy();

      });

 });