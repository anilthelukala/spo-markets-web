export interface Permission {
    id: string;
    service: string;
    feature: string;
    action: string;
    roleFlag: boolean;
    role: string;
    createdDate: string;
    modifiedDate: string | null;
    createdBy: string;
    modifiedBy: string | null;
  }