export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  ANALYST = 'ANALYST',
  INTEL_ANALYST = 'INTEL_ANALYST',
}

export enum ClearanceLevel {
  CL5_TOP_SECRET = 'CL5_TOP_SECRET',
  CL4_COUNTER_INTEL = 'CL4_COUNTER_INTEL',
  CL3_RESTRICTED = 'CL3_RESTRICTED',
  CL2_SECURITY = 'CL2_SECURITY',
  CL1_PUBLIC = 'CL1_PUBLIC',
}

export interface UserSession {
  userId: string
  fullName: string
  role: UserRole
  clearance: ClearanceLevel
  organization: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
    user: {
      id: string
      email: string
      fullName: string
      role: UserRole
      clearance: ClearanceLevel
      organization: string
    }
  }
}

export interface Employee {
  id: string
  nspid: string
  fullName: string
  dateOfBirth?: string
  placeOfBirth?: string
  nationality: string
  ninnin?: string
  passportNumber?: string
  phone?: string
  email?: string
  address?: string
  department: string
  position: string
  grade: string
  dateOfEmployment?: string
  clearance: string
  isActive: boolean
  rfidCardId?: string
  rfidStatus: string
  avatarUrl?: string
  facePhotoEnrolled: boolean
  facePhotoEnrolledAt?: string
  gender?: string
  district?: string
  nationalId?: string
  occupation?: string
  riskLevel?: string
  status: string
  createdAt: string
  updatedAt: string
  accessZones?: any[]
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
    email?: string
  }
  documents?: Array<{
    type: string
    number: string
    issuedDate: string
    expiryDate: string
    fileUrl: string
  }>
}

export interface Citizen {
  id: string
  nationalId: string
  fullName: string
  dateOfBirth: string
  gender: string
  occupation?: string
  currentResidence?: string
  district?: string
  phone?: string
  email?: string
  riskLevel: string
  status: string
  politicalAffiliation?: {
    party: string
    membershipDate?: string
    status?: string
  }
  contactInfo?: {
    phonePrimary: string
    phoneSecondary?: string
    email?: string
    emergencyContact?: string
  }
  familyMembers?: Array<{
    name: string
    relationship: string
    nationalId: string
    contact?: string
    riskFlag?: boolean
  }>
  linkedNspid?: string
  linkedEmployee?: any
  avatar?: string
  surveillanceStatus?: string
}

export interface Incident {
  id: string
  type: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'REPORTED' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED'
  location: {
    district: string
    coordinates?: [number, number]
  }
  timestamp: string
  reportedBy: string
  description: string
  tags?: string[]
  casualties?: number
  affectedArea?: string
  evidenceCount?: number
}

export interface Attachment {
  id: string;
  type: "DOCUMENT" | "PHOTO" | "VIDEO" | "AUDIO";
  name: string;
  size: string;
  url: string;
}

export interface IncidentLocation {
  lat: number;
  lng: number;
  address: string;
  district: string;
  county: string;
  subcounty: string;
  zone: string;
  nearestLandmark?: string;
}

export interface Casualties {
  deaths: number;
  injured: number;
  missing: number;
  displaced: number;
}

export interface ResourceDeployed {
  type: string;
  quantity: number;
  unit: string;
  deployedAt: Date;
  deployedBy: string;
}

export interface Witness {
  name: string;
  nationalId: string;
  phone: string;
  statement: string;
  recordedBy: string;
}

export interface Evidence {
  type: string;
  description: string;
  location: string;
  collectedBy: string;
  collectedAt: Date;
  reference: string;
}

export interface IncidentUpdate {
  timestamp: Date;
  message: string;
  officer: string;
  status: string;
}

export interface DamageAssessment {
  propertyDamage: number;
  infrastructureDamage: number;
  environmentalDamage: string;
  estimatedCost: number;
}

export interface BackendIncident {
  id: string;
  reference: string;
  title: string;
  description: string;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status:
    | "REPORTED"
    | "ASSESSING"
    | "RESPONDING"
    | "CONTAINED"
    | "RESOLVED"
    | "CLOSED"
    | "FALSE_ALARM";
  location: IncidentLocation;
  reportedAt: Date;
  respondedAt?: Date;
  resolvedAt?: Date;
  reportedBy?: any;
  assignedTo?: any;
  involvedCitizen?: any;
  casualties?: Casualties;
  resourcesDeployed?: ResourceDeployed[];
  witnesses?: Witness[];
  evidence?: Evidence[];
  updates?: IncidentUpdate[];
  damageAssessment?: DamageAssessment;
  isSensitive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
