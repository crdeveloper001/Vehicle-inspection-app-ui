export interface DiagnosticAndQuote {
	ClientDetails: any[];
	VehicleDetails: any[];
	DiagnosticName: string[];
	DiagnosticTechinician: string;
	DiagnosticComments: string[];
	DiagnosticSpares: string[];
	DiagnosticTotal: number;
	DiagnosticCreationDate: Date;
	DiagnosticValid: boolean;
	createdAt: Date;
	updatedAt: Date;
}
