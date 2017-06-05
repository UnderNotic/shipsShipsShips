import { Ship } from 'app/services/csv/ship';
import { ActionReducer, Action } from '@ngrx/store';

const LOAD_SHIPS = 'LOAD_SHIPS';
const LOAD_SHIPS_IDS = 'LOAD_SHIPS_IDS';
const SELECT_SHIP_ID = 'SELECT_SHIP_ID';
const SET_START_DATE = 'SET_START_DATE';
const SET_END_DATE = 'SET_END_DATE';
const SHOW_MENU = 'SHOW_MENU';
const HIDE_MENU = 'HIDE_MENU';
const SET_SHIPS_LOADING_PROGRESS_LEVEL = 'SET_SHIPS_LOADING_PROGRESS_LEVEL';

export interface IState {
    shipsIds: Set<string>;
    ships: Array<Ship>;
    selectedShipId: string;
    areShipsLoading: boolean;
    shipsLoadingIndicatorLevel: number;
    startDate: Date;
    endDate: Date;
    isMenuVisible: boolean;
}

const initialState: IState = {
    shipsIds: new Set<string>(),
    ships: new Array<Ship>(),
    selectedShipId: '',
    areShipsLoading: false,
    shipsLoadingIndicatorLevel: 0,
    startDate: new Date(2017, 4, 4),
    endDate: new Date(2017, 4, 5),
    isMenuVisible: false
};

export function reducer(state = initialState, action: Action) {
    switch (action.type) {
        case LOAD_SHIPS:
            return { ...state, ships: action.payload, areShipsLoading: false };
        case LOAD_SHIPS_IDS:
            return { ...state, shipsIds: action.payload, selectedShipId: Array.from(action.payload)[0] || '', areShipsLoading: false };
        case SELECT_SHIP_ID:
            return { ...state, selectedShipId: action.payload };
        case SET_SHIPS_LOADING_PROGRESS_LEVEL:
            return { ...state, areShipsLoading: true, shipsLoadingIndicatorLevel: action.payload };
        case SET_START_DATE:
            return { ...state, startDate: action.payload };
        case SET_END_DATE:
            return { ...state, endDate: action.payload };
        case SHOW_MENU:
            return { ...state, isMenuVisible: true };
        case HIDE_MENU:
            return { ...state, isMenuVisible: false };
        default:
            return state;
    }
}


export function loadShips(ships: Ship[]): Action {
    return { type: LOAD_SHIPS, payload: ships };
}

export function loadShipsIds(ids: Set<string>): Action {
    return { type: LOAD_SHIPS_IDS, payload: ids };
}

export function selectShipId(id: string): Action {
    return { type: SELECT_SHIP_ID, payload: id };
}

export function setStartDate(date: object): Action {
    return { type: SET_START_DATE, payload: date };
};

export function setEndDate(date: object): Action {
    return { type: SET_END_DATE, payload: date };
};

export function showMenu(): Action {
    return { type: SHOW_MENU };
}

export function hideMenu(): Action {
    return { type: HIDE_MENU };
}

export function setShipsLoadingProgressLevel(level: number): Action {
    return { type: SET_SHIPS_LOADING_PROGRESS_LEVEL, payload: level };
}
