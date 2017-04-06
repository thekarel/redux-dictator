# Redux Dictator

List your required state variables by name and get a reducer, actions
and dispatch-to-props automagically. 88% less Redux boilerplate! 🎉

Great for prototyping plus allows you to gradually move to more elaborate solutions. 🏎

State variables named `List` get extra actions to easily add and remove items -- see `dictator.spec.js` for details.

[![Build Status](https://travis-ci.org/thekarel/redux-dictator.svg?branch=master)](https://travis-ci.org/thekarel/redux-dictator)

## Before

```
const AMOUNT = 'app/shop/AMOUNT'
const PRICE = 'app/shop/PRICE'
const SIZE = 'app/shop/SIZE'

export const amount = createAction(AMOUNT)
export const price = createAction(PRICE)
export const size = createAction(SIZE)

export default handleActions({
    [AMOUNT]: (state, {payload}) => ({...state, amount: payload})
    [PRICE]: (state, {payload}) => ({...state, price: payload})
    [SIZE]: (state, {payload}) => ({...state, size: payload})
}, {})
```

```
export default connect(
    (state) => ({ /* ... */ }),
    (dispatch) => ({
        amount: (value) => dispatch(amount(value)),
        price: (value) => dispatch(price(value)),
        size: (value) => dispatch(size(value)),
    }),
)(ConnectedComponent)
```

## After

```
const requiredStateProps = [
    amount,
    price,
    size,
]

const {
    actions,
    reducer,
    getDispatchToProps,
} = dictator(requiredStateProps)
```

```
export default connect(
    (state) => ({ /* ... */ }),
    getDispatchToProps,
)(ConnectedComponent)
```

## Lists

```
const {actions} = dictator(['productList'])

actions.productList(['tablet', 'pc'])
actions.productListAdd('phone')
actions.productListRemove('pc')
```
