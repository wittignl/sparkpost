import type { SparkPost } from '@/client';
import type { RequestCb } from '@/types';

const api = 'message-events';

export class MessageEvents {

    private client: SparkPost;

    constructor(client: SparkPost) {

        this.client = client;
    }

    /**
     * Search for message events using given parameters
     *
     * @param {Object} parameters
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    search(parameters: Record<string, any>, callback?: RequestCb): Promise<any> {

        const options = {
            uri: api,
            qs: {} as Record<string, string>
        };

        Object.keys(parameters).forEach((paramname) => {

            if (Array.isArray(parameters[paramname])) {

                options.qs[paramname] = parameters[paramname].join(',');
            }
            else {

                options.qs[paramname] = parameters[paramname];
            }
        });

        return this.client.get(options, callback);
    }
}
