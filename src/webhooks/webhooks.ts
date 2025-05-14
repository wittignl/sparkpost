import type { SparkPost } from '@/client';
import type { RequestCb } from '@/types';
import type { UpdateWebhook } from "sparkpost";

const api = 'webhooks';

export class Webhooks {

    private client: SparkPost;

    constructor(client: SparkPost) {

        this.client = client;
    }

    /**
     * Lists all webhooks
     *
     * @param {Object} [options] - Hash of options
     * @param {string} [options.timezone] - The timezone to use for the last_successful and last_failure properties.
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    list(options?: { timezone?: string; } | RequestCb, callback?: RequestCb): Promise<any> {

        const reqOpts: { uri: string; qs: { timezone?: string; }; } = {
            uri: api,
            qs: {}
        };

        if (!options || typeof options === 'function') {

            callback = options as RequestCb;
            options = {};
        }

        if ((options as { timezone?: string; }).timezone) {

            reqOpts.qs.timezone = (options as { timezone: string; }).timezone;
        }

        return this.client.get(reqOpts, callback);
    }

    /**
     * Get a single webhook by ID
     *
     * @param {string} id - The ID of the webhook to get
     * @param {Object} [options] - Hash of options
     * @param {string} [options.timezone] - The timezone to use for the last_successful and last_failure properties.
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    get(id: string, options?: { timezone?: string; } | RequestCb, callback?: RequestCb): Promise<any> {

        if (!options || typeof options === 'function') {

            callback = options as RequestCb;
            options = {};
        }

        if (typeof id !== 'string') {

            return this.client.reject(new Error('id is required'), callback);
        }

        const reqOpts: { uri: string; qs: { timezone?: string; }; } = {
            uri: `${api}/${id}`,
            qs: {}
        };

        if ((options as { timezone?: string; }).timezone) {

            reqOpts.qs.timezone = (options as { timezone: string; }).timezone;
        }

        return this.client.get(reqOpts, callback);
    }

    /**
     * Creates a new webhook
     *
     * @param {Object} webhook - attributes used to create the new webhook
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    create(webhook: any, callback?: RequestCb): Promise<any> {

        if (!webhook || typeof webhook === 'function') {

            return this.client.reject(new Error('webhook object is required'), callback);
        }

        const options = {
            uri: api,
            json: webhook
        };

        return this.client.post(options, callback);
    }

    /**
     * Update an existing webhook
     *
     * @param {string} id - The ID of the webhook to update
     * @param {Object} webhook - Hash of the webhook attributes to update
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    update(id: string, webhook: UpdateWebhook, callback?: RequestCb): Promise<any> {

        if (!id) {

            return this.client.reject(new Error('id is required'), callback);
        }

        if (!webhook || typeof webhook === 'function') {

            return this.client.reject(new Error('webhook object is required'), callback);
        }

        const options = {
            uri: `${api}/${id}`,
            json: webhook
        };

        delete options.json.id;

        return this.client.put(options, callback);
    }

    /**
     * Delete an existing webhook
     *
     * @param {string} id - The ID of the webhook to delete
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    delete(id: string, callback?: RequestCb): Promise<any> {

        if (!id || typeof id === 'function') {

            return this.client.reject(new Error('id is required'), callback);
        }

        const options = {
            uri: `${api}/${id}`
        };

        return this.client.delete(options, callback);
    }

    /**
     * Sends an example message event batch from the Webhook API to the target URL.
     *
     * @param {string} id - The ID of the webhook to validate
     * @param {Object} options - Hash of options used to validate the webhook
     * @param {string} options.message - The message (payload) to send to the webhook consumer.
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    validate(id: string, options: { message: string; }, callback?: RequestCb): Promise<any> {

        if (typeof id !== 'string') {

            return this.client.reject(new Error('id is required'), callback);
        }

        if (!options || typeof options === 'function' || !options.message) {

            return this.client.reject(new Error('message is required'), callback);
        }

        const reqOpts = {
            uri: `${api}/${id}/validate`,
            json: {
                message: options.message
            }
        };

        return this.client.post(reqOpts, callback);
    }

    /**
     * Gets recent status information about a webhook.
     *
     * @param {string} id - The ID of the webhook to check
     * @param {Object} [options] - Hash of options
     * @param {string} [options.limit] - The maximum number of results to return.
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    getBatchStatus(id: string, options?: { limit?: string; } | RequestCb, callback?: RequestCb): Promise<any> {

        if (!options || typeof options === 'function') {

            callback = options as RequestCb;
            options = {};
        }

        if (typeof id !== 'string') {

            return this.client.reject(new Error('id is required'), callback);
        }

        const reqOpts: { uri: string; qs: { limit?: string; }; } = {
            uri: `${api}/${id}/batch-status`,
            qs: {}
        };

        if ((options as { limit?: string; }).limit) {

            reqOpts.qs.limit = (options as { limit: string; }).limit;
        }

        return this.client.get(reqOpts, callback);
    }

    /**
     * Lists descriptions of the events, event types, and event fields that could be included in a Webhooks post to your target URL.
     *
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    getDocumentation(callback?: RequestCb): Promise<any> {

        const reqOpts = {
            uri: `${api}/events/documentation`
        };
        return this.client.get(reqOpts, callback);
    }

    /**
     * Lists examples of the event data that will be posted to a webhook consumer.
     *
     * @param {Object} [options] - Hash of options
     * @param {string} [options.events] - A comma delimited list of events to get samples of.
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    getSamples(options?: { events?: string; } | RequestCb, callback?: RequestCb): Promise<any> {

        const reqOpts: { uri: string; qs: { events?: string; }; } = {
            uri: `${api}/events/samples`,
            qs: {}
        };

        if (!options || typeof options === 'function') {

            callback = options as RequestCb;
            options = {};
        }

        if ((options as { events?: string; }).events) {

            reqOpts.qs.events = (options as { events: string; }).events;
        }

        return this.client.get(reqOpts, callback);
    }
}
