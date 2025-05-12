import { cloneDeep, filter, has, isArray, isPlainObject, map, set } from 'es-toolkit/compat';

export function formatPayload(originalTransmission: any): any {

    const transmission = cloneDeep(originalTransmission);

    // don't format the payload if we are not given an array of recipients
    if (!isArray(transmission.recipients)) {

        return transmission;
    }

    // format all the original recipients to be in the object format
    transmission.recipients = map(transmission.recipients, (recipient: any) => {

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

export function addListToRecipients(transmission: any, listName: string, headerTo: string): any[] {

    if (!isArray(transmission[listName])) {

        return transmission.recipients;
    }

    return transmission.recipients.concat(map(transmission[listName], (recipient: any) => {

        recipient.address = addressToObject(recipient.address);
        recipient.address.header_to = headerTo;

        // remove name from address - name is only put in the header for cc and not at all for bcc
        if (has(recipient.address, 'name')) {

            delete recipient.address.name;
        }

        return recipient;
    }));
}

export function generateCCHeader(transmission: any): string {

    return map(transmission.cc, (ccRecipient: any) => addressToString(ccRecipient.address)).join(', ');
}

export function generateHeaderTo(recipients: any[]): string {

    // if a recipient has a header_to then it is cc'd or bcc'd and we don't want it in the header_to value
    const originalRecipients = filter(recipients, (recipient: any) => !has(recipient.address, 'header_to'));

    return map(originalRecipients, (recipient: any) => addressToString(recipient.address)).join(', ');
}

export function addressToString(address: any): string {

    if (isPlainObject(address)) {

        if (has(address, 'name')) {

            address = `"${address.name}" <${address.email}>`;
        }
        else {

            address = address.email;
        }
    }

    return address;
}

export function addressToObject(address: any): any {

    let addressObject = address;

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

    return addressObject;
}
