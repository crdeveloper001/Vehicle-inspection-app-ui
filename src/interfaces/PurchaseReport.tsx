export interface PurchaseReport {
  _id?: string;
  // Client Information
  clientName?: string;
  clientLastname?: string;
  clientPhone?: string;

  // Vehicle Information
  make?: string;
  model?: string;
  year?: number;
  plate?: string;
  vin?: string;
  mileage?: string;

  // Engine
  engineCondition?: string;
  engineNotes?: string;

  // Brakes
  brakeCondition?: string;
  brakeNotes?: string;

  // Suspension
  suspensionCondition?: string;
  suspensionNotes?: string;

  // Other Components
  body?: string;
  interior?: string;
  tires?: string;

  // Report
  conclusion?: string;
  createdBy?: string;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}
