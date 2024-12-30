export interface TransactionResponse {
  data: Transaction;
  meta: Meta;
}

interface Meta {}

export interface Transaction {
  id: string;
  created_at: string;
  finalized_at: null;
  amount_in_cents: number;
  reference: string;
  customer_email: string;
  currency: string;
  payment_method_type: string;
  payment_method: Paymentmethod;
  status: string;
  status_message: null;
  billing_data: null;
  shipping_address: null;
  redirect_url: string;
  payment_source_id: null;
  payment_link_id: null;
  customer_data: Customerdata;
  bill_id: null;
  taxes: Tax[];
  tip_in_cents: null;
}

interface Tax {
  type: string;
  amount_in_cents: number;
}

interface Customerdata {
  legal_id: string;
  full_name: string;
  phone_number: string;
  legal_id_type: string;
}

interface Paymentmethod {
  type: string;
  extra: Extra;
  installments: number;
}

interface Extra {
  bin: string;
  name: string;
  brand: string;
  exp_year: string;
  card_type: string;
  exp_month: string;
  last_four: string;
  card_holder: string;
  is_three_ds: boolean;
  three_ds_auth_type: null;
}
