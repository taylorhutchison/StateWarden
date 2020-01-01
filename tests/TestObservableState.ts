import { ITestState } from "./ITestState";
import { ObservableState } from '../src/ObservableState';

export class TestObservableState extends ObservableState<ITestState> {
    constructor(initialState: ITestState) {
        super(initialState);
    }

    throwError() {
        this.update(state => { throw new Error(); });
    }
}