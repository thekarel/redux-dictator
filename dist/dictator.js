'use strict';

var _reduxActions = require('redux-actions');

const isListProp = function (propName) {
    return propName.endsWith('List');
};

const propNameToSet = function (propName) {
    return `${propName}Set`;
};
const propNameToAdd = function (propName) {
    return `${propName}Add`;
};
const propNameToRemove = function (propName) {
    return `${propName}Remove`;
};

const setterAction = function (propName) {
    return {
        [propNameToSet(propName)]: function (state, _ref) {
            let payload = _ref.payload;
            return Object.assign({}, state, { [propName]: payload });
        }
    };
};

const listAddAction = function (propName) {
    return {
        [propNameToAdd(propName)]: function (state, _ref2) {
            let payload = _ref2.payload;

            const currentList = state[propName] || [];

            currentList.push(payload);

            return Object.assign({}, state, { [propName]: currentList });
        }
    };
};

const listRemoveAction = function (propName) {
    return {
        [propNameToRemove(propName)]: function (state, _ref3) {
            let payload = _ref3.payload;

            if (typeof state[propName] === 'undefined' || !state[propName].length) {
                return state;
            }

            return Object.assign({}, state, { [propName]: state[propName].filter(function (item) {
                    return item !== payload;
                }) });
        }
    };
};

const propToHandler = function (propName) {
    if (isListProp(propName)) {
        return Object.assign({}, setterAction(propName), listAddAction(propName), listRemoveAction(propName));
    } else {
        return Object.assign({}, setterAction(propName));
    }
};

const reduceToHandler = function (props) {
    return props.reduce(function (handlers, propName) {
        return Object.assign({}, handlers, propToHandler(propName));
    }, {});
};

const makeReducerForProps = function (props) {
    const actionHandlers = props.length ? reduceToHandler(props) : {};

    return (0, _reduxActions.handleActions)(actionHandlers, {});
};

const propToAction = function (propName) {
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

const reduceToActions = function (props) {
    return props.reduce(function (actions, propName) {
        return Object.assign({}, actions, propToAction(propName));
    }, {});
};

const makeActionsForProps = function (props) {
    return props.length ? reduceToActions(props) : {};
};

const makeDispatchToProps = function (actions) {
    return function (dispatch) {
        let result = {};

        for (const actionName in actions) {
            result[actionName] = function (value) {
                return dispatch(actions[actionName](value));
            };
        }

        return result;
    };
};

module.exports = function (stateProps) {
    const reducer = makeReducerForProps(stateProps);
    const actions = makeActionsForProps(stateProps);
    const getDispatchToProps = makeDispatchToProps(actions);

    return {
        reducer,
        actions,
        getDispatchToProps
    };
};