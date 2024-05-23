import { createSlice, createAsyncThunk, createEntityAdapter} from "@reduxjs/toolkit"
import { useHttp } from "../../hooks/http.hook";

const filterAdapter = createEntityAdapter();

const initialState = filterAdapter.getInitialState({
    filterLoadingStatus: 'idle',
    currentAction: 'all'
})

export const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',
    () => {
        const {request} = useHttp();
        return  request("http://localhost:3001/filters", "GET")
    }
)

const filterSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        heroesFilter: (state, action) => {
            state.currentAction = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, state => {state.filterLoadingStatus = "loading"})
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filterLoadingStatus = "idle";
                filterAdapter.setAll(state, action.payload)
            })
            .addCase(fetchFilters.rejected, state => {state.filterLoadingStatus = 'error'})
            .addDefaultCase(() => {})
    }
})

const {actions, reducer} = filterSlice;

export default reducer;

export const selector = filterAdapter.getSelectors(state => state.filters);

export const {
    filtersFetched,
    filtersFetching,
    filtersFetchingError,
    heroesFilter
} = actions