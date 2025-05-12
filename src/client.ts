import type { SparkPostError } from '@/types';

import { resolve as urlResolve } from 'node:url';

import { isObject, isPlainObject, merge } from 'es-toolkit/compat';
import { request } from 'undici';

import { InboundDomains, SendingDomains } from '@/domains';
import { withCallback } from '@/utils';

import { Events, MessageEvents } from './events';
import { RecipientLists, SuppressionList } from './lists';
import { Subaccounts } from './subaccounts';
import { Templates } from './templates';
import { Transmissions } from './transmissions';
import { RelayWebhooks, Webhooks } from './webhooks';

declare const VERSION: string;

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

const createSparkPostError = (res: any, body: any): SparkPostError => {

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
    inboundDomains: any;
    messageEvents: any;
    events: any;
    recipientLists: any;
    relayWebhooks: any;
    sendingDomains: any;
    subaccounts: any;
    suppressionList: any;
    templates: any;
    transmissions: any;
    webhooks: any;

    constructor(apiKey: string | SparkPostOptions, options?: SparkPostOptions) {

        options = handleOptions(apiKey, options);

        this.apiKey = options.key || process.env.SPARKPOST_API_KEY || '';

        if (typeof this.apiKey === 'undefined') {

            throw new Error('Client requires an API Key.');
        }

        // adding version to object
        this.version = VERSION;

        // setting up default headers
        this.defaultHeaders = merge(
            {
                'User-Agent': createVersionStr(VERSION, options),
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
            new Promise((resolve, reject) => {

                request(options)
                    .then(({ statusCode, headers, body }): void => {

                        const invalidCodeRegex = /(5|4)[0-9]{2}/;
                        let response: any;

                        if (invalidCodeRegex.test(statusCode.toString())) {

                            const err = createSparkPostError(
                                { statusCode, statusMessage: headers['status-message'] },
                                body
                            );
                            reject(err);
                        }
                        else {

                            response = body;
                            if (options.debug) {

                                response.debug = { statusCode, headers };
                            }
                            resolve(response);
                        }
                    })
                    .catch((err): void => {

                        reject(err);
                    });
            }),
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
