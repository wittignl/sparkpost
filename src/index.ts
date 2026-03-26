export * from './domains';
export * from './events';
export * from './lists';
export * from './utils';
export * from './webhooks';

export * from './client';
export * from './subaccounts';
export * from './templates';
export * from './transmissions';

export type {
    Address,
    CreateSendingDomain,
    CreateSubaccount,
    CreateSupressionListEntry,
    CreateTemplate,
    CreateTransmission,
    Recipient,
    UpdateRelayWebhook,
    UpdateTemplate,
    UpdateWebhook,
} from 'sparkpost';
