/**
 * Send a single sandbox transmission. Requires:
 *   SPARKPOST_API_KEY
 *   TEST_TO_EMAIL
 * Optional: TEST_FROM (default sandbox@sparkpostbox.com), TEST_SUBJECT
 *
 * Run: pnpm send-test
 */

import { SparkPost } from '../src/client.ts';

const apiKey = process.env.SPARKPOST_API_KEY;
const to = process.env.TEST_TO_EMAIL;

if (!apiKey) {

    console.error('Missing SPARKPOST_API_KEY');
    process.exit(1);
}

if (!to) {

    console.error('Missing TEST_TO_EMAIL');
    process.exit(1);
}

const client = new SparkPost(apiKey, {
    origin: 'https://api.eu.sparkpost.com'
});

client.transmissions
    .send({
        options: { sandbox: true },
        content: {
            from: process.env.TEST_FROM ?? 'noreply@beheer.avecodebondt.nl',
            subject: process.env.TEST_SUBJECT ?? '@wittignl/sparkpost send-test',
        },
        recipients: [{ address: to }]
    })
    .then((body) => {

        console.log(body);

        console.log('Transmission accepted:', body.results ?? body);
    })
    .catch((err: Error & { errors?: unknown; statusCode?: number }) => {

        console.error('Send failed:', err.message, err.statusCode ?? '', err.errors ?? '');
        process.exit(1);
    });
