import { ObservableState } from '../src/ObservableState';

describe('Deriving a class from Observable State', () => {

    interface ITestState {
        name: string;
    }

    const initialState: ITestState = {
        name: 'Test State'
    }
    
    class TestObservableState extends ObservableState<ITestState> {
        constructor() {
            super(initialState);
        }
    }

    let observableState: TestObservableState;
    let testState: ITestState;

    beforeEach(() => {
        observableState = new TestObservableState();
    })


    it('should have the initial state set as the current state', () => {
        
        const subscriber = observableState.subscribe((state) => {
            testState = state;
        });

        expect(testState.name).toBe(initialState.name);
    });
});