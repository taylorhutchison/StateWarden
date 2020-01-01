import { Subject, Observable, Subscriber, Subscription } from 'rxjs';

export abstract class ObservableState<T> extends Observable<T> {

    private _value!: Readonly<T>;
    private _subscriber!: Subscriber<T>;
    private _subscription: Subscription;
    private _historyQueue: Queue<T>;

    constructor(initialState: T) {
        const obs = (subscriber: Subscriber<T>): void => {
            this._subscriber = subscriber;
        }
        super(obs);
        this._subscription = this.subscribe();
        this._historyQueue = new Queue<T>(10);
        ObservableState.deepFreeze(initialState);
        this._value = initialState;
    }

    subscribe(): Subscription;
    subscribe(next?: (value: T) => void): Subscription
    subscribe(next?: (value: T) => void, error?: (error: any) => void): Subscription
    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Subscription {
        const subscription = super.subscribe(next, error, complete);
        if(next && typeof next === 'function') {
            next(this._value);
        }
        return subscription;
    }

    select(selector: (m: Readonly<T>) => any ) {
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
            this._historyQueue.enqueue(nextState);
            this._subscriber.next(nextState);
        } catch(err) {
            this._subscriber.error(err);
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
class Queue<T> {
    private _queue: T[];
    private _capacity: number;
    constructor(capacity: number) {
        this._queue = [];
        this._capacity = capacity > 0 ? capacity : defaultCapacity;
    }
    enqueue(item: T) {
        if(this._queue.length >= this._capacity) {
            this._queue.shift();
        }
        this._queue.push(item);
    }
}