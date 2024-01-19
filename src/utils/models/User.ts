import { RoleEntity } from "./RoleEntity";

export interface User {
    roleEntity: RoleEntity;
    id: string;
    email: string;
    password: string | null;
    firstName: string;
    lastName: string;
    countryCode: string;
    mobileNo: string;
    userActiveFlag: boolean;
    kycVerification: string;
    createdDate: string;
    modifiedDate: string | null;
    createdBy: string;
    modifiedBy: string | null;
    role: string;
    streetAddress:string;
    city:string;
    state:string;
    zipcode:string;
    country:string;
  }

  export interface Address{
    streetAddress:string;
    city:string;
    state:string;
    zipcode:string;
    country:string;
  }