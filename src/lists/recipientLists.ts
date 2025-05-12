import type { SparkPost } from '@/client';
import type { RequestCb } from '@/types';

const api = 'recipient-lists';

export class RecipientLists {

    private client: SparkPost;

    constructor(client: SparkPost) {

        this.client = client;
    }

    /**
     * Get a list of all your recipient lists
     * https://developers.sparkpost.com/api/recipient-lists#recipient-lists-retrieve-get
     *
     * @param {RequestCb} [callback]
     * @return {Promise<any>}
     */
    list(callback?: RequestCb): Promise<any> {

        const reqOpts = {
            uri: api
        };
        return this.client.get(reqOpts, callback);
    }

    /**
     * Get a list of all your recipient lists
     * https://developers.sparkpost.com/api/recipient-lists#recipient-lists-list-get
     *
     * @param {string} id - Unique ID of the list to return
     * @param {Object} options - Hash of request options
     * @param {RequestCb} [callback]
     * @return {Promise<any>}
     */
    get(id: string, options?: any, callback?: RequestCb): Promise<any> {

        options = options || {};

        // Handle optional options argument
        if (typeof options === 'function') {

            callback = options;
            options = {};
        }

        if (!id) {

            return this.client.reject(new Error('id is required'), callback);
        }

        const reqOpts = {
            uri: `${api}/${id}`,
            qs: options
        };

        return this.client.get(reqOpts, callback);
    }

    /**
     * Create a new recipient list
     * https://developers.sparkpost.com/api/recipient-lists#recipient-lists-create-post
     *
     * @param  {Object} recipientList - recipient list object
     * @param  {Array} recipientList.recipients - Array of recipient objects
     * @param  {RequestCb} callback
     * @return {Promise<any>}
     */
    create(recipientList: any, callback?: RequestCb): Promise<any> {

        if (!recipientList || typeof recipientList !== 'object' || !recipientList.recipients) {

            return this.client.reject(new Error('recipient list is required'), callback);
        }

        const reqOpts = {
            uri: api,
            json: recipientList,
            qs: {
                num_rcpt_errors: recipientList.num_rcpt_errors
            }
        };

        return this.client.post(reqOpts, callback);
    }

    /**
     * Update an existing list
     * https://developers.sparkpost.com/api/recipient-lists#recipient-lists-update-put
     *
     * @param {string} id - Unique ID of the list to be updated
     * @param {Object} recipientList - recipient list object
     * @param  {Array} recipientList.recipients - Array of recipient objects
     * @param  {RequestCb} callback
     * @return {Promise<any>}
     */
    update(id: string, recipientList: any, callback?: RequestCb): Promise<any> {

        if (!id) {

            return this.client.reject(new Error('recipient list id is required'), callback);
        }

        if (!recipientList || typeof recipientList === 'function') {

            return this.client.reject(new Error('recipient list is required'), callback);
        }

        const reqOpts = {
            uri: `${api}/${id}`,
            json: recipientList,
            qs: {
                num_rcpt_errors: recipientList.num_rcpt_errors
            }
        };

        return this.client.put(reqOpts, callback);
    }

    /**
     * Delete an existing recipient list
     * https://developers.sparkpost.com/api/recipient-lists#recipient-lists-delete-delete
     *
     * @param {string} id - ID of the list to be updated
     * @param  {RequestCb} callback
     * @return {Promise<any>}
     */
    delete(id: string, callback?: RequestCb): Promise<any> {

        if (!id || typeof id !== 'string') {

            return this.client.reject(new Error('id is required'), callback);
        }

        const reqOpts = {
            uri: `${api}/${id}`
        };

        return this.client.delete(reqOpts, callback);
    }
}
