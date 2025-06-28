import { describe, it, expect } from 'vitest';
import { IndonesianPhoneValidator } from '../src/phoneValidator';

describe('IndonesianPhoneValidator', () => {
    it('should normalize phone number with +62', () => {
        expect(IndonesianPhoneValidator.normalize('+6281234567890')).toBe('081234567890');
    });

  it('should validate valid number', () => {
    expect(IndonesianPhoneValidator.isValid('+6281234567890')).toBe(true);
  });

  it('should detect operator', () => {
    expect(IndonesianPhoneValidator.getOperator('081234567890')).toBe('Telkomsel');
  });
});