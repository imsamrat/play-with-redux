const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
const fetch = require("node-fetch");

// initial state
const initialState = {
    loading: false,
    videos: [],
    error: "",
    sort: "",
};

// create async thunk
const fetchVideos = createAsyncThunk("video/fetchVideos", async () => {
    const response = await fetch(
        "http://localhost:9000/videos"
    );
    const videos = await response.json();

    return videos;
});

const getRelatedVideos = createAsyncThunk("video/fetchRelatedVideos", async ({tags, id}) => {
  // const limit = 2;
  let queryString =
    tags?.length > 0
      ? tags.map((tag) => `tags_like=${tag}.join("&") + tags_like=${tag}`)  
      : ``;
    const response = await fetch(`http://localhost:9000/videos?${queryString}`);
    const relatedVideos = await response.json();

    return relatedVideos;
});

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
      setSort: (state, action) => {
        state.sort = action.payload;
      },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchVideos.pending, (state, action) => {
            state.loading = true;
            state.error = "";
        });

        builder.addCase(fetchVideos.fulfilled, (state, action) => {
            state.loading = false;
            state.error = "";
            state.videos = action.payload;
        });
        builder.addCase(fetchVideos.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.videos = [];
        });
        builder.addCase(getRelatedVideos.pending, (state) => {
          state.error = null;
          state.loading = true;
        })
        builder.addCase(getRelatedVideos.fulfilled, (state, action) => {
          state.loading = false;
          state.relatedVideos = action.payload;
        })
        builder.addCase(getRelatedVideos.rejected, (state, action) => {
          state.loading = false;
          state.relatedVideos = [];
          state.error = action.error?.message;
        });
    },
});

module.exports = videoSlice.reducer;
module.exports.fetchVideos = fetchVideos;
module.exports.getRelatedVideos = getRelatedVideos;
module.exports.setSort = videoSlice.actions;
