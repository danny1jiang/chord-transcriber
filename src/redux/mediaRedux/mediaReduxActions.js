export function setMediaAction(media) {
	return {
		type: "media/setFile",
		payload: media,
	};
}

export function setTimeAction(time) {
	return {
		type: "media/setTime",
		payload: time,
	};
}

export function setCursorTimeAction(time) {
	return {
		type: "media/setCursorTime",
		payload: time,
	};
}

export function setPlayingAction(playing) {
	return {
		type: "media/setPlaying",
		payload: playing,
	};
}
