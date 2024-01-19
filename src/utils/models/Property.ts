
import { PropertyFractionalisation } from "./PropertyFractionalisation";
export interface Property{
     id:string;
     propertyCode:string;
     propertyName:string;
     description:string;
     addressLine1:string;
     addressLine2:string;
     postalCode:number;
     image:string;
     videoLink:string;
     projectId:string;
     propertyActiveFlag:string;
     propertyType:string;
     baseRate:number;
     latestRate:number;
     gearedPercentage:number;
     capitalGrowthRate:number;
     historicalSuburbGrowthRate:number;
     latestBlockValuation:number;
     settlementDate:string;
     bedType:number;
     bathType:number;
     parkingType:number;
     soldStatus:string;
     createdDate:string;
     createdBy:string;
     modifiedDate:string;
     modifiedBy:string;
     targetCompletionDate:string;
     propertyFractionalisation: PropertyFractionalisation;
}