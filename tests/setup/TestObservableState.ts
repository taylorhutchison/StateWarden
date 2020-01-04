import { ITestState } from "./ITestState";
import { StateWarden } from '../../src/StateWarden';

export class TestObservableState extends StateWarden<ITestState> {
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