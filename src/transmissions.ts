import type { CreateTransmission } from "sparkpost";
import type { SparkPost } from './client';

import { formatPayload } from './utils';
import type { RequestCb } from "./types";

const api = 'transmissions';

export class Transmissions {

    private client: SparkPost;

    constructor(client: SparkPost) {

        this.client = client;
    }

    /**
     * List an overview of all transmissions in the account
     *
     * @param {Object} options
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    list(options?: any, callback?: RequestCb): Promise<any> {

        // Handle optional options argument
        if (typeof options === 'function') {

            callback = options;
            options = {};
        }

        const reqOpts = {
            uri: api,
            qs: options
        };

        return this.client.get(reqOpts, callback);
    }

    /**
     * Retrieve the details about a transmission by its id
     *
     * @param {String} id
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    get(id: string, callback?: RequestCb): Promise<any> {

        if (typeof id !== 'string') {

            return this.client.reject(new Error('id is required'), callback);
        }

        const options = {
            uri: `${api}/${id}`
        };

        return this.client.get(options, callback);
    }

    /**
     * Sends a message by creating a new transmission
     *
     * @param {Object} transmission
     * @param {Object} options
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    send(transmission: CreateTransmission, options?: any, callback?: RequestCb): Promise<any> {

        // Handle optional options argument
        if (typeof options === 'function') {

            callback = options;
            options = {};
        }

        if (!transmission || typeof transmission !== 'object') {

            return this.client.reject(new Error('transmission object is required'), callback);
        }

        transmission = formatPayload(transmission);

        const reqOpts = {
            uri: api,
            json: transmission,
            qs: options
        };

        return this.client.post(reqOpts, callback);
    }
}
