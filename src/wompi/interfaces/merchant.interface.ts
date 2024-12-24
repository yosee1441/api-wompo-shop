export interface MerchantResponse {
  data: Merchant;
  meta: Meta;
}

interface Meta {}

export interface Merchant {
  id: number;
  name: string;
  email: string;
  contact_name: string;
  phone_number: string;
  active: boolean;
  logo_url: null;
  legal_name: string;
  legal_id_type: string;
  legal_id: string;
  public_key: string;
  accepted_currencies: string[];
  fraud_javascript_key: string;
  fraud_groups: Fraudgroup[];
  accepted_payment_methods: string[];
  payment_methods: Paymentmethod[];
  presigned_acceptance: Presignedacceptance;
  presigned_personal_data_auth: Presignedacceptance;
}

interface Presignedacceptance {
  acceptance_token: string;
  permalink: string;
  type: string;
}

interface Paymentmethod {
  name: string;
  payment_processors: Paymentprocessor[];
}

interface Paymentprocessor {
  name: string;
}

interface Fraudgroup {
  provider: string;
  public_data: Publicdata;
}

interface Publicdata {
  javascript_key: string;
}
