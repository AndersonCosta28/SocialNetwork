export enum EmailTypes {
  "Activation",
  "RedefinePassword"
}

export interface IAddress {
  name: string;
  email: string;
}

export interface IEmailMessage {
  to: IAddress;
  from: IAddress;
  subject: string;
  text: string;
  html: string;
}