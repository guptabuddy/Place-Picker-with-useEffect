// import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

// const Modal = forwardRef(function Modal({ children }, ref) {
export default function Modal({ children, open, onClose }) {
	const dialog = useRef();

	// useImperativeHandle(ref, () => {
	//   return {
	//     open: () => {
	//       dialog.current.showModal();
	//     },
	//     close: () => {
	//       dialog.current.close();
	//     },
	//   };
	// });

	//
	// NOW WE WILL USE useEffect() IN PLACE OF useImperativeHandle()
	// ==========================================
	// HERE WE ARE USING useEffect(), AS IF WE DO NOT USE useEffect() THEN THE CODE WILL BE EXECUTED SYNCHRONOUSLY, AND THE MODAL WILL NOT BE OPENED OR CLOSED PROPERLY. THAT IS BECAUSE THE REF VARIABLE WILL NOT BE CONNECTED TO THE DOM ELEMENT REFERENCE, SO IT WILL BE NULL.
	// AND IF WE USE useEffect() THEN THE CODE INSIDE THE useEffect() WILL BE EXECUTED AFTER THE DOM ELEMENT IS CONNECTED TO THE REF VARIABLE, SO WE CAN USE THE REF VARIABLE TO CONTROL THE MODAL OPENING AND CLOSING.
	useEffect(() => {
		if (open) {
			dialog.current.showModal();
		} else {
			dialog.current.close();
		}
	}, [open]);

	return createPortal(
		<dialog className="modal" onClose={onClose} ref={dialog}>
			{children}
		</dialog>,
		document.getElementById("modal")
	);
}

// export default Modal;
