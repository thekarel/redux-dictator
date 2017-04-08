import {createAction, handleActions} from 'redux-actions'

const isListProp = (propName) => propName.endsWith('List')

const propNameToAdd = (propName) => `${propName}Add`
const propNameToRemove = (propName) => `${propName}Remove`

const setterAction = (propName) => ({
    [propName]: (state, {payload}) => ({...state, [propName]: payload})
})

const listAddAction = (propName) => ({
    [propNameToAdd(propName)]: (state, {payload}) => {
        const currentList = state[propName] || []

        currentList.push(payload)

        return ({...state, [propName]: currentList})
    }
})

const listRemoveAction = (propName) => ({
    [propNameToRemove(propName)]: (state, {payload}) => {
        if (typeof state[propName] === 'undefined' || !state[propName].length) {
            return state
        }

        return ({...state, [propName]: state[propName].filter((item) => item !== payload)})
    }
})

const propToHandler = (propName) => {
    if (isListProp(propName)) {
        return ({
            ...setterAction(propName),
            ...listAddAction(propName),
            ...listRemoveAction(propName),
        })
    } else {
        return ({
            ...setterAction(propName)
        })
    }
}

const reduceToHandler = (props) => props.reduce(
    (handlers, propName) => ({
        ...handlers,
        ...propToHandler(propName)
    }), {})

const makeReducerForProps = (props) => {
    const actionHandlers = props.length
        ? reduceToHandler(props)
        : {}

    return handleActions(actionHandlers, {})
}

const propToAction = (propName) => {
    if (isListProp(propName)) {
        return ({
            [propName]: createAction(propName),
            [propNameToAdd(propName)]: createAction(propNameToAdd(propName)),
            [propNameToRemove(propName)]: createAction(propNameToRemove(propName)),
        })
    } else {
        return ({
            [propName]: createAction(propName)
        })
    }
}

const reduceToActions = (props) => props.reduce(
    (actions, propName) => ({
        ...actions,
        ...propToAction(propName)
    }), {})

const makeActionsForProps = (props) => props.length
    ? reduceToActions(props)
    : {}

const makeDispatchToProps = (actions) => (dispatch) => {
    let result = {}

    for (const actionName in actions) {
        result[actionName] = (value) => dispatch(actions[actionName](value))
    }

    return result
}

module.exports = (stateProps) => {
    const reducer = makeReducerForProps(stateProps)
    const actions = makeActionsForProps(stateProps)
    const getDispatchToProps = makeDispatchToProps(actions)

    return {
        reducer,
        actions,
        getDispatchToProps,
    }
}
