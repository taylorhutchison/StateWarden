import { ITestState } from './ITestState';
import { TestObservableState } from './TestObservableState';
import { initialState1 as initialState } from './InitialState';
import { take, skip } from 'rxjs/operators';

describe('Subscribing to the observable State', () => {


    let observableState: TestObservableState;
    let testState: ITestState;

    beforeEach(() => {
        observableState = new TestObservableState(initialState);
    });


    it('should have the ability to unsubscribe to the observable state', () => {
        
        const subscriber = observableState.subscribe((state) => {
            testState = state;
        });

        expect(subscriber.unsubscribe).toBeTruthy();
    });

    describe("subscribing with an error callback", () => {

        it('should', () => {
            let errorSet = false;

            observableState.pipe(skip(1), take(1)).subscribe((state) => {
                testState = state;
            }, (err) => { errorSet = true; });

            observableState.throwError();
    
            expect(errorSet).toBeTrue();
        });
    });
});