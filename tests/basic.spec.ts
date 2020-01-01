import { ITestState } from './ITestState';
import { TestObservableState } from './TestObservableState';
import { initialState1 as initialState } from './InitialState';

describe('Deriving a class from Observable State', () => {


    let observableState: TestObservableState;
    let testState: ITestState;

    beforeEach(() => {
        observableState = new TestObservableState(initialState);
    })


    it('should have the initial state set as the current state', () => {
        
        const subscriber = observableState.subscribe((state) => {
            testState = state;
        });

        expect(testState.name).toBe(initialState.name);
    });
});