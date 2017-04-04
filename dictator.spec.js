/* @flow */

import dictator from './dictator'

describe('Redux Dictator', () => {
    describe('Reducer', () => {
        it('returns state for unknown action', () => {
            const {reducer} = dictator([])

            expect(reducer({}, {type: ''})).toEqual({})
        })

        it('creates a setter for a property', () => {
            const stateProps = ['a']
            const {reducer} = dictator(stateProps)

            expect(reducer({}, {type: 'a', payload: 1})).toEqual({
                a: 1
            })
        })

        it('setter only affects relevant property', () => {
            const stateProps = ['a']
            const {reducer} = dictator(stateProps)

            expect(reducer({b: 2}, {type: 'a', payload: 1})).toEqual({
                a: 1,
                b: 2,
            })
        })

        it('creates setter for multiple properties', () => {
            const stateProps = ['a', 'b', 'c']
            const {reducer} = dictator(stateProps)

            expect(reducer({}, {type: 'a', payload: 1})).toEqual({
                a: 1
            })

            expect(reducer({}, {type: 'b', payload: 1})).toEqual({
                b: 1
            })

            expect(reducer({}, {type: 'c', payload: 1})).toEqual({
                c: 1
            })
        })
    })

    describe('Actions', () => {
        it('creates a setter action for a state property', () => {
            const stateProps = ['a']
            const {actions, reducer} = dictator(stateProps)

            expect(reducer({}, actions.a(1))).toEqual({
                a: 1
            })
        })

        it('creates a setter action for multiple properties', () => {
            const stateProps = ['a', 'b']
            const {actions, reducer} = dictator(stateProps)

            const stateA = reducer({}, actions.a(1))

            expect(reducer(stateA, actions.b(2))).toEqual({
                a: 1,
                b: 2,
            })
        })
    })

    describe('Map Dispatch to Props', () => {
        it('returns a dispatch mapping for all actions', () => {
            const dispatch = jest.fn()
            const stateProps = ['price', 'amount']
            const {getDispatchToProps} = dictator(stateProps)
            const mapDispatchToProps = getDispatchToProps(dispatch)

            mapDispatchToProps.price('£1')
            expect(dispatch).toHaveBeenCalledWith({type: 'price', payload: '£1'})

            mapDispatchToProps.amount(2)
            expect(dispatch).toHaveBeenCalledWith({type: 'amount', payload: 2})
        })
    })
})
