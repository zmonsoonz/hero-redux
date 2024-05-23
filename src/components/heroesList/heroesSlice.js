import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import {useHttp} from '../../hooks/http.hook'; 
import { createSelector } from "@reduxjs/toolkit";

const heroesAdapter = createEntityAdapter();

const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: 'idle'
})

export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    async () => {
        const {request} = useHttp();
        return await request("http://localhost:3001/heroes", "GET")
    }
)

const heroesSlice = createSlice({
    name: "heroes",
    initialState,
    reducers: {
        heroesDelete: (state, action) => {
            heroesAdapter.removeOne(state, action.payload);
        },
        heroesAdd: (state, action) => {heroesAdapter.addOne(state, action.payload);}
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = "loading"})
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus = "idle";
                heroesAdapter.setAll(state, action.payload);
            })
            .addCase(fetchHeroes.rejected, state => {state.heroesLoadingStatus = 'error'})
            .addDefaultCase(() => {})
    }
});

const {actions, reducer} = heroesSlice;

export default reducer;

const {selectAll} = heroesAdapter.getSelectors(state => state.heroes);

export const filterHeroesSelector = createSelector(
    (state) => state.filters.currentAction,
    selectAll,
    (filter, heroes) => {
        if (filter === "all") {
            return heroes
        }
        else {
            return heroes.filter(item => item.element === filter)
        }
    }
)

export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroesDelete,
    heroesAdd
} = actions