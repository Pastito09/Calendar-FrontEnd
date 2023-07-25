import { useDispatch, useSelector } from "react-redux";
import { onOpenModal, onCloseModal } from "../store";


export const useUiStore = () => {

    const dispatch = useDispatch();

    const { isDateModalOpen } = useSelector( state => state.ui );

    const openDateModal = () => {
        dispatch( onOpenModal() );
   };

   const closeDateModal = () => {
        dispatch( onCloseModal() );
   }; 
   
   const toggleDateModal = () => {
          (isDateModalOpen)
               ? closeDateModal()
               : openDateModal();
   };

    return {
        //Properties
        isDateModalOpen,

        //metodos
        openDateModal,
        closeDateModal,
        toggleDateModal
   }

};