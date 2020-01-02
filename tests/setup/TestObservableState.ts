import { ITestState } from "./ITestState";
import { ObservableState } from '../../src/ObservableState';

export class TestObservableState extends ObservableState<ITestState> {
    constructor(initialState: ITestState) {
        super(initialState);
    }

    update(func: (current: Readonly<ITestState>) => ITestState): void {
        super.update(func);
    }

    undo() {
        super.undo();
    }
    
    throwError() {
        this.update(state => { throw new Error(); });
    }
}