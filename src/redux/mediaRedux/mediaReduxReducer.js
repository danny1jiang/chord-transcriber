const initialState = {
	file: undefined,
	time: 0,
	cursorTime: 0,
	playing: false,
};

export default function mediaReducer(state = initialState, action) {
	switch (action.type) {
		case "media/setFile": {
			return {
				...state,
				file: action.payload,
			};
		}
		case "media/setTime": {
			return {
				...state,
				time: action.payload,
			};
		}
		case "media/setCursorTime": {
			return {
				...state,
				cursorTime: action.payload,
			};
		}
		case "media/setPlaying": {
			return {
				...state,
				playing: action.payload,
			};
		}
	}
	return state;
}
