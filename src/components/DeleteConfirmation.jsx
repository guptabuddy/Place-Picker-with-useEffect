import { useEffect } from "react";

export default function DeleteConfirmation({ onConfirm, onCancel }) {
	// DeleteConfirmation is a component which is rendered inside the Modal component. But this component will be rendered only when the modal is open (using modalIsOpen state, i.e. in open prop), which we can see in the Modal component.
	// So this component and ultimately the timer will not run until the Modal is opened.
	useEffect(() => {
		console.log("Timer set");
		const timerId = setTimeout(() => {
			onConfirm();
		}, 3000);
		// ABOVE IS THE EFFECT FUNCTION

		// BELOW IS THE CLEANUP FUNCTION, WHICH IS RETURNED FROM INSIDE THE EFFECT FUNCTION
		return () => {
			console.log("Timer cleared");
			clearTimeout(timerId);
		};
	}, []);

	return (
		<div id="delete-confirmation">
			<h2>Are you sure?</h2>
			<p>Do you really want to remove this place?</p>
			<div id="confirmation-actions">
				<button onClick={onCancel} className="button-text">
					No
				</button>
				<button onClick={onConfirm} className="button">
					Yes
				</button>
			</div>
		</div>
	);
}
