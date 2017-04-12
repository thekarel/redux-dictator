const dictator = require('./dictator')

describe('Redux Dictator', () => {
    describe('Reducer', () => {
        it('returns state for unknown action', () => {
            const {reducer} = dictator([])

            expect(reducer({}, {type: ''})).toEqual({})
        })

        it('creates a setter for a property', () => {
            const stateProps = ['a']
            const {reducer} = dictator(stateProps)

            expect(reducer({}, {type: 'aSet', payload: 1})).toEqual({
                a: 1
            })
        })

        it('setter only affects relevant property', () => {
            const stateProps = ['a']
            const {reducer} = dictator(stateProps)

            expect(reducer({b: 2}, {type: 'aSet', payload: 1})).toEqual({
                a: 1,
                b: 2,
            })
        })

        it('creates setter for multiple properties', () => {
            const stateProps = ['a', 'b', 'c']
            const {reducer} = dictator(stateProps)

            expect(reducer({}, {type: 'aSet', payload: 1})).toEqual({
                a: 1
            })

            expect(reducer({}, {type: 'bSet', payload: 1})).toEqual({
                b: 1
            })

            expect(reducer({}, {type: 'cSet', payload: 1})).toEqual({
                c: 1
            })
        })

        describe('List', () => {
            it('adds an item to an empty list', () => {
                const {reducer} = dictator(['itemList'])

                expect(reducer({}, {
                    type: 'itemListAdd',
                    payload: 9
                })).toEqual({
                    itemList: [9]
                })
            })

            it('adds an item to the list', () => {
                const {reducer} = dictator(['urlList'])

                expect(reducer({
                    urlList: [1]
                }, {
                    type: 'urlListAdd',
                    payload: 2
                })).toEqual({
                    urlList: [1, 2]
                })
            })

            it('removing an item from an empty list returns an empty list', () => {
                const {reducer} = dictator(['numberList'])

                expect(reducer({
                    numberList: []
                }, {
                    type: 'numberListRemove',
                    payload: 1,
                })).toEqual({
                    numberList: []
                })
            })

            it('removing an item from an undefined list leaves the list undefined', () => {
                const {reducer} = dictator(['numberList'])

                expect(reducer({}, {
                    type: 'numberListRemove',
                    payload: 1,
                })).toEqual({})
            })

            it('removes an item from a list', () => {
                const {reducer} = dictator(['urlList'])

                expect(reducer({
                    urlList: [1]
                }, {
                    type: 'urlListRemove',
                    payload: 1
                })).toEqual({
                    urlList: []
                })
            })
        })
    })

    describe('Actions', () => {
        it('creates a setter action for a state property', () => {
            const stateProps = ['a']
            const {actions, reducer} = dictator(stateProps)

            expect(reducer({}, actions.aSet(1))).toEqual({
                a: 1
            })
        })

        it('creates a setter action for multiple properties', () => {
            const stateProps = ['a', 'b']
            const {actions, reducer} = dictator(stateProps)

            const stateA = reducer({}, actions.aSet(1))

            expect(reducer(stateA, actions.bSet(2))).toEqual({
                a: 1,
                b: 2,
            })
        })

        describe('List', () => {
            it('creates an action to set the list', () => {
                const {actions, reducer} = dictator(['urlList'])

                expect(reducer({}, actions.urlListSet([1, 2]))).toEqual({
                    urlList: [1, 2]
                })
            })

            it('creates an action to add an item to the list', () => {
                const {actions, reducer} = dictator(['urlList'])

                expect(reducer({urlList: [1]}, actions.urlListAdd(2))).toEqual({
                    urlList: [1, 2]
                })
            })

            it('creates an action to remove an item to the list', () => {
                const {actions, reducer} = dictator(['urlList'])

                expect(reducer({urlList: [1]}, actions.urlListRemove(1))).toEqual({
                    urlList: []
                })
            })
        })
    })

    describe('Map Dispatch to Props', () => {
        const dispatch = jest.fn()

        it('returns a dispatch mapping for all setters', () => {
            const stateProps = ['price', 'amount']
            const {getDispatchToProps} = dictator(stateProps)
            const mapDispatchToProps = getDispatchToProps(dispatch)

            mapDispatchToProps.priceSet('£1')
            expect(dispatch).toHaveBeenCalledWith({type: 'priceSet', payload: '£1'})

            mapDispatchToProps.amountSet(2)
            expect(dispatch).toHaveBeenCalledWith({type: 'amountSet', payload: 2})
        })

        describe('List', () => {
            it('returns a dispatch mapping for list add', () => {
                const stateProps = ['consoleList']
                const {getDispatchToProps} = dictator(stateProps)
                const mapDispatchToProps = getDispatchToProps(dispatch)

                mapDispatchToProps.consoleListAdd('PS4')
                expect(dispatch).toHaveBeenCalledWith({type: 'consoleListAdd', payload: 'PS4'})
            })

            it('returns a dispatch mapping for list remove', () => {
                const stateProps = ['consoleList']
                const {getDispatchToProps} = dictator(stateProps)
                const mapDispatchToProps = getDispatchToProps(dispatch)

                mapDispatchToProps.consoleListRemove('XBOX')
                expect(dispatch).toHaveBeenCalledWith({type: 'consoleListRemove', payload: 'XBOX'})
            })
        })
    })
})
