/**
 * withCallback handles an optional nodeback
 * and returns the promise object
 *
 * @param promise {Promise<any>}
 * @param cb {Function | undefined}
 * @return Promise<any>
 *
 * @example
 * function eitherOr(options: any, callback?: Function): Promise<any> {
 *   return withCallback(promiseThingy(options), callback);
 * }
 */

export function withCallback(promise: Promise<any>, cb?: Function): Promise<any> {

    const noop = () => {};

    if (typeof cb !== 'function') {

        cb = noop;
    }

    promise
        .then(
            (result: any): void => {

                cb!(null, result);
            }
        )
        .catch(
            (err: any): void => {

                cb!(err);
            }
        );

    return promise;
}
