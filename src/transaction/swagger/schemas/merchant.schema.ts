const merchant = {
  data: {
    id: 17690,
    name: 'Pruebas En Sandbox',
    email: 'pruebasensandbox@yopmail.com',
    contact_name: 'Alejandra Pruebas Sandbox UAT',
    phone_number: '+573000000000',
    active: true,
    logo_url: null,
    legal_name: 'Alejandra Pruebas Sandbox UAT',
    legal_id_type: 'CC',
    legal_id: '1069879849',
    public_key: 'pub_stagint_fjIqRyHmHvmqYgPFCO5nibfrtraL6ixq',
    accepted_currencies: ['COP'],
    fraud_javascript_key: '51aea55355',
    fraud_groups: [
      {
        provider: 'SS',
        public_data: {
          javascript_key: '51aea55355',
        },
      },
    ],
    accepted_payment_methods: [
      'CARD',
      'NEQUI',
      'PSE',
      'BANCOLOMBIA_TRANSFER',
      'BANCOLOMBIA_COLLECT',
      'BANCOLOMBIA_QR',
      'PCOL',
      'CARD_TTP',
      'DAVIPLATA',
      'SU_PLUS',
    ],
    payment_methods: [
      {
        name: 'BANCOLOMBIA_COLLECT',
        payment_processors: [
          {
            name: 'BANCOLOMBIA_COLLECT',
          },
        ],
      },
      {
        name: 'BANCOLOMBIA_QR',
        payment_processors: [
          {
            name: 'BANCOLOMBIA_QR',
          },
        ],
      },
      {
        name: 'BANCOLOMBIA_TRANSFER',
        payment_processors: [
          {
            name: 'BANCOLOMBIA_TRANSFER',
          },
        ],
      },
      {
        name: 'CARD',
        payment_processors: [
          {
            name: 'FISERV',
          },
          {
            name: 'RBM',
          },
        ],
      },
      {
        name: 'CARD_TTP',
        payment_processors: [
          {
            name: 'SYMBIOTIC_RBM',
          },
        ],
      },
      {
        name: 'DAVIPLATA',
        payment_processors: [
          {
            name: 'DAVIPLATA',
          },
        ],
      },
      {
        name: 'NEQUI',
        payment_processors: [
          {
            name: 'NEQUI',
          },
        ],
      },
      {
        name: 'PCOL',
        payment_processors: [
          {
            name: 'PCOL',
          },
        ],
      },
      {
        name: 'PSE',
        payment_processors: [
          {
            name: 'PSE_AVANZA',
          },
        ],
      },
      {
        name: 'SU_PLUS',
        payment_processors: [
          {
            name: 'SU_PLUS',
          },
        ],
      },
    ],
    presigned_acceptance: {
      acceptance_token:
        'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MjEzLCJwZXJtYWxpbmsiOiJodHRwczovL3dvbXBpLmNvbS9hc3NldHMvZG93bmxvYWRibGUvcmVnbGFtZW50by1Vc3Vhcmlvcy1Db2xvbWJpYS5wZGYiLCJmaWxlX2hhc2giOiJkMWVkMDI3NjhlNDEzZWEyMzFmNzAwMjc0N2Y0N2FhOSIsImppdCI6IjE3MzQ5NzI2MzAtNTE0NTQiLCJlbWFpbCI6IiIsImV4cCI6MTczNDk3NjIzMH0.cM2WDq1qAwqpkyPnKoK15JqkbfFmcJuGvuY7leab89k',
      permalink:
        'https://wompi.com/assets/downloadble/reglamento-Usuarios-Colombia.pdf',
      type: 'END_USER_POLICY',
    },
    presigned_personal_data_auth: {
      acceptance_token:
        'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MzQ1LCJwZXJtYWxpbmsiOiJodHRwczovL3dvbXBpLmNvbS9hc3NldHMvZG93bmxvYWRibGUvYXV0b3JpemFjaW9uLWFkbWluaXN0cmFjaW9uLWRhdG9zLXBlcnNvbmFsZXMucGRmIiwiZmlsZV9oYXNoIjoiOTVkYzcwN2M0M2UxYmViMDAwMDUyZDNkNWJhZThhMDAiLCJqaXQiOiIxNzM0OTcyNjMwLTc2NDYxIiwiZW1haWwiOiIifQ.e8UxOuJXfvBb_kftSMT5-TtBzvxOpzhkKHymHfUznco',
      permalink:
        'https://wompi.com/assets/downloadble/autorizacion-administracion-datos-personales.pdf',
      type: 'PERSONAL_DATA_AUTH',
    },
  },
  meta: {},
};

export const merchantResponseSchema = {
  data: merchant,
  notification: [],
};
