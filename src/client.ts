import type { SparkPostError } from '@/types';

import { resolve as urlResolve } from 'node:url';

import axios, { type AxiosResponse } from 'axios';
import { version as packageVersion } from '../package.json';
import { isObject, isPlainObject, merge } from 'es-toolkit/compat';

import { InboundDomains, SendingDomains } from '@/domains';
import { withCallback } from '@/utils';

import { Events, MessageEvents } from './events';
import { RecipientLists, SuppressionList } from './lists';
import { Subaccounts } from './subaccounts';
import { Templates } from './templates';
import { Transmissions } from './transmissions';
import { RelayWebhooks, Webhooks } from './webhooks';

export interface SparkPostOptions {

    key?: string;
    origin?: string;
    endpoint?: string;
    apiVersion?: string;
    debug?: boolean;
    headers?: Record<string, string>;
    stackIdentity?: string;
}

export const defaultSparkPostOptions: Required<Pick<SparkPostOptions, 'origin' | 'apiVersion' | 'debug'>> = {
    origin: 'https://api.sparkpost.com:443',
    apiVersion: 'v1',
    debug: false
};

const resolveUri = (origin: string, uri: string): string => {

    if (!/^http/.test(uri)) {

        uri = urlResolve(origin, uri);
    }
    return uri;
};

const handleOptions = (apiKey: string | SparkPostOptions, options?: SparkPostOptions): SparkPostOptions => {

    if (isObject(apiKey)) {

        options = apiKey;
        options.key = process.env.SPARKPOST_API_KEY;
    }
    else {

        options = options || {};
        options.key = apiKey;
    }

    options.origin = options.origin || options.endpoint || defaultSparkPostOptions.origin;

    return options;
};

const getSparkPostStatusMessage = (response: AxiosResponse): string => {

    const headers = response.headers;
    const fromHeader =
        typeof (headers as { get?: (key: string) => string | undefined }).get === 'function'
            ? (headers as { get: (key: string) => string | undefined }).get('status-message')
            : (headers as Record<string, string | undefined>)['status-message']
              ?? (headers as Record<string, string | undefined>)['status-message'.toLowerCase()];

    return fromHeader || response.statusText || String(response.status);
};

const createSparkPostError = (res: { statusCode: number; statusMessage: string }, body: any): SparkPostError => {

    const err: SparkPostError = new Error(res.statusMessage);
    body = body || {};
    err.name = 'SparkPostError';
    err.errors = body.errors;
    err.statusCode = res.statusCode;

    return err;
};

const createVersionStr = (version: string, options: SparkPostOptions): string => {

    let versionStr = `node-sparkpost/${version} node.js/${process.version}`;
    if (options.stackIdentity) {

        versionStr += `${options.stackIdentity} ${versionStr}`;
    }
    return versionStr;
};

export class SparkPost {

    apiKey: string;
    version: string;
    defaultHeaders: Record<string, string>;
    origin: string;
    apiVersion: string;
    debug: boolean;
    inboundDomains: InboundDomains;
    messageEvents: MessageEvents;
    events: Events;
    recipientLists: RecipientLists;
    relayWebhooks: RelayWebhooks;
    sendingDomains: SendingDomains;
    subaccounts: Subaccounts;
    suppressionList: SuppressionList;
    templates: Templates;
    transmissions: Transmissions;
    webhooks: Webhooks;

    constructor(apiKey: string | SparkPostOptions, options?: SparkPostOptions) {

        options = handleOptions(apiKey, options);

        this.apiKey = options.key || process.env.SPARKPOST_API_KEY || '';

        if (typeof this.apiKey === 'undefined') {

            throw new Error('Client requires an API Key.');
        }

        // adding version to object
        this.version = packageVersion;

        // setting up default headers
        this.defaultHeaders = merge(
            {
                'User-Agent': createVersionStr(packageVersion, options),
                'Content-Type': 'application/json'
            },
            options.headers
        );

        // Optional client config
        this.origin = options.origin || '';
        this.apiVersion = options.apiVersion || defaultSparkPostOptions.apiVersion;
        this.debug = (typeof options.debug === 'boolean') ? options.debug : defaultSparkPostOptions.debug;

        this.inboundDomains = new InboundDomains(this);
        this.messageEvents = new MessageEvents(this);
        this.events = new Events(this);
        this.recipientLists = new RecipientLists(this);
        this.relayWebhooks = new RelayWebhooks(this);
        this.sendingDomains = new SendingDomains(this);
        this.subaccounts = new Subaccounts(this);
        this.suppressionList = new SuppressionList(this);
        this.templates = new Templates(this);
        this.transmissions = new Transmissions(this);
        this.webhooks = new Webhooks(this);
    }

    request(options: any, callback?: Function): Promise<any> {

        const baseUrl = `${this.origin}/api/${this.apiVersion}/`;

        // we need options
        if (!isPlainObject(options)) {

            throw new TypeError('options argument is required');
        }

        // if we don't have a fully qualified URL let's make one
        options.uri = resolveUri(baseUrl, options.uri);

        // merge headers
        options.headers = merge({}, this.defaultHeaders, options.headers);

        // add Authorization with API Key
        options.headers.Authorization = this.apiKey;

        // set Strict SSL (Always true)
        options.strictSSL = true;

        // default to accepting gzipped responses
        if (typeof options.gzip === 'undefined') {

            options.gzip = true;
        }

        // set debug
        options.debug = (typeof options.debug === 'boolean') ? options.debug : this.debug;

        return withCallback(
            (async (): Promise<any> => {

                const method = String(options.method || 'GET').toUpperCase();
                const rawJson = options.json;
                const sendJsonBody =
                    rawJson !== undefined &&
                    rawJson !== true &&
                    method !== 'GET' &&
                    method !== 'HEAD' &&
                    method !== 'DELETE';

                const axiosResponse: AxiosResponse = await axios.request({
                    url: options.uri,
                    method,
                    headers: options.headers,
                    params: options.qs,
                    data: sendJsonBody ? rawJson : undefined,
                    validateStatus: (): boolean => true,
                    decompress: options.gzip !== false
                });

                const statusCode = axiosResponse.status;
                const invalidCodeRegex = /(5|4)[0-9]{2}/;

                if (invalidCodeRegex.test(String(statusCode))) {

                    const err = createSparkPostError(
                        { statusCode, statusMessage: getSparkPostStatusMessage(axiosResponse) },
                        axiosResponse.data
                    );
                    throw err;
                }

                const response: any = axiosResponse.data;
                if (options.debug) {

                    const dbg = { statusCode, headers: axiosResponse.headers };

                    if (typeof response === 'object' && response !== null) {

                        response.debug = dbg;
                    }
                }
                return response;
            })(),
            callback
        );
    }

    get(options: any, callback?: Function): Promise<any> {

        options.method = 'GET';
        options.json = true;

        return this.request(options, callback);
    }

    post(options: any, callback?: Function): Promise<any> {

        options.method = 'POST';

        return this.request(options, callback);
    }

    put(options: any, callback?: Function): Promise<any> {

        options.method = 'PUT';

        return this.request(options, callback);
    }

    delete(options: any, callback?: Function): Promise<any> {

        options.method = 'DELETE';

        return this.request(options, callback);
    }

    reject(error: Error, callback?: Function): Promise<any> {

        return withCallback(Promise.reject(error), callback);
    }
}
