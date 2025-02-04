export function mediaSelector(state) {
	return state.media.file;
}

export function timeSelector(state) {
	return state.media.time;
}

export function cursorTimeSelector(state) {
	return state.media.cursorTime;
}

export function playingSelector(state) {
	return state.media.playing;
}
