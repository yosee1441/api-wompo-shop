jest.mock('@/common/config', () => ({
  envs: {
    PORT: 3000,
    URL_BASE: 'http://localhost/v1',
    API_KEY_PUB_WOMPO: 'public_test_0001',
    API_KEY_PRV_WOMPO: 'private_test_0001',
    API_KEY_EVENTS_WOMPO: 'events_test_0001',
    API_KEY_INTEGRITY_WOMPO: 'integrity_test_0001',
  },
}));
