import { ITestState } from './setup/ITestState';
import { TestObservableState } from './setup/TestObservableState';
import { initialState1 as initialState } from './setup/InitialState';
import { History } from '../src/StateWarden';

describe('Observable State History', () => {


    let observableState: TestObservableState;
    let testState: ITestState | null;

    beforeEach(() => {
        testState = null;
        observableState = new TestObservableState(initialState);
    })

    describe('History class', () => {

        it('should enqueue items to capacity then drop the oldest items', () => {
            const history = new History<{num: number}>(10, {num: 0});
            for (let i = 0; i <= 10; i++) {
                history.enqueue({num: i});
            }
            console.log(history._queue);
            expect(history.oldest.num).toBe(1);
            expect(history.newest.num).toBe(10);
        });
        
    });

    it('should set the state to the previous state after an undo', () => {

        const subscriber = observableState.subscribe((state) => {
            testState = state;
        });

        expect(testState!.name).toBe(initialState.name);

        observableState.update((state) => {
            return {
                ...state,
                name: 'New Name'
            }
        });

        expect(testState!.name).toBe('New Name');

        observableState.undo();

        expect(testState!.name).toBe(initialState.name);

    });

    it('should not go beyond the oldest state in the history queue', () => {

        const subscriber = observableState.subscribe((state) => {
            testState = state;
        });

        observableState.undo();
        observableState.undo();

        expect(testState!.name).toBe(initialState.name);

    });
});