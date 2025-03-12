import "./App.css";
import {useState} from "react";
import {ChordListComponent} from "./components/chordComponent";
import {store} from "./redux/reduxStore";
import {setMediaAction} from "./redux/mediaRedux/mediaReduxActions";
import {MediaPlayerComponent} from "./components/mediaPlayerComponent";
import {FileUploader} from "react-drag-drop-files";

function App() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [chordInfo, setChordInfo] = useState("");
	const [isPredicting, setIsPredicting] = useState(false);

	let onFileChange = (file) => {
		console.log(file);
		setSelectedFile(file);
	};

	let onFileUpload = async () => {
		const apiUrl = "https://firedanx.pythonanywhere.com/";

		if (selectedFile === null) {
			return false;
		}

		const formData = new FormData();
		formData.append("file", selectedFile);
		console.log("Started fetch...");
		setIsPredicting(true);

		const response = await fetch(apiUrl, {
			method: "POST",
			cache: "no-cache",
			body: formData,
		});
		setIsPredicting(false);

		let json = await response.text();
		setChordInfo(json);
		const mediaUrl = URL.createObjectURL(selectedFile);
		store.dispatch(setMediaAction(mediaUrl));
		return true;
	};

	return (
		<div className="App">
			<header className="App-header">
				<h1>Chord Recognition</h1>
				<div>
					<FileUploader
						dropMessageStyle={{opacity: 0}}
						handleChange={onFileChange}
						name="file"
					>
						<div
							style={{
								width: "500px",
								borderColor: "#777777",
								borderStyle: "dashed",
								backgroundColor: "#44464c",
								borderRadius: "10px",
							}}
						>
							<p>Drag and Drop or select your file here</p>
						</div>
					</FileUploader>
					{selectedFile ? (
						<p style={{color: "white"}}>{selectedFile.name}</p>
					) : (
						<p style={{color: "white"}}>No file selected</p>
					)}
					<button
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							borderWidth: "0px",
							width: "500px",
							height: "50px",
							backgroundColor: "#44464c",
							borderRadius: "10px",
							marginTop: "20px",
							marginBottom: "20px",
						}}
						onClick={onFileUpload}
					>
						{isPredicting ? (
							<p style={{color: "white", fontSize: 25}}>Predicting...</p>
						) : (
							<p style={{color: "white", fontSize: 25}}>Predict Chords</p>
						)}
					</button>
				</div>
				<div
					style={{
						top: "1px",
						width: "80.5%",
						position: "sticky",
						overflow: "",
						zIndex: "1",
					}}
				>
					<MediaPlayerComponent />
				</div>
				<ChordListComponent secondsPerRow={5} chordInfo={chordInfo} />
			</header>
		</div>
	);
}

export default App;
