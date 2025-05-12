import type { SparkPost } from '@/client';
import type { RequestCb } from '@/types';

const api = 'sending-domains';

export class SendingDomains {

    private client: SparkPost;

    constructor(client: SparkPost) {

        this.client = client;
    }

    /**
     * Lists all sending domains
     *
     * @param {RequestCb} [callback]
     * @return {Promise<any>}
     */
    list(callback?: RequestCb): Promise<any> {

        const options = {
            uri: api
        };

        return this.client.get(options, callback);
    }

    /**
     * Get a single sending domain, by domain
     *
     * @param {string} domain - The domain name to get
     * @param {RequestCb} [callback]
     * @return {Promise<any>}
     */
    get(domain: string, callback?: RequestCb): Promise<any> {

        if (!domain || typeof domain === 'function') {

            return this.client.reject(new Error('domain is required'), callback);
        }

        const options = {
            uri: `${api}/${domain}`
        };

        return this.client.get(options, callback);
    }

    /**
     * Creates a new sending domain
     *
     * @param {Object} createOpts - attributes used to create the new domain
     * @param {RequestCb} [callback]
     * @return {Promise<any>}
     */
    create(createOpts: object, callback?: RequestCb): Promise<any> {

        if (!createOpts || typeof createOpts !== 'object') {

            return this.client.reject(new Error('create options are required'), callback);
        }

        const options = {
            uri: api,
            json: createOpts
        };

        return this.client.post(options, callback);
    }

    /**
     * Update an existing sending domain
     *
     * @param {string} domain - The domain to update
     * @param {Object} updateOpts - Hash of the sending domain attributes to update
     * @param {RequestCb} [callback]
     * @return {Promise<any>}
     */
    update(domain: string, updateOpts: object, callback?: RequestCb): Promise<any> {

        if (typeof domain !== 'string') {

            return this.client.reject(new Error('domain is required'), callback);
        }

        if (!updateOpts || typeof updateOpts !== 'object') {

            return this.client.reject(new Error('update options are required'), callback);
        }

        const options = {
            uri: `${api}/${domain}`,
            json: updateOpts
        };

        return this.client.put(options, callback);
    }

    /**
     * Delete an existing sending domain
     *
     * @param {string} domain - The domain to delete
     * @param {RequestCb} [callback]
     * @return {Promise<any>}
     */
    delete(domain: string, callback?: RequestCb): Promise<any> {

        if (typeof domain !== 'string') {

            return this.client.reject(new Error('domain is required'), callback);
        }

        const options = {
            uri: `${api}/${domain}`
        };

        return this.client.delete(options, callback);
    }

    /**
     * Verify an existing sending domain
     *
     * @param {string} domain - The domain to verify
     * @param {Object} options - Hash of options to include in verification request
     * @param {RequestCb} [callback]
     * @return {Promise<any>}
     */
    verify(domain: string, options: object, callback?: RequestCb): Promise<any> {

        if (typeof domain !== 'string') {

            return this.client.reject(new Error('domain is required'), callback);
        }

        if (!options || typeof options !== 'object') {

            return this.client.reject(new Error('verification options are required'), callback);
        }

        const reqOpts = {
            uri: `${api}/${domain}/verify`,
            json: options
        };

        return this.client.post(reqOpts, callback);
    }
}
