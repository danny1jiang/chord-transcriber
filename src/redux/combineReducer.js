import {combineReducers} from "@reduxjs/toolkit";
import {mediaReducer} from "./mediaRedux/mediaReduxReducer";

export const rootReducer = combineReducers({
	media: mediaReducer,
});
