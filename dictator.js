import {createAction, handleActions} from 'redux-actions'

const reduceToHandler = (props) => props.reduce(
    (handlers, name) => ({
        ...handlers,
        [name]: (state, {payload}) => ({...state, [name]: payload})
    }), {})

const makeReducerForProps = (props) => {
    const actionHandlers = props.length
        ? reduceToHandler(props)
        : {}

    return handleActions(actionHandlers, {})
}

const reduceToActions = (props) => props.reduce(
    (actions, name) => ({
        ...actions,
        [name]: createAction(name)
    }), {})

const makeActionsForProps = (props) => props.length
    ? reduceToActions(props)
    : {}

export default (stateProps) => {
    const reducer = makeReducerForProps(stateProps)
    const actions = makeActionsForProps(stateProps)

    return {
        reducer,
        actions,
    }
}
