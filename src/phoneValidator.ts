export class IndonesianPhoneValidator {
    private static operatorPrefixes: Record<string, string[]> = {
        Telkomsel: [
            '0811',
            '0812',
            '0813',
            '0821',
            '0822',
            '0823',
            '0852',
            '0853',
            '0851',
        ],
        Indosat: ['0814', '0815', '0816', '0855', '0856', '0857', '0858'],
        XL: ['0817', '0818', '0819', '0859', '0877', '0878'],
        Tri: ['0895', '0896', '0897', '0898', '0899'],
        Smartfren: [
            '0881',
            '0882',
            '0883',
            '0884',
            '0885',
            '0886',
            '0887',
            '0888',
            '0889',
        ],
        Axis: ['0831', '0832', '0833', '0838'],
    };

    /**
     * Nomalizes an Indonesian phone number to format 08xxxxxxxxx.
     */
    static normalize(phone: string): string {
        let cleaned = phone.replace(/[\s\-]/g, '');
        if (cleaned.startsWith('+62')) {
            cleaned = '0' + cleaned.slice(3);
        } else if (cleaned.startsWith('62')) {
            cleaned = '0' + cleaned.slice(2);
        }
        return cleaned;
    }

    /**
     * Validates if the phone number is a valid Indonesian phone number.
     */
    static isValid(phone: string): boolean {
        const normalized = this.normalize(phone);
        const regex = /^08[1-9][0-9]{7,11}$/;
        return regex.test(normalized);
    }

    /**
     * Detects the operator of the phone number.
     */
    static getOperator(phone: string): string {
        const normalized = this.normalize(phone);
        for (const [operator, prefixes] of Object.entries(
            this.operatorPrefixes
        )) {
            if (prefixes.some((prefix) => normalized.startsWith(prefix))) {
                return operator;
            }
        }
        return 'Unknown Operator';
    }

    /**
     * Removes all non-numeric characters except leading +.
     */
    static clean(phone: string): string {
        return phone.replace(/[^\d+]/g, '').replace(/(?!^\+)\+/g, '');
    }
}
