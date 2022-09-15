export interface Config {
  owner: string;
  general: GeneralConfig;
  ems: EMSConfig;
}
export interface EMSConfig {
  enabled: boolean;

  permissions: {
    [key: string]: {
      read: boolean;
      write: boolean;
      admin: boolean;
    };
  };
  fields: EMSField[];
}
export interface EMSField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  isTableField: boolean;
}

export interface PermissionRecord {
  read: boolean;
  write: boolean;
  admin: boolean;
  email: string;
}

export interface EMSProfile {
  email: string;
  [key: string]: any;
}

export interface GeneralConfig {
  owner: string | null;
  companyName: string;
  currency: string | null;
  currencySymbol: string | null;
  logoURL: string | null;
}

export interface User {
  displayName: string | null;
  email: string;
  photoURL: string | null;
  uid: string | null;
}

// API
export interface APIKey {
  hidden?: boolean;
  key?: string;
  name: string;
  created_by: string;
  deactivated?: boolean;

  permissions: {
    [key: string]: {
      read: boolean;
      write: boolean;
    };
  };
}
