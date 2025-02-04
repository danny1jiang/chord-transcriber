import {useSelector} from "react-redux";
import {mediaSelector, timeSelector} from "../redux/mediaRedux/mediReduxSelector";
import ReactPlayer from "react-player";
import {useEffect, useRef, useState} from "react";
import {store} from "../redux/reduxStore";
import {
	setCursorTimeAction,
	setPlayingAction,
	setTimeAction,
} from "../redux/mediaRedux/mediaReduxActions";

export function MediaPlayerComponent() {
	const mediaUrl = useSelector(mediaSelector);
	const time = useSelector(timeSelector);
	const mediaRef = useRef();

	useEffect(() => {
		if (mediaRef.current) {
			mediaRef.current.seekTo(time, "seconds");
		}
	}, [time]);

	function onPlay() {
		store.dispatch(setCursorTimeAction(mediaRef.current.getCurrentTime()));
		store.dispatch(setPlayingAction(true));
	}

	function onPause() {
		store.dispatch(setCursorTimeAction(mediaRef.current.getCurrentTime()));
		store.dispatch(setPlayingAction(false));
	}

	function onProgress(state) {
		store.dispatch(setCursorTimeAction(state.playedSeconds));
		console.log(state);
	}

	return (
		<ReactPlayer
			onPlay={onPlay}
			onPause={onPause}
			onProgress={onProgress}
			ref={mediaRef}
			url={mediaUrl} // Use the media URL to play the file
			controls={true}
			playing={false} // Start in paused mode
			width="100%"
			height="50px"
		/>
	);
}
