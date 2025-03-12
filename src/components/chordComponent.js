import {useSelector} from "react-redux";
import {store} from "../redux/reduxStore";
import {
	cursorTimeSelector,
	playingSelector,
	timeSelector,
} from "../redux/mediaRedux/mediReduxSelector";
import {useEffect, useState} from "react";
import {setCursorTimeAction} from "../redux/mediaRedux/mediaReduxActions";

const wWidth = window.innerWidth;

const chordNames = {
	perf5: "5",
	maj3: "M3",
	min9: "m9",
	maj: "M",
	aug: "aug",
	"7sus4": "7sus4",
	dim: "dim",
	"7sus2": "7sus2",
	min7b5: "m7b5",
	min7: "m7",
	octave: "octave",
	min3: "m3",
	seventhb9: "7b9",
	dim7: "dim7",
	maj7: "M7",
	maj9: "M9",
	seventh: "7",
	tritone: "tritone",
	sus2: "sus2",
	min: "m",
	sus4: "sus4",
	"9sus4": "9sus4",
};

export function ChordListComponent({chordInfo, secondsPerRow}) {
	const chords = [];

	if (chordInfo === "") {
		return;
	}

	console.log(chordInfo);
	chordInfo = JSON.parse(chordInfo);

	let rowChords = [];
	let currentRow = 0;

	for (let i = 0; i < chordInfo.length; i++) {
		let tStart = chordInfo[i][1];
		currentRow = Math.floor(tStart / secondsPerRow);
		console.log(chordInfo[i] + " " + currentRow);

		// Add chord to the current row
		if (rowChords[currentRow] === undefined) {
			rowChords[currentRow] = [];
		}
		rowChords[currentRow].push(
			<ChordComponent
				chord={chordInfo[i][3]}
				tStart={chordInfo[i][1]}
				secondsPerRow={secondsPerRow}
				rowStart={Math.floor(tStart / secondsPerRow) * secondsPerRow} // start of the row
				key={i}
				index={i}
			/>
		);

		currentRowStart = tStart;
	}
	for (let i = 0; i < rowChords.length; i++) {
		if (rowChords[i] === undefined) {
			rowChords[i] = [];
		}
		chords.push(
			<ChordRowComponent
				chords={rowChords[i]}
				key={i}
				secondsPerRow={secondsPerRow}
				index={i}
			/>
		);
	}

	// Push the last row if it exists
	/*if (rowChords.length > 0) {
		chords.push(
			<ChordRowComponent
				chords={rowChords}
				key={currentRow + 1}
				secondsPerRow={secondsPerRow}
				index={currentRow + 1}
			/>
		);
	}*/

	return <div style={containerStyle}>{chords}</div>;
}

function onMouseDown(e, rowNum, secondsPerRow) {
	const bounds = e.currentTarget.getBoundingClientRect();
	const x = e.clientX - bounds.left;
	const xDim = bounds.right - bounds.left;
	if (x <= xDim) {
		let normalizedX = x / xDim;
		let time = Math.max(normalizedX * secondsPerRow + rowNum * secondsPerRow, 0);
		console.log("Mouse down " + time + " " + rowNum);
		store.dispatch({type: "media/setTime", payload: time});
	}
}

function ChordRowComponent({chords, index, secondsPerRow}) {
	const actualTime = useSelector(timeSelector);
	const time = useSelector(cursorTimeSelector);
	const [currTime, setCurrTime] = useState(time);
	const playing = useSelector(playingSelector);

	useEffect(() => {
		store.dispatch(setCursorTimeAction(actualTime));
	}, [actualTime]);

	useEffect(() => {
		setCurrTime(time);
	}, [time]);

	useEffect(() => {
		let interval;
		if (playing) {
			interval = setInterval(() => {
				setCurrTime((prevTime) => prevTime + 0.01);
			}, 10);
		} else if (interval !== undefined) {
			clearInterval(interval);
		}
		return () => {
			if (interval !== undefined) {
				clearInterval(interval);
			}
		};
	}, [playing]);

	const left = ((currTime % secondsPerRow) / secondsPerRow) * (wWidth * 0.8);
	let opacity = 0;
	if (Math.floor(currTime / secondsPerRow) === index) {
		opacity = 1;
	}

	return (
		<div
			onMouseDown={(e) => {
				onMouseDown(e, index, secondsPerRow);
			}}
			style={chordRowStyle}
		>
			<div style={barStyle(left, opacity)} />
			{chords}
		</div>
	);
}

function ChordComponent({chord, tStart, secondsPerRow, rowStart}) {
	// Calculate the left position based on the start time within the row
	const leftPercent = ((tStart - rowStart) / secondsPerRow) * 100;

	if (chord === "") return null;

	let chordSplit = chord.split(" ");
	let note = chordSplit[0];
	let type = chordSplit[1];
	if (type === "octave" || type === "tritone") return null;

	let name = chordNames[type];

	return (
		<div style={chordStyle(leftPercent)}>
			<p style={{verticalAlign: "middle"}}>{note + name}</p>
		</div>
	);
}

// Styles

const containerStyle = {
	display: "flex",
	alignItems: "center",
	flexDirection: "column",
	width: "100%",
	backgroundColor: "#282c34",
	marginTop: "20px",
};

const chordRowStyle = {
	alignItems: "center",
	display: "flex",
	position: "relative", // relative positioning to allow absolute-positioned chord blocks
	width: wWidth * 0.8,
	height: "100px", // height of each row
	backgroundColor: "#44464c",
	borderRadius: "10px",
	marginBottom: "10px",
};

const barStyle = (left = 0, opacity = 0) => ({
	position: "absolute",
	opacity: opacity,
	backgroundColor: "white",
	height: "110px",
	width: "10px",
	borderRadius: "10px",
	left: left + "px",
});

const chordStyle = (leftPercent = 0) => ({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	position: "absolute", // absolute positioning within the row
	left: `${leftPercent}%`, // place based on start time
	height: "50%",
	backgroundColor: "#777777",
	borderRadius: "10px",
	padding: "1%",
	textAlign: "center",
	color: "white",
});
