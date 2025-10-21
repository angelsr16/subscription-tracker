export interface Subscription {
  _id: string;
  name: string;
  price: number;
  currency: string;
  startDate: Date;
  renewalDate: Date;
  status: string;
}
