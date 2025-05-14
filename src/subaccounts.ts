import type { SparkPost } from '@/client';
import type { RequestCb } from '@/types';
import type { CreateSubaccount } from "sparkpost";

const api = 'subaccounts';

export class Subaccounts {

    private client: SparkPost;

    constructor(client: SparkPost) {

        this.client = client;
    }

    /**
     * List a summary of all subaccounts
     *
     * @param {RequestCb} [callback]
     * @return {Promise}
     */
    list(callback?: RequestCb): Promise<any> {

        const options = {
            uri: api
        };
        return this.client.get(options, callback);
    }

    /**
     * Get details about a specified subaccount by its id
     *
     * @param {string} id - the id of the subaccount you want to look up
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
     * Create a new subaccount
     *
     * @param subaccount - an object of [subaccount attributes]{https://developers.sparkpost.com/api/subaccounts#header-request-body-attributes}
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    create(subaccount: CreateSubaccount, callback?: RequestCb): Promise<any> {

        if (!subaccount || typeof subaccount !== 'object') {

            return this.client.reject(new Error('subaccount object is required'), callback);
        }

        const reqOpts = {
            uri: api,
            json: subaccount
        };
        return this.client.post(reqOpts, callback);
    }

    /**
     * Update existing subaccount by id
     *
     * @param {string} id - the id of the subaccount you want to update
     * @param {Object} subaccount - an object of [subaccount attributes]{https://developers.sparkpost.com/api/subaccounts#header-request-body-attributes-1}
     * @param {RequestCb} callback
     * @returns {Promise}
     */
    update(id: string, subaccount: object, callback?: RequestCb): Promise<any> {

        if (!id || typeof id !== 'string') {

            return this.client.reject(new Error('id is required'), callback);
        }

        if (!subaccount || typeof subaccount !== 'object') {

            return this.client.reject(new Error('subaccount object is required'), callback);
        }

        const reqOpts = {
            uri: `${api}/${id}`,
            json: subaccount
        };

        return this.client.put(reqOpts, callback);
    }
}
