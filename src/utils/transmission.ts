import type { Address, CreateTransmission, Recipient } from "sparkpost";

import { cloneDeep, filter, has, isArray, isPlainObject, map, set } from 'es-toolkit/compat';

export function formatPayload(originalTransmission: CreateTransmission): CreateTransmission {

    const transmission = cloneDeep(originalTransmission);

    // don't format the payload if we are not given an array of recipients
    if (!isArray(transmission.recipients)) {

        return transmission;
    }

    // format all the original recipients to be in the object format
    transmission.recipients = map(transmission.recipients, (recipient: Recipient) => {

        recipient.address = addressToObject(recipient.address);
        return recipient;
    });

    // add the CC headers
    if (isArray(transmission.cc) && transmission.cc.length > 0) {

        set(transmission, 'content.headers.CC', generateCCHeader(transmission));
    }

    const headerTo = generateHeaderTo(transmission.recipients);

    transmission.recipients = addListToRecipients(transmission, 'cc', headerTo);
    transmission.recipients = addListToRecipients(transmission, 'bcc', headerTo);

    delete transmission.cc;
    delete transmission.bcc;

    return transmission;
}

export function addListToRecipients(transmission: CreateTransmission, listName: keyof CreateTransmission, headerTo: string): Recipient[] | { list_id: string } | undefined {

    if (transmission == null) {

        return [];
    }

    if (!isArray(transmission[listName])) {

        return transmission.recipients;
    }

    return transmission.recipients && Array.isArray(transmission.recipients)
        ? (transmission.recipients as Recipient[]).concat(
            map(transmission[listName] as Recipient[], (recipient: Recipient) => {
                const addressObj = addressToObject(recipient.address);
                if (addressObj) {
                    recipient.address = addressObj;
                    if (typeof recipient.address === 'object') {
                        recipient.address.header_to = headerTo;

                        // remove name from address - name is only put in the header for cc and not at all for bcc
                        if (has(recipient.address, 'name')) {
                            delete recipient.address.name;
                        }
                    }
                }
                return recipient;
            })
        )
        : undefined;
}

// TODO: Proper type
export function generateCCHeader(transmission: any): string {

    return map(transmission.cc, (ccRecipient: Recipient) => addressToString(ccRecipient.address)).join(', ');
}

export function generateHeaderTo(recipients: Recipient[]): string {

    // if a recipient has a header_to then it is cc'd or bcc'd and we don't want it in the header_to value
    const originalRecipients = filter(recipients, (recipient: Recipient) => !has(recipient.address, 'header_to'));

    return map(originalRecipients, (recipient: Recipient) => addressToString(recipient.address)).join(', ');
}

export function addressToString(address: Address | string | undefined): string | undefined {

    if (isPlainObject(address)) {

        if (has(address, 'name')) {

            return `"${address.name}" <${address.email}>`;
        }
        else {

            return address.email;
        }
    }

    return address;
}

export function addressToObject(address: Address): Address {

    let addressObject: Address | Partial<Address> = cloneDeep(address);

    if (typeof address === 'string') {

        addressObject = {};

        const matches = /"?(.[^"]*)?"?\s*<(.+)>/gi.exec(address);

        if (matches) {

            addressObject.name = matches[1];
            addressObject.email = matches[2];
        }
        else {

            addressObject.email = address;
        }
    }

    return addressObject as Address;
}
