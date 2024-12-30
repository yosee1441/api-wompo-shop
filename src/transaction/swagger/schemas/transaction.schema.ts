const transaction = {
  quantity: 1,
  productId: 1,
  customerId: 1,
  sizeId: 1,
  cardNumber: '4242424242424242',
  redirectUrl: 'http://localhost.com',
  expMonth: '02',
  expYear: '27',
  cvc: '123',
  cardHolder: 'Mauricio Flor',
  acceptanceToken:
    'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MjEzLCJwZXJtYWxpbmsiOiJodHRwczovL3dvbXBpLmNvbS9hc3NldHMvZG93bmxvYWRibGUvcmVnbGFtZW50by1Vc3Vhcmlvcy1Db2xvbWJpYS5wZGYiLCJmaWxlX2hhc2giOiJkMWVkMDI3NjhlNDEzZWEyMzFmNzAwMjc0N2Y0N2FhOSIsImppdCI6IjE3MzUyNDc2MjgtODU4MDEiLCJlbWFpbCI6IiIsImV4cCI6MTczNTI1MTIyOH0.GmqQm1EcOwqbQ8mJWUYOzcW7hvm2Bvm9LQZOrE-omu8',
  acceptPersonalAuth:
    'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MzQ1LCJwZXJtYWxpbmsiOiJodHRwczovL3dvbXBpLmNvbS9hc3NldHMvZG93bmxvYWRibGUvYXV0b3JpemFjaW9uLWFkbWluaXN0cmFjaW9uLWRhdG9zLXBlcnNvbmFsZXMucGRmIiwiZmlsZV9oYXNoIjoiOTVkYzcwN2M0M2UxYmViMDAwMDUyZDNkNWJhZThhMDAiLCJqaXQiOiIxNzM1MjQ3NjI4LTg4MzQ2IiwiZW1haWwiOiIifQ.0o6Wv_Ro_ZMiEi8BH5Pct9s5_wNsDdEEthIzACOomMQ',
  currency: 'COP',
  customerEmail: 'mauricioft93@gmail.com',
  paymentMethod: {
    type: 'CARD',
    installments: 2,
    token: 'tok_prod_1_BBb749EAB32e97a2D058Dd538a608301',
  },
};

export const transactionResponseSchema = {
  data: transaction,
  notification: [],
};
