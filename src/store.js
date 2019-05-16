import {createStore, combineReducers, applyMiddleware} from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

import math from "./reducers/mathReducer";
import user from "./reducers/userReducer";

export const SHOW = 'loading-bar/SHOW'
export const HIDE = 'loading-bar/HIDE'
export const RESET = 'loading-bar/RESET'

export const DEFAULT_SCOPE = 'default'

export function showLoading(scope = DEFAULT_SCOPE) {
    return {
        type: SHOW,
        payload: {
            scope,
        },
    }
}

export function hideLoading(scope = DEFAULT_SCOPE) {
    return {
        type: HIDE,
        payload: {
            scope,
        },
    }
}

export function resetLoading(scope = DEFAULT_SCOPE) {
    return {
        type: RESET,
        payload: {
            scope,
        },
    }
}

export function loadingBarReducer(state = {}, action = {}) {
    const { scope = DEFAULT_SCOPE } = (action.payload || {})

    switch (action.type) {
        case SHOW:
            return {
                ...state,
                [scope]: (state[scope] || 0) + 1,
            }
        case HIDE:
            return {
                ...state,
                [scope]: Math.max(0, (state[scope] || 1) - 1),
            }
        case RESET:
            return {
                ...state,
                [scope]: 0,
            }
        default:
            return state
    }
}

export function loadingBarMiddleware(config = {}) {
    console.log('=================================')
    const promiseTypeSuffixes = ['PENDING', 'FULFILLED', 'REJECTED'];
    const scope = config.scope || DEFAULT_SCOPE

    return ({ dispatch }) => next => (action) => {
        console.log('#####################################')
        if (action.type) {
            const [PENDING, FULFILLED, REJECTED] = promiseTypeSuffixes

            const isPending = new RegExp(`${PENDING}$`, 'g')
            const isFulfilled = new RegExp(`${FULFILLED}$`, 'g')
            const isRejected = new RegExp(`${REJECTED}$`, 'g')

            const actionScope = (action.meta && action.meta.scope) ||
                action.scope ||
                scope
console.log(action.type)
            if (action.type.match(isPending)) {
                dispatch(showLoading(actionScope))
            } else if (action.type.match(isFulfilled) ||
                action.type.match(isRejected)) {
                dispatch(hideLoading(actionScope))
            }
        }

        return next(action)
    }
}

export default createStore(
    combineReducers({
        math,
        user,
        loadingBarReducer
    }),
    {},
    applyMiddleware(logger, thunk, promise, loadingBarMiddleware())
);