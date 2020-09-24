import React, {createContext} from 'react'


export const ModalContext = createContext({
    isModalVisible: false,
    setModalVisibility: () => {},
    modalContext: null,
    setModalContext: () => {}
})