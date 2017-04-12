'use strict';

var _reduxActions = require('redux-actions');

const isListProp = propName => propName.endsWith('List');

const propNameToSet = propName => `${propName}Set`;
const propNameToAdd = propName => `${propName}Add`;
const propNameToRemove = propName => `${propName}Remove`;

const setterAction = propName => ({
    [propNameToSet(propName)]: (state, _ref) => {
        let payload = _ref.payload;
        return Object.assign({}, state, { [propName]: payload });
    }
});

const listAddAction = propName => ({
    [propNameToAdd(propName)]: (state, _ref2) => {
        let payload = _ref2.payload;

        const currentList = state[propName] || [];

        currentList.push(payload);

        return Object.assign({}, state, { [propName]: currentList });
    }
});

const listRemoveAction = propName => ({
    [propNameToRemove(propName)]: (state, _ref3) => {
        let payload = _ref3.payload;

        if (typeof state[propName] === 'undefined' || !state[propName].length) {
            return state;
        }

        return Object.assign({}, state, { [propName]: state[propName].filter(item => item !== payload) });
    }
});

const propToHandler = propName => {
    if (isListProp(propName)) {
        return Object.assign({}, setterAction(propName), listAddAction(propName), listRemoveAction(propName));
    } else {
        return Object.assign({}, setterAction(propName));
    }
};

const reduceToHandler = props => props.reduce((handlers, propName) => Object.assign({}, handlers, propToHandler(propName)), {});

const makeReducerForProps = props => {
    const actionHandlers = props.length ? reduceToHandler(props) : {};

    return (0, _reduxActions.handleActions)(actionHandlers, {});
};

const propToAction = propName => {
    if (isListProp(propName)) {
        return {
            [propNameToSet(propName)]: (0, _reduxActions.createAction)(propNameToSet(propName)),
            [propNameToAdd(propName)]: (0, _reduxActions.createAction)(propNameToAdd(propName)),
            [propNameToRemove(propName)]: (0, _reduxActions.createAction)(propNameToRemove(propName))
        };
    } else {
        return {
            [propNameToSet(propName)]: (0, _reduxActions.createAction)(propNameToSet(propName))
        };
    }
};

const reduceToActions = props => props.reduce((actions, propName) => Object.assign({}, actions, propToAction(propName)), {});

const makeActionsForProps = props => props.length ? reduceToActions(props) : {};

const makeDispatchToProps = actions => dispatch => {
    let result = {};

    for (const actionName in actions) {
        result[actionName] = value => dispatch(actions[actionName](value));
    }

    return result;
};

module.exports = stateProps => {
    const reducer = makeReducerForProps(stateProps);
    const actions = makeActionsForProps(stateProps);
    const getDispatchToProps = makeDispatchToProps(actions);

    return {
        reducer,
        actions,
        getDispatchToProps
    };
};