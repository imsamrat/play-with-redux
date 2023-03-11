const store = require("./app/store");
const { fetchVideos, getRelatedVideos } = require("./features/video/videoSlice");


// subscribe to state changes
store.subscribe(() => {
    // console.log(store.getState());
});

// disptach actions
store.dispatch(fetchVideos());
store.dispatch(getRelatedVideos());
