import { Subject, Observable, Subscriber, Subscription } from 'rxjs';

export abstract class ObservableState<T> extends Observable<T> {

    private _value!: Readonly<T>;
    private _subscriber!: Subscriber<T>;
    private _subscription: Subscription;
    private _history: History<T>;

    constructor(initialState: T) {
        const obs = (subscriber: Subscriber<T>): void => {
            this._subscriber = subscriber;
        }
        super(obs);
        this._subscription = this.subscribe();
        ObservableState.deepFreeze(initialState);
        this._history = new History<T>(10, initialState);
        this._value = initialState;
    }

    subscribe(): Subscription;
    subscribe(next?: (value: T) => void): Subscription
    subscribe(next?: (value: T) => void, error?: (error: any) => void): Subscription
    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Subscription {
        const subscription = super.subscribe(next, error, complete);
        if (next && typeof next === 'function') {
            next(this._value);
        }
        return subscription;
    }

    select(selector: (m: Readonly<T>) => any) {
        const subject = new Subject();
        let currentValue = selector(this._value);
        this.subscribe((next) => {
            const newValue = selector(next);
            if (newValue !== currentValue) {
                currentValue = newValue;
                subject.next(newValue);
            }
        });
        return subject;
    }

    protected update(func: (current: Readonly<T>) => T) {
        try {
            const nextState = func(this._value);
            ObservableState.deepFreeze(nextState);
            this._value = nextState;
            this._history.enqueue(this._value);
            this._subscriber.next(this._value);
        } catch (err) {
            this._subscriber.error(err);
        }
    }

    protected undo(): void {
        const previousState = this._history.previous();
        if(this._value != previousState) {
            this._subscriber.next(previousState);
        }
    }

    protected static deepFreeze(obj: any) {
        Object.freeze(obj);
        Object.getOwnPropertyNames(obj).forEach((prop) => {
            if (obj[prop] && ['object', 'function'].indexOf(typeof obj[prop]) !== -1) {
                this.deepFreeze(obj[prop]);
            }
        });
        return obj;
    }


}

const defaultCapacity: number = 10;
export class History<T> {
    public _queue: T[];
    private _capacity: number;
    private _currentIndex: number;

    constructor(capacity: number, initialState: T) {
        this._queue = [initialState];
        this._currentIndex = 0;
        this._capacity = capacity > 0 ? capacity : defaultCapacity;
    }

    get oldest(): T {
        return this._queue[0];
    }

    get newest(): T {
        return this._queue[this._queue.length - 1];
    }

    get current(): T {
        return this._queue[this._currentIndex];
    }

    get count(): number {
        return this._queue.length;
    }

    previous(): T {
        if(this._currentIndex > 0) {
            this._currentIndex = this._currentIndex - 1;
        }
        return this.current;
    }

    enqueue(item: T) {
        if (this._queue.length >= this._capacity) {
            this.dequeue();
        }
        this._currentIndex = this._queue.push(item) - 1;
    }

    dequeue() {
        this._queue.shift();
    }

}