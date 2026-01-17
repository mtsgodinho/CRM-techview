
export type UserRole = 'ADMIN' | 'SELLER';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string; // Only for prototype simulation
  createdAt: number;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  screens: number;
}

export interface UserConfig {
  pixelId: string;
  accessToken: string;
  userName: string;
  sellerId: string;
  plans?: Plan[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  cep: string;
  planId: string;
  source: string;
  timestamp: number;
  status: 'new' | 'contacted' | 'converted';
  sellerId: string; // Tie leads to a specific seller
}

export interface CapiPayload {
  event_name: string;
  event_time: number;
  event_source_url: string;
  event_id: string;
  action_source: string;
  user_data: {
    em: string;
    ph: string;
    fn: string;
    ln: string;
    zp: string;
    fbc?: string;
    fbp?: string;
    client_ip_address: string;
    client_user_agent: string;
  };
  custom_data: {
    content_name: string;
    content_category: string;
    content_type: string;
    content_ids: string[];
    value: number;
    currency: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
}
