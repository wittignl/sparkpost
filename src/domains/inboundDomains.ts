import type { SparkPost } from '@/client';
import type { RequestCb } from '@/types';

const api = 'inbound-domains';

export class InboundDomains {

    private client: SparkPost;

    constructor(client: SparkPost) {

        this.client = client;
    }

    /**
     * List an overview of all inbound domains in the account.
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
     * Get an inbound domain by its domain name
     *
     * @param {string} domain
     * @param {RequestCb} [callback]
     * @returns {Promise<any>}
     */
    get(domain: string, callback?: RequestCb): Promise<any> {

        if (!domain || typeof domain !== 'string') {

            return this.client.reject(new Error('domain is required'), callback);
        }

        const options = {
            uri: `${api}/${domain}`
        };
        return this.client.get(options, callback);
    }

    /**
     * Create a new inbound domain
     *
     * @param {Object} createOpts
     * @param {RequestCb} [callback]
     * @returns {Promise<any>}
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
     * Delete an existing inbound domain
     *
     * @param {string} domain
     * @param {RequestCb} [callback]
     * @returns {Promise<any>}
     */
    delete(domain: string, callback?: RequestCb): Promise<any> {

        if (!domain || typeof domain !== 'string') {

            return this.client.reject(new Error('domain is required'), callback);
        }

        const options = {
            uri: `${api}/${domain}`
        };
        return this.client.delete(options, callback);
    }
}
