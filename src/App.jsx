import { useRef, useState, useEffect } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

// BELOW IS A SIDE EFFECT WHICH DOES NOT NEED useEffect
const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
// const storedPlaces = storedIds.map((id) => AVAILABLE_PLACES.find((place) => place.id === id));
// const storedPlaces = AVAILABLE_PLACES.filter((place) => storedIds.indexOf(place.id) !== -1);
const storedPlaces = AVAILABLE_PLACES.filter((place) => storedIds.includes(place.id));

// WE PLACED THE ABOVE SIDE EFFECT OUTSIDE OF THE APP COMPONENT FUNCTION, BECAUSE WE DO NOT NEED ANYTHING FROM THE APP COMPONENT FUNCTION FOR THIS SIDE EFFECT.
// AND WE DO NOT WANT THIS SIDE EFFECT TO RUN AGAIN IF THE APP COMPONENT FUNCTION IS RE-EXECUTED. WE NEED THE PREVIOUSLY STORED PLACES JUST ONCE, TO SHOW THEM WHEN THE APP STARTS

function App() {
	const selectedPlace = useRef();
	// const modal = useRef();
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [availablePlaces, setAvailablePlaces] = useState([]);
	const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES, position.coords.latitude, position.coords.longitude);
			setAvailablePlaces(sortedPlaces);
		});

		// THIS I HAVE TO CHECK, HOW CAN I SORT THE STORED SELECTED PLACES
		// ========
		// navigator.geolocation.getCurrentPosition((position) => {
		// 	const sortedStoredPlaces = sortPlacesByDistance(storedPlaces, position.coords.latitude, position.coords.longitude);
		// 	setPickedPlaces(sortedStoredPlaces);
		// });
	}, []);

	function handleStartRemovePlace(id) {
		// modal.current.open();

		// NOW WE WILL USE useEffect() IN PLACE OF useImperativeHandle() IN MODAL COMPONENT, SO WE USED THIS STATE UPDATING FUNCTION
		setModalIsOpen(true);
		selectedPlace.current = id;
		// Here we are using the selectedPlace ref, because we need to access the id of the place that was selected, but that ID might loss in between the modal opening and closing (as the component function might re-execute).
		// So we used the ref to store the selected place ID, so that even if the component function is re-executed, the selected place ID is still available.
	}

	function handleStopRemovePlace() {
		// modal.current.close();

		// NOW WE WILL USE useEffect() IN PLACE OF useImperativeHandle() IN MODAL COMPONENT, SO WE USED THIS STATE UPDATING FUNCTION
		setModalIsOpen(false);
	}

	function handleSelectPlace(id) {
		setPickedPlaces((prevPickedPlaces) => {
			if (prevPickedPlaces.some((place) => place.id === id)) {
				return prevPickedPlaces;
			}
			const place = AVAILABLE_PLACES.find((place) => place.id === id);
			return [place, ...prevPickedPlaces];

			// THIS I HAVE TO CHECK, HOW CAN I SORT THE STORED SELECTED PLACES
			// =======
			// const sortedStoredPlaces = [place, ...prevPickedPlaces];
			// let newSortedStoredPlaces;
			// navigator.geolocation.getCurrentPosition((position) => {
			// 	newSortedStoredPlaces = sortPlacesByDistance(sortedStoredPlaces, position.coords.latitude, position.coords.longitude);
			// 	// console.log(newSortedStoredPlaces);
			// });
			// return newSortedStoredPlaces;
			// // console.log(newSortedStoredPlaces);
		});

		const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
		if (storedIds.indexOf(id) === -1) {
			localStorage.setItem("selectedPlaces", JSON.stringify([id, ...storedIds]));
		}
	}

	function handleRemovePlace() {
		setPickedPlaces((prevPickedPlaces) => prevPickedPlaces.filter((place) => place.id !== selectedPlace.current));
		// Here we are using the selectedPlace ref, because we need to access the id of the place that was selected, but that ID might loss in between the modal opening and closing (as the component function might re-execute).
		// So we used the ref to store the selected place ID, so that even if the component function is re-executed, the selected place ID is still available.
		// modal.current.close();

		// NOW WE WILL USE useEffect() IN PLACE OF useImperativeHandle() IN MODAL COMPONENT, SO WE USED THIS STATE UPDATING FUNCTION
		setModalIsOpen(false);

		const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
		localStorage.setItem("selectedPlaces", JSON.stringify(storedIds.filter((id) => id != selectedPlace.current)));
		// Remember to convert the Array to string form while storing the data into local storage, and also to convert the string back to array form when retrieving the data from local storage. (Using JSON.stringify  &&  JSON.parse methods respectively)
	}

	return (
		<>
			{/* <Modal ref={modal}> */}
			<Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
				<DeleteConfirmation onCancel={handleStopRemovePlace} onConfirm={handleRemovePlace} />
			</Modal>

			<header>
				<img src={logoImg} alt="Stylized globe" />
				<h1>PlacePicker</h1>
				<p>Create your personal collection of places you would like to visit or you have visited.</p>
			</header>
			<main>
				<Places
					title="I'd like to visit ..."
					fallbackText={"Select the places you would like to visit below."}
					places={pickedPlaces}
					onSelectPlace={handleStartRemovePlace}
				/>
				{/* <Places title="Available Places" places={AVAILABLE_PLACES} onSelectPlace={handleSelectPlace} /> */}
				<Places
					title="Available Places"
					fallbackText="Sorting Places by distance...."
					places={availablePlaces}
					onSelectPlace={handleSelectPlace}
				/>
			</main>
		</>
	);
}

export default App;
