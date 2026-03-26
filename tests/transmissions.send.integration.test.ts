import { expect, test } from 'vitest';

import { SparkPost } from '../src/client';

const apiKey = process.env.SPARKPOST_API_KEY;
const to = process.env.TEST_TO_EMAIL;

test.skipIf(!apiKey || !to)('sends a sandbox transmission via SparkPost API', async () => {

    const client = new SparkPost(apiKey as string);
    const { results } = await client.transmissions.send({
        options: { sandbox: true },
        content: {
            from: process.env.TEST_FROM ?? 'sandbox@sparkpostbox.com',
            subject: process.env.TEST_SUBJECT ?? '@wittignl/sparkpost integration test',
            html: '<p>SparkPost Axios client integration test.</p>'
        },
        recipients: [{ address: to as string }]
    });

    expect(results).toEqual(
        expect.objectContaining({
            total_accepted_recipients: expect.any(Number),
            total_rejected_recipients: expect.any(Number),
            id: expect.any(String)
        })
    );
    expect(results.id.length).toBeGreaterThan(0);
});
