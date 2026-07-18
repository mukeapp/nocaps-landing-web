


export class Unit {
  documentId?: string; // Unique identifier for the document
  id?: string;
  label?: string; // USD $
  value?: string; // USD
  symbol?: string; // $
  symbolPosition?: string; // before or after the value
  decimalPlaces?: number; // Number of decimal places for the Unit
  decimalSeparator?: string; // Character used as the decimal separator
  thousandSeparator?: string; // Character used as the thousand separator
  maxValue?: number; // Maximum value for the Unit
  icon?: string;
  iconLibrary?: string;
  description?: string;
  isVisible?: boolean; // Determines if the unit is visible in the UI
  createdAt?: Date; // Timestamp for when the
  updatedAt?: Date;
}