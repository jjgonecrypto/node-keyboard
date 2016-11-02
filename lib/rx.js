'use strict'

const Writable = require('stream').Writable

const Rx = require('rxjs/Rx')

module.exports = () => {
    let _subscriptions = []

    const subscribe = Rx.Observable.prototype.subscribe
    Rx.Observable.prototype.subscribe = function(...args) {
        let subscriber
        subscriber = subscribe.apply(this, args)
        _subscriptions.push(subscriber)
        return subscriber
    }

    Rx.cleanup = () => {
        _subscriptions.forEach(s => s.unsubscribe())
        _subscriptions = []
    }

    // polyfill fromStream for rxjs 5 and node streams 3. Appropriated from:
    // https://github.com/Reactive-Extensions/rx-node/blob/master/index.js#L58
    Rx.Observable.stream = stream => {

        return Rx.Observable.create(observer => {

            const errorHandler = err => {
                observer.error(err)
            }

            const endHandler = () => {
                observer.complete()
            }

            const writable = new Writable({
                objectMode: true,
                write(chunk, enc, callback) {
                    observer.next(chunk)
                    callback(null, chunk)
                }
            })
            stream.addListener('error', errorHandler)
            stream.addListener('end', endHandler)

            stream.pipe(writable)

            return () => {
                stream.unpipe(writable)
                stream.removeListener('error', errorHandler)
                stream.removeListener('end', endHandler)
            }

        })
    }

    return Rx
}
