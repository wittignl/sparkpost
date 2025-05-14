import type { SparkPost } from '@/client';
import type { RequestCb } from '@/types';

import { cloneDeep } from 'es-toolkit/compat';
import type { CreateTemplate, UpdateTemplate } from "sparkpost";

const api = 'templates';

export class Templates {

    private client: SparkPost;

    constructor(client: SparkPost) {

        this.client = client;
    }

    /**
     * List an overview of all templates.
     *
     * @param {RequestCb} [callback]
     * @returns {Promise<any>}
     */
    list(callback?: RequestCb): Promise<any> {

        const options = {
            uri: api
        };

        return this.client.get(options, callback);
    }

    /**
     * Get details about a specified template by its id.
     *
     * @param {string} id
     * @param {Object} [options]
     * @param {RequestCb} [callback]
     * @returns {Promise<any>}
     */
    get(id: string, options?: any, callback?: RequestCb): Promise<any> {

        if (typeof options === 'function') {

            callback = options;
            options = {};
        }

        if (!id) {

            return this.client.reject(new Error('template id is required'), callback);
        }

        const reqOpts = {
            uri: `${api}/${id}`,
            qs: options || {}
        };

        return this.client.get(reqOpts, callback);
    }

    /**
     * Create a new template.
     *
     * @param {Object} template
     * @param {RequestCb} [callback]
     * @returns {Promise<any>}
     */
    create(template: CreateTemplate, callback?: RequestCb): Promise<any> {

        if (!template || typeof template !== 'object') {

            return this.client.reject(new Error('template object is required'), callback);
        }

        const reqOpts = {
            uri: api,
            json: template
        };

        return this.client.post(reqOpts, callback);
    }

    /**
     * Update an existing template.
     *
     * @param {String} id
     * @param {Object} template
     * @param {Object} [options]
     * @param {RequestCb} [callback]
     * @returns {Promise<any>}
     */
    update(id: string, template: UpdateTemplate, options?: any, callback?: RequestCb): Promise<any> {

        // Handle optional options argument
        if (typeof options === 'function') {

            callback = options;
            options = {};
        }

        if (!id) {

            return this.client.reject(new Error('template id is required'), callback);
        }

        if (!template || typeof template !== 'object') {

            return this.client.reject(new Error('template object is required'), callback);
        }

        const reqOpts = {
            uri: `${api}/${id}`,
            json: template,
            qs: options || {}
        };

        return this.client.put(reqOpts, callback);
    }

    /**
     * Delete an existing template.
     *
     * @param {String} id
     * @param {RequestCb} [callback]
     * @returns {Promise<any>}
     */
    delete(id: string, callback?: RequestCb): Promise<any> {

        if (!id || typeof id !== 'string') {

            return this.client.reject(new Error('template id is required'), callback);
        }

        const options = {
            uri: `${api}/${id}`
        };

        return this.client.delete(options, callback);
    }

    /**
     * Preview the most recent version of an existing template by id.
     *
     * @param {String} id
     * @param {Object} [options]
     * @param {RequestCb} [callback]
     * @returns {Promise<any>}
     */
    preview(id: string, options?: any, callback?: RequestCb): Promise<any> {

        // Handle optional options argument
        if (typeof options === 'function') {

            callback = options;
            options = {};
        }

        if (!id) {

            return this.client.reject(new Error('template id is required'), callback);
        }

        const reqOpts: any = {
            uri: `${api}/${id}/preview`,
            json: cloneDeep(options || {}),
            qs: {}
        };

        // Add draft to query params
        if (reqOpts.json.hasOwnProperty('draft')) {

            reqOpts.qs.draft = reqOpts.json.draft;
            delete reqOpts.json.draft;
        }

        return this.client.post(reqOpts, callback);
    }
}
