import type { SparkPost } from '@/client';
import type { RequestCb } from '@/types';

const api = 'suppression-list';

export class SuppressionList {

    private client: SparkPost;

    constructor(client: SparkPost) {

        this.client = client;
    }

    /**
     * Lists all entries in your suppression list,
     * filtered by an optional set of parameters
     *
     * @param {Object} [parameters] - Hash of parameters to filter results
     * @param {RequestCb} [callback]
     * @return {Promise<any>}
     */
    list(parameters?: Record<string, any>, callback?: RequestCb): Promise<any> {

        const options = {
            uri: api,
            qs: parameters
        };
        return this.client.get(options, callback);
    }

    /**
     * Gets a single entry by email address ID
     *
     * @param {String} email
     * @param {RequestCb} [callback]
     * @return {Promise<any>}
     */
    get(email: string, callback?: RequestCb): Promise<any> {

        if (!email || typeof email === 'function') {

            return this.client.reject(new Error('email is required'), callback);
        }

        const options = {
            uri: `${api}/${email}`
        };
        return this.client.get(options, callback);
    }

    /**
     * Updates existing entries, or creates entries
     * if they don't exist for that email address ID
     *
     * @param {Array|Object} listEntries - List of suppression entry objects to upsert
     * @param {RequestCb} [callback]
     * @return {Promise<any>}
     */
    upsert(listEntries: Array<any> | Record<string, any>, callback?: RequestCb): Promise<any> {

        if (!listEntries || typeof listEntries === 'function') {

            return this.client.reject(new Error('list entries is required'), callback);
        }

        if (!Array.isArray(listEntries)) {

            listEntries = [listEntries];
        }

        const options = {
            uri: api,
            json: { recipients: listEntries }
        };

        return this.client.put(options, callback);
    }

    /**
     * Deletes a single entry, by email address ID
     *
     * @param {String} email
     * @param {RequestCb} [callback]
     * @return {Promise<any>}
     */
    delete(email: string, callback?: RequestCb): Promise<any> {

        if (!email || typeof email === 'function') {

            return this.client.reject(new Error('email is required'), callback);
        }

        const options = {
            uri: `${api}/${email}`
        };
        return this.client.delete(options, callback);
    }
}
