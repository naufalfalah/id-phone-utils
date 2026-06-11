import { describe, it, expect } from 'vitest';
import { IndonesianPhoneValidator } from '../src/phoneValidator';

describe('IndonesianPhoneValidator', () => {
    describe('normalize', () => {
        it('should normalize +62 prefix', () => {
            expect(IndonesianPhoneValidator.normalize('+6281234567890')).toBe(
                '081234567890'
            );
        });

        it('should normalize 62 prefix', () => {
            expect(IndonesianPhoneValidator.normalize('6281234567890')).toBe(
                '081234567890'
            );
        });

        it('should strip spaces and dashes', () => {
            expect(IndonesianPhoneValidator.normalize('0812-3456-7890')).toBe(
                '081234567890'
            );
            expect(IndonesianPhoneValidator.normalize('0812 3456 7890')).toBe(
                '081234567890'
            );
        });

        it('should leave already normalized number unchanged', () => {
            expect(IndonesianPhoneValidator.normalize('081234567890')).toBe(
                '081234567890'
            );
        });
    });

    describe('isValid', () => {
        it('should return true for valid number', () => {
            expect(IndonesianPhoneValidator.isValid('+6281234567890')).toBe(
                true
            );
        });

        it('should return false for number too short', () => {
            expect(IndonesianPhoneValidator.isValid('0812345')).toBe(false);
        });

        it('should return false for non-mobile prefix', () => {
            expect(IndonesianPhoneValidator.isValid('02112345678')).toBe(false);
        });

        it('should return false for empty string', () => {
            expect(IndonesianPhoneValidator.isValid('')).toBe(false);
        });
    });

    describe('getOperator', () => {
        it('should detect Telkomsel', () => {
            expect(IndonesianPhoneValidator.getOperator('081234567890')).toBe(
                'Telkomsel'
            );
        });

        it('should detect Indosat', () => {
            expect(IndonesianPhoneValidator.getOperator('085612345678')).toBe(
                'Indosat'
            );
        });

        it('should detect XL', () => {
            expect(IndonesianPhoneValidator.getOperator('081712345678')).toBe(
                'XL'
            );
        });

        it('should detect Tri', () => {
            expect(IndonesianPhoneValidator.getOperator('089512345678')).toBe(
                'Tri'
            );
        });

        it('should detect Smartfren', () => {
            expect(IndonesianPhoneValidator.getOperator('088812345678')).toBe(
                'Smartfren'
            );
        });

        it('should detect Axis', () => {
            expect(IndonesianPhoneValidator.getOperator('083112345678')).toBe(
                'Axis'
            );
        });

        it('should return Unknown Operator for unrecognized prefix', () => {
            expect(IndonesianPhoneValidator.getOperator('089012345678')).toBe(
                'Unknown Operator'
            );
        });
    });

    describe('clean', () => {
        it('should remove spaces', () => {
            expect(IndonesianPhoneValidator.clean('0812 3456 7890')).toBe(
                '081234567890'
            );
        });

        it('should remove dashes', () => {
            expect(IndonesianPhoneValidator.clean('0812-3456-7890')).toBe(
                '081234567890'
            );
        });

        it('should remove parentheses', () => {
            expect(IndonesianPhoneValidator.clean('(0812)34567890')).toBe(
                '081234567890'
            );
        });

        it('should preserve leading +', () => {
            expect(IndonesianPhoneValidator.clean('+62 812-3456-7890')).toBe(
                '+6281234567890'
            );
        });

        it('should remove dots', () => {
            expect(IndonesianPhoneValidator.clean('0812.3456.7890')).toBe(
                '081234567890'
            );
        });
    });
});
