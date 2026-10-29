// DTOs for creating/updating incidents
export interface CreateIncidentDto {
  title: string;
  description: string;
  type: string;
  severity: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    district: string;
    county: string;
    subcounty: string;
    zone: string;
    nearestLandmark?: string;
  };
  casualties?: {
    deaths: number;
    injured: number;
    missing: number;
    displaced: number;
  };
}

export interface UpdateIncidentDto extends Partial<CreateIncidentDto> {
  status?:
    | "REPORTED"
    | "ASSESSING"
    | "RESPONDING"
    | "CONTAINED"
    | "RESOLVED"
    | "CLOSED"
    | "FALSE_ALARM";
  respondedAt?: Date;
  resolvedAt?: Date;
  assignedToId?: string;
  involvedCitizenId?: string;
  resourcesDeployed?: any[];
  witnesses?: any[];
  evidence?: any[];
  damageAssessment?: any;
}
