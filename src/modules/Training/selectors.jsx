import * as R from 'ramda';
import { moduleName } from './ducks';

const local = (state) => state[moduleName];

export const userInfo = (state) => {
    return R.path(['userInfo'], state);
};
export const selectCategories = (state) => {
    return local(state).selectCategories;
};
export const selectPlaylists = (state) => {
    return R.path(['playlists'], local(state));
};
export const selectPlaylist = (state) => {
    return R.path(['playlist'], local(state));
};
export const selectPlaylistCollapsed = (state) => {
    return R.path(['playlistCollapsed'], local(state));
};
export const selectModuleSelectedTab = (state) => {
    return local(state).selectedModuleTabName;
};
export const selectVideoSelectedTab = (state) => {
    return local(state).selectedVideoTabName;
};
export const selectExercise = (state) => {
    return R.path(['exercise'], local(state));
};
export const selectSingleVideo = (state) => {
    return R.path(['video'], local(state))
}
export const selectMlmUserInfo = R.path(['userInfo', 'mlmUserInfo']);
export const selectComments = state => R.path(['comments'], local(state))
