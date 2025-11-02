export interface Subscription {
  _id: string;
  name: string;
  price: number;
  currency: string;
  startDate: Date;
  frecuency: string;
  renewalDate: Date;
  status: string;
  renewalStatus: string;
}
