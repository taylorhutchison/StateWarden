import { ObservableState } from '../src/ObservableState';

describe('Subscribing to the observable State', () => {

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


    it('should have the ability to unsubscribe to the observable state', () => {
        
        const subscriber = observableState.subscribe((state) => {
            testState = state;
        });

        expect(subscriber.unsubscribe).toBeTruthy();
    });
});