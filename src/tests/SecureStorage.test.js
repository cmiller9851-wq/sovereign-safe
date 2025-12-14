import SecureStorage from '../utils/SecureStorage';

describe('SecureStorage', () => {
  it('should save and retrieve data', async () => {
    await SecureStorage.setItem('testKey', 'testValue');
    const value = await SecureStorage.getItem('testKey');
    expect(value).toBe('testValue');
  });
});
