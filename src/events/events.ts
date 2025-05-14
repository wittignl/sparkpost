import type { SparkPost } from '@/client';
import type { RequestCb } from '@/types';

const api = 'events';

export class Events {

    private client: SparkPost;

    constructor(client: SparkPost) {

        this.client = client;
    }

    /**
     * Search for events using given parameters
     *
     * @param {Object} parameters
     * @param {RequestCb} [callback]
     * @returns {Promise}
     */
    searchMessage(parameters: Record<string, any>, callback?: RequestCb): Promise<any> {

        const options = {
            uri: `${api}/message`,
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
