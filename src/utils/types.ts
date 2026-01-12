export interface Job {
  JobId: number;
  ClientId: number;
  ClientName?: string;
  ClientIsPartnerCompany: number;
  IsLowVolumePosition: number;
  JobLocation: string | null;
  Location?: string | null;
  JobTitle: string;
  StartDate: string;
  StatusDate: string;
  CurrencyName: string;
  CurrencySymbol: string;
  Category: string;
  Company?: string;
  PublishedJobDescription: string;
  CreatedOn: string;
  NoOfPlaces: number;
  EmploymentType: string;
  Salary: string;
  MinBasic: string;
  MaxBasic: string;
  MinPackage: string;
  MaxPackage: string;
  JobRefNo: string;
  ROWORDER: number;
}
