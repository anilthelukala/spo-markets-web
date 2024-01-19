import { Permission } from "./Permission";

export interface RoleEntity {
    permissions: Permission[];
    id: string;
    name: string;
    code: string;
    roleActiveFlag: boolean;
    createdDate: string;
    modifiedDate: string | null;
    createdBy: string;
    modifiedBy: string | null;
  }