import type {
    CreateTransmission,
    Transmission,
    TransmissionSummary,
} from 'sparkpost';

import type { SparkPost } from './client';
import { formatPayload } from './utils';
import type { RequestCb } from './types';

const api = 'transmissions';

export type TransmissionListOptions = {
    campaign_id?: string;
    template_id?: string;
};

export type TransmissionSendQueryOptions = {
    num_rcpt_errors?: number;
};

/** Inner payload for a successful `transmissions.send` (inside `results`). */
export type TransmissionSendResults = {
    total_rejected_recipients: number;
    total_accepted_recipients: number;
    id: string;
};

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
    list(callback: RequestCb): Promise<{ results: TransmissionSummary[] }>;
    list(
        options: TransmissionListOptions,
        callback: RequestCb
    ): Promise<{ results: TransmissionSummary[] }>;
    list(options?: TransmissionListOptions): Promise<{ results: TransmissionSummary[] }>;
    list(
        options?: TransmissionListOptions | RequestCb,
        callback?: RequestCb
    ): Promise<{ results: TransmissionSummary[] }> {

        // Handle optional options argument
        if (typeof options === 'function') {

            callback = options;
            options = {};
        }

        const opts = options ?? {};
        const reqOpts = {
            uri: api,
            qs: opts
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
    get(id: string, callback?: RequestCb): Promise<{ results: Transmission }> {

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
    send(transmission: CreateTransmission, callback: RequestCb): Promise<{ results: TransmissionSendResults }>;
    send(
        transmission: CreateTransmission,
        options: TransmissionSendQueryOptions,
        callback: RequestCb
    ): Promise<{ results: TransmissionSendResults }>;
    send(
        transmission: CreateTransmission,
        options?: TransmissionSendQueryOptions
    ): Promise<{ results: TransmissionSendResults }>;
    send(
        transmission: CreateTransmission,
        options?: TransmissionSendQueryOptions | RequestCb,
        callback__?: RequestCb
    ): Promise<{ results: TransmissionSendResults }> {

        let callback = callback__;
        let query: TransmissionSendQueryOptions = {};

        // Handle optional options argument
        if (typeof options === 'function') {

            callback = options;
        }
        else if (options !== undefined) {

            query = options;
        }

        if (!transmission || typeof transmission !== 'object') {

            return this.client.reject(new Error('transmission object is required'), callback);
        }

        const payload = formatPayload(transmission);

        const reqOpts = {
            uri: api,
            json: payload,
            qs: query
        };

        return this.client.post(reqOpts, callback);
    }
}
