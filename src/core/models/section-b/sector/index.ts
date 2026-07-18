export interface Sector {
  documentId: string; // Unique identifier for the document
  id: string;
  label: string;
  value: string;
  interestIds?: string[];
  focusIds?: string[];
  unitIds?: string[];
  priorityIds?: string[];
  description?: string;
  createdAt?: Date; // Timestamp for when the
  updatedAt?: Date;
}