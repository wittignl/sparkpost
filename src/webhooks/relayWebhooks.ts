import type { RequestCb } from '@/types';

const api = 'relay-webhooks';

export class RelayWebhooks {

    private client: any;

    constructor(client: any) {

        this.client = client;
    }

    /**
     * List all relay webhooks
     *
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    list(callback?: RequestCb): Promise<any> {

        const reqOpts = {
            uri: api
        };
        return this.client.get(reqOpts, callback);
    }

    /**
     * Get details about a specified relay webhook by its id
     *
     * @param {string} id - the id of the relay webhook you want to look up
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    get(id: string, callback?: RequestCb): Promise<any> {

        if (!id || typeof id !== 'string') {

            return this.client.reject(new Error('id is required'), callback);
        }

        const options = {
            uri: `${api}/${id}`
        };

        return this.client.get(options, callback);
    }

    /**
     * Create a new relay webhook
     *
     * @param {Object} webhook - an object of [relay webhook attributes]{https://developers.sparkpost.com/api/relay-webhooks#header-relay-webhooks-object-properties}
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    create(webhook: object, callback?: RequestCb): Promise<any> {

        if (!webhook || typeof webhook !== 'object') {

            return this.client.reject(new Error('webhook object is required'), callback);
        }

        const reqOpts = {
            uri: api,
            json: webhook
        };

        return this.client.post(reqOpts, callback);
    }

    /**
     * Update an existing relay webhook
     *
     * @param {string} id - the id of the relay webhook you want to update
     * @param {Object} webhook - an object of [relay webhook attributes]{https://developers.sparkpost.com/api/relay-webhooks#header-relay-webhooks-object-properties}
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    update(id: string, webhook: object, callback?: RequestCb): Promise<any> {

        if (!id || typeof id !== 'string') {

            return this.client.reject(new Error('id is required'), callback);
        }

        if (!webhook || typeof webhook !== 'object') {

            return this.client.reject(new Error('webhook object is required'), callback);
        }

        const reqOpts = {
            uri: `${api}/${id}`,
            json: webhook
        };

        return this.client.put(reqOpts, callback);
    }

    /**
     * Delete an existing relay webhook
     *
     * @param {string} id - the id of the relay webhook you want to delete
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    delete(id: string, callback?: RequestCb): Promise<any> {

        if (!id || typeof id !== 'string') {

            return this.client.reject(new Error('id is required'), callback);
        }

        const options = {
            uri: `${api}/${id}`
        };

        return this.client.delete(options, callback);
    }
}
