import { Property } from "./Property";
import { PropertyFractionalisation } from "./PropertyFractionalisation";

export interface CartModel {
    id: string;
    userName: string;
    userToken: string;
    propertyId: string;
    noOfSelectedUnits: number;
    isActivee: boolean;
    propertyFractionalisation:PropertyFractionalisation;
    property:Property;
    createdDate: string;
    modifiedDate: string | null;
    createdBy: string;
    modifiedBy: string | null;
  }