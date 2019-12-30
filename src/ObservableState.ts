import { BehaviorSubject, Subject, Subscription } from 'rxjs';

export abstract class ObservableState<T> {

    // tslint:disable-next-line
    private _state: BehaviorSubject<T>;

    constructor(initialState: T) {
        this.deepFreeze(initialState);
        this._state = new BehaviorSubject(initialState);
    }

    subscribe(observer: (next: Readonly<T>) => void): Subscription {
        return this._state.subscribe(observer);
    }

    select(selector: (m: Readonly<T>) => any ) {
        const subject = new Subject();
        let currentValue = selector(this._state.value);
        this._state.subscribe((next) => {
            const newValue = selector(next);
            if (newValue !== currentValue) {
                currentValue = newValue;
                subject.next(newValue);
            }
        });
        return subject;
    }

    protected update(func: (current: Readonly<T>) => T) {
        const nextState = func(this._state.value);
        this.deepFreeze(nextState);
        this._state.next(nextState);
    }

    protected deepFreeze(obj: any) {
        Object.freeze(obj);
        Object.getOwnPropertyNames(obj).forEach((prop) => {
          if (obj[prop] && ['object', 'function'].indexOf(typeof obj[prop]) !== -1) {
            this.deepFreeze(obj[prop]);
          }
        });
        return obj;
    }
}
