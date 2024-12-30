import { camelizeKeys, decamelizeKeys } from '@/wompi/utils/helpers.util';

describe('camelizeKeys', () => {
  it('should convert object keys from snake_case to camelCase', () => {
    const input = {
      first_name: 'John',
      last_name: 'Doe',
      user_details: {
        user_id: 1,
        user_address: {
          street_name: 'Main St',
        },
      },
    };

    const expected = {
      firstName: 'John',
      lastName: 'Doe',
      userDetails: {
        userId: 1,
        userAddress: {
          streetName: 'Main St',
        },
      },
    };

    expect(camelizeKeys(input)).toEqual(expected);
  });

  it('should convert array of objects from snake_case to camelCase', () => {
    const input = [
      { first_name: 'John', last_name: 'Doe' },
      { first_name: 'Jane', last_name: 'Doe' },
    ];

    const expected = [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Doe' },
    ];

    expect(camelizeKeys(input)).toEqual(expected);
  });

  it('should return non-object values as is', () => {
    expect(camelizeKeys('string')).toBe('string');
    expect(camelizeKeys(123)).toBe(123);
    expect(camelizeKeys(null)).toBeNull();
    expect(camelizeKeys(undefined)).toBeUndefined();
  });
});

describe('decamelizeKeys', () => {
  it('should convert object keys from camelCase to snake_case', () => {
    const input = {
      firstName: 'John',
      lastName: 'Doe',
      userDetails: {
        userId: 1,
        userAddress: {
          streetName: 'Main St',
        },
      },
    };

    const expected = {
      first_name: 'John',
      last_name: 'Doe',
      user_details: {
        user_id: 1,
        user_address: {
          street_name: 'Main St',
        },
      },
    };

    expect(decamelizeKeys(input)).toEqual(expected);
  });

  it('should convert array of objects from camelCase to snake_case', () => {
    const input = [
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Doe' },
    ];

    const expected = [
      { first_name: 'John', last_name: 'Doe' },
      { first_name: 'Jane', last_name: 'Doe' },
    ];

    expect(decamelizeKeys(input)).toEqual(expected);
  });

  it('should handle keys with numbers correctly', () => {
    const input = {
      field1Name: 'value',
      user2Details: {
        property3Value: 123,
      },
    };

    const expected = {
      field_1_name: 'value',
      user_2_details: {
        property_3_value: 123,
      },
    };

    expect(decamelizeKeys(input)).toEqual(expected);
  });

  it('should return non-object values as is', () => {
    expect(decamelizeKeys('string')).toBe('string');
    expect(decamelizeKeys(123)).toBe(123);
    expect(decamelizeKeys(null)).toBeNull();
    expect(decamelizeKeys(undefined)).toBeUndefined();
  });
});
