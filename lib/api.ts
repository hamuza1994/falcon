import { BackendIncident, Incident, Attachment } from "./types";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { CreateIncidentDto, UpdateIncidentDto } from "./dto/incident.dto";

const API_BASE_URL = "https://security-backend-dsya.onrender.com/api/v1";

export interface LoginCredentials {
  email: string;
  password: string;
  
  organization?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      fullName: string;
      role: string;
      clearance: string;
      organization: string;
    };
  };
}

export interface Employee {
  id: string;
  nspid: string;
  fullName: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  nationality: string;
  ninnin?: string;
  passportNumber?: string;
  phone?: string;
  email?: string;
  address?: string;
  department: string;
  position: string;
  grade: string;
  dateOfEmployment?: string;
  clearance: string;
  isActive: boolean;
  rfidCardId?: string;
  rfidStatus: string;
  avatarUrl?: string;
  facePhotoEnrolled: boolean;
  facePhotoEnrolledAt?: string;
  gender?: string;
  district?: string;
  nationalId?: string;
  occupation?: string;
  riskLevel?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  accessZones?: any[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  documents?: Array<{
    type: string;
    number: string;
    issuedDate: string;
    expiryDate: string;
    fileUrl: string;
  }>;
}

export interface EmployeeDisplay {
  nspid: string;
  fullName: string;
  avatar: string;
  agency: string;
  position: string;
  rank: string;
  clearanceLevel: string;
  riskScore: number;
  status: "ACTIVE" | "SUSPENDED" | "TERMINATED" | "INACTIVE";
}

export interface Asset {
  id: string;
  type: string;
  description: string;
  value: string;
  valuationDate: string;
  status: "VERIFIED" | "UNDER_REVIEW" | "FLAGGED";
}

export interface Citizen {
  id: string;
  nationalId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  occupation?: string;
  currentResidence?: string;
  district?: string;
  phone?: string;
  email?: string;
  riskLevel: string;
  status: string;
  politicalAffiliation?: {
    party: string;
    membershipDate?: string;
    status?: string;
  };
  contactInfo?: {
    phonePrimary: string;
    phoneSecondary?: string;
    email?: string;
    emergencyContact?: string;
  };
  familyMembers?: Array<{
    name: string;
    relationship: string;
    nationalId: string;
    contact?: string;
    riskFlag?: boolean;
  }>;
  linkedNspid?: string;
  linkedEmployee?: any;
  avatar?: string;
  surveillanceStatus?: string;
}

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// WebSocket connection
let socket: Socket | null = null;

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Token being sent:", token.substring(0, 20) + "...");
  }
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        console.log(
          "Attempting token refresh with token:",
          refreshToken ? "Present" : "Missing"
        );

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        console.log("Refresh response:", response.data);

        const newAccessToken =
          response.data.data?.accessToken || response.data.accessToken;

        if (newAccessToken) {
          localStorage.setItem("access_token", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          console.log("Token refreshed successfully");
          return api(originalRequest);
        } else {
          console.error("No access token in refresh response");
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// In your api.ts - Add these interceptors
api.interceptors.request.use((config) => {
  console.log("Request:", {
    url: config.url,
    method: config.method,
    baseURL: config.baseURL,
    headers: config.headers,
  });
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("Response success:", response.status);
    return response;
  },
  (error) => {
    console.error("Response error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      },
    });
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log("Attempting login with:", credentials.email);
    const response = await api.post("/auth/login", credentials);
    console.log("Login response:", response.data);

    if (response.data.data?.accessToken) {
      console.log(
        "Storing token:",
        response.data.data.accessToken.substring(0, 20) + "..."
      );
      localStorage.setItem("access_token", response.data.data.accessToken);
      localStorage.setItem("refresh_token", response.data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));

      const storedToken = localStorage.getItem("access_token");
      console.log("Token stored successfully:", !!storedToken);
    } else {
      console.error("No accessToken in response:", response.data);
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("access_token");
  },

  getContacts: async (limit: number = 100, search?: string) => {
    const response = await api.get("/auth/contacts", {
      params: { limit, search },
    });
    return response.data;
  },

  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    organization?: string;
  }) => {
    const response = await api.get("/auth/users", { params });
    return response.data;
  },
};

// WebSocket service
export const websocketService = {
  connect: () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    socket = io("https://security-backend-dsya.onrender.com/api/v1", {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    socket.on("rfid-scan", (data) => {
      window.dispatchEvent(new CustomEvent("rfid-scan", { detail: data }));
    });

    socket.on("security-alert", (data) => {
      window.dispatchEvent(new CustomEvent("security-alert", { detail: data }));
    });

    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },
};

// Employees service
export const employeesService = {
  /**
   * Get all employees with pagination and filtering
   */
  /**
   * Get all employees with pagination and filtering
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    isActive?: boolean;
  }) => {
    try {
      console.log("Fetching employees with params:", params);
      const response = await api.get("/employees", { params });
      console.log("Raw API response:", response.data);

      // Handle the nested response structure: { success: true, data: { data: [...] } }
      let employeesArray: any[] = [];
      let total = 0;

      // Check if response has the nested structure
      if (response.data && response.data.success) {
        // Your backend returns: { success: true, data: { data: [...], total: 2 } }
        if (response.data.data && response.data.data.data) {
          employeesArray = response.data.data.data;
          total = response.data.data.total || employeesArray.length;
        }
        // Alternative structure: { success: true, data: [...] }
        else if (Array.isArray(response.data.data)) {
          employeesArray = response.data.data;
          total = employeesArray.length;
        }
        // Alternative: { success: true, data: { items: [...] } }
        else if (response.data.data && response.data.data.items) {
          employeesArray = response.data.data.items;
          total = response.data.data.total || employeesArray.length;
        }
      }
      // Fallback for direct array
      else if (Array.isArray(response.data)) {
        employeesArray = response.data;
        total = employeesArray.length;
      }

      console.log("Extracted employees array:", employeesArray);

      // Transform each employee to display format
      const displayEmployees = employeesArray.map((emp: any) => {
        console.log("Processing raw employee:", emp);

        // Get the full name
        const fullName = emp.fullName || emp.full_name || "";

        // Generate avatar URL
        const avatar =
          emp.avatarUrl ||
          emp.avatar_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            fullName
          )}&background=334155&color=fff&size=128&bold=true&length=2`;

        // Calculate risk score based on clearance
        let riskScore = 20; // Default LOW
        switch (emp.clearance) {
          case "CL5_TOP_SECRET":
            riskScore = 80;
            break;
          case "CL4_COUNTER_INTEL":
            riskScore = 60;
            break;
          case "CL3_RESTRICTED":
            riskScore = 40;
            break;
          case "CL2_INTERNAL":
            riskScore = 20;
            break;
          case "CL1_PUBLIC":
            riskScore = 10;
            break;
        }

        // Determine status
        let status: "ACTIVE" | "SUSPENDED" | "TERMINATED" | "INACTIVE" =
          "ACTIVE";
        if (emp.status === "SUSPENDED") status = "SUSPENDED";
        else if (emp.status === "TERMINATED") status = "TERMINATED";
        else if (emp.isActive === false) status = "INACTIVE";

        return {
          nspid: emp.nspid,
          fullName: fullName,
          avatar: avatar,
          agency: emp.department || "N/A",
          position: emp.position || "N/A",
          rank: emp.grade || "N/A",
          clearanceLevel: emp.clearance || "CL2_INTERNAL",
          riskScore: riskScore,
          status: status,
        };
      });

      console.log("Final display employees:", displayEmployees);

      return {
        data: displayEmployees,
        total: total,
        page: params?.page || 1,
        limit: params?.limit || 10,
      };
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  },

  /**
   * Get employee by ID
   */
  getById: async (id: string) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  /**
   * Get employee by NSPID
   */
  getByNSPID: async (nspid: string) => {
    const response = await api.get(`/employees/nspid/${nspid}`);
    return response.data;
  },

  /**
   * Search employees
   */
  search: async (query: string) => {
    const response = await api.get("/employees/search", { params: { query } });
    return response.data;
  },

  /**
   * Get dashboard statistics
   */
  getDashboardStats: async () => {
    const response = await api.get("/employees/dashboard/stats");
    return response.data;
  },

  /**
   * Get employee financial data (assets, allowances)
   */
  getFinancialData: async (employeeId: string): Promise<any> => {
    try {
      const [assetsRes, allowancesRes] = await Promise.all([
        employeesService.getAssets(employeeId),
        employeesService.getAllowances(employeeId),
      ]);

      return {
        assets: assetsRes.data || assetsRes,
        allowances: allowancesRes.data || allowancesRes,
      };
    } catch (error) {
      console.error("Error fetching financial data:", error);
      return { assets: [], allowances: [] };
    }
  },

  // Asset methods
  getAssets: async (employeeId: string) => {
    const response = await api.get(`/employees/${employeeId}/assets`);
    return response.data;
  },

  addAsset: async (employeeId: string, assetData: any) => {
    const response = await api.post(
      `/employees/${employeeId}/assets`,
      assetData
    );
    return response.data;
  },

  updateAsset: async (assetId: string, assetData: any) => {
    const response = await api.patch(`/employees/assets/${assetId}`, assetData);
    return response.data;
  },

  deleteAsset: async (assetId: string) => {
    const response = await api.delete(`/employees/assets/${assetId}`);
    return response.data;
  },

  // Allowance methods
  getAllowances: async (employeeId: string) => {
    const response = await api.get(`/employees/${employeeId}/allowances`);
    return response.data;
  },

  addAllowance: async (employeeId: string, allowanceData: any) => {
    const response = await api.post(
      `/employees/${employeeId}/allowances`,
      allowanceData
    );
    return response.data;
  },

  updateAllowance: async (allowanceId: string, allowanceData: any) => {
    const response = await api.patch(
      `/employees/allowances/${allowanceId}`,
      allowanceData
    );
    return response.data;
  },

  deleteAllowance: async (allowanceId: string) => {
    const response = await api.delete(`/employees/allowances/${allowanceId}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post("/employees", data);
    return response.data;
  },

  enrollPhoto: async (
    subjectId: string,
    photoBase64: string,
    type: "EMPLOYEE" | "CITIZEN"
  ) => {
    const response = await api.post("/biometric/enroll", {
      subjectId,
      subjectType: type,
      images: [photoBase64],
    });
    return response.data;
  },
};
// Citizens service
export const citizensService = {
  /**
   * Get all citizens with pagination and filtering
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    district?: string;
    riskLevel?: string;
    status?: string;
  }) => {
    const response = await api.get("/citizens", { params });
    return response.data;
  },

  /**
   * Get citizen by ID
   */
  getById: async (id: string) => {
    const response = await api.get(`/citizens/${id}`);
    return response.data;
  },

  /**
   * Get citizen by National ID
   */
  getByNationalId: async (nationalId: string) => {
    const response = await api.get(`/citizens/national/${nationalId}`);
    return response.data;
  },

  /**
   * Create new citizen
   */
  create: async (data: any) => {
    const response = await api.post("/citizens", data);
    return response.data;
  },

  /**
   * Update citizen
   */
  update: async (id: string, data: any) => {
    const response = await api.patch(`/citizens/${id}`, data);
    return response.data;
  },

  /**
   * Delete citizen (deactivate)
   */
  delete: async (id: string) => {
    const response = await api.delete(`/citizens/${id}`);
    return response.data;
  },

  /**
   * Link citizen to employee
   */
  linkToEmployee: async (nationalId: string, nspid: string, reason: string) => {
    const response = await api.post(`/citizens/${nationalId}/link/${nspid}`, {
      reason,
    });
    return response.data;
  },

  /**
   * Get dashboard statistics
   */
  getDashboardStats: async () => {
    const response = await api.get("/citizens/dashboard/stats");
    return response.data;
  },

  /**
   * Transform backend citizen to frontend display format
   */
  transformToDisplay: (citizen: any): any => {
    // Generate avatar
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      citizen.fullName
    )}&background=0D8F81&color=fff&size=128&bold=true&length=2`;

    // Map status to surveillance status
    let surveillanceStatus = "CLEAR";
    if (citizen.status === "WATCHLIST") surveillanceStatus = "FLAGGED";
    if (citizen.status === "RESTRICTED") surveillanceStatus = "RESTRICTED";
    if (citizen.status === "BLACKLISTED") surveillanceStatus = "BLACKLISTED";

    // Count flagged family members
    const flaggedFamilyCount =
      citizen.familyMembers?.filter((f: { riskFlag: any; }) => f.riskFlag).length || 0;

    return {
      nationalId: citizen.nationalId,
      fullName: citizen.fullName,
      avatar: avatarUrl,
      currentResidence: citizen.address || citizen.district || "Unknown",
      contactInfo: {
        phonePrimary:
          citizen.phone || citizen.contactInfo?.phonePrimary || "N/A",
        phoneSecondary: citizen.contactInfo?.phoneSecondary,
        email: citizen.email || citizen.contactInfo?.email,
      },
      family: citizen.familyMembers || [],
      politicalAffiliation: citizen.politicalAffiliation,
      surveillanceStatus,
      riskLevel: citizen.riskLevel,
      linkedNSPID: citizen.linkedNspid,
      flaggedFamilyCount,
      // Original data for detail view
      ...citizen,
    };
  },

  /**
   * Transform array of backend citizens to frontend display format
   */
  transformManyToDisplay: (citizens: any[]): any[] => {
    return citizens.map((c) => citizensService.transformToDisplay(c));
  },
  enrollPhoto: async (
    subjectId: string,
    photoBase64: string,
    type: "EMPLOYEE" | "CITIZEN"
  ) => {
    const response = await api.post("/biometric/enroll", {
      subjectId,
      subjectType: type,
      images: [photoBase64],
    });
    return response.data;
  },
};

// ============ INCIDENTS API SERVICE ============

export interface IncidentFilters {
  page?: number;
  limit?: number;
  status?: string;
  severity?: string;
  type?: string;
  district?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
  path: string;
  statusCode: number;
}

export const incidentsService = {
  /**
   * Get all incidents with pagination and filtering
   */
  getAll: async (
    filters?: IncidentFilters
  ): Promise<PaginatedResponse<BackendIncident>> => {
    const response = await api.get("/incidents", { params: filters });
    return response.data;
  },

  /**
   * Get incident by ID
   */
  getById: async (
    id: string
  ): Promise<{ success: boolean; data: BackendIncident }> => {
    const response = await api.get(`/incidents/${id}`);
    return response.data;
  },

  /**
   * Create a new incident
   */
  create: async (
    data: CreateIncidentDto
  ): Promise<{ success: boolean; data: BackendIncident }> => {
    const response = await api.post("/incidents", data);
    return response.data;
  },

  /**
   * Update an incident
   */
  update: async (
    id: string,
    data: UpdateIncidentDto
  ): Promise<{ success: boolean; data: BackendIncident }> => {
    const response = await api.patch(`/incidents/${id}`, data);
    return response.data;
  },

  /**
   * Update incident status
   */
  updateStatus: async (
    id: string,
    status: string
  ): Promise<{ success: boolean; data: BackendIncident }> => {
    return incidentsService.update(id, { status } as UpdateIncidentDto);
  },

  /**
   * Assign incident to officer
   */
  assignTo: async (
    id: string,
    assignedToId: string
  ): Promise<{ success: boolean; data: BackendIncident }> => {
    return incidentsService.update(id, { assignedToId } as UpdateIncidentDto);
  },

  /**
   * Add resource to incident
   */
  addResource: async (
    id: string,
    resource: any
  ): Promise<{ success: boolean; data: BackendIncident }> => {
    const incident = await incidentsService.getById(id);
    const resources = incident.data.resourcesDeployed || [];
    resources.push({
      ...resource,
      deployedAt: new Date(),
    });
    return incidentsService.update(id, {
      resourcesDeployed: resources,
    } as UpdateIncidentDto);
  },

  /**
   * Add witness to incident
   */
  addWitness: async (
    id: string,
    witness: any
  ): Promise<{ success: boolean; data: BackendIncident }> => {
    const incident = await incidentsService.getById(id);
    const witnesses = incident.data.witnesses || [];
    witnesses.push(witness);
    return incidentsService.update(id, { witnesses } as UpdateIncidentDto);
  },

  /**
   * Add evidence to incident
   */
  addEvidence: async (
    id: string,
    evidence: any
  ): Promise<{ success: boolean; data: BackendIncident }> => {
    const incident = await incidentsService.getById(id);
    const evidenceList = incident.data.evidence || [];
    evidenceList.push({
      ...evidence,
      collectedAt: new Date(),
    });
    return incidentsService.update(id, {
      evidence: evidenceList,
    } as UpdateIncidentDto);
  },

  /**
   * Add update to incident timeline
   */
  addUpdate: async (
    id: string,
    message: string,
    officer: string
  ): Promise<{ success: boolean; data: BackendIncident }> => {
    const incident = await incidentsService.getById(id);
    const updates = incident.data.updates || [];
    updates.push({
      timestamp: new Date(),
      message,
      officer,
      status: incident.data.status,
    });
    return incidentsService.update(id, { updates } as UpdateIncidentDto);
  },

  /**
   * Resolve an incident
   */
  resolve: async (
    id: string,
    resolution?: string
  ): Promise<{ success: boolean; data: BackendIncident }> => {
    return incidentsService.update(id, {
      status: "RESOLVED",
      resolvedAt: new Date(),
      afterActionReport: resolution,
    } as UpdateIncidentDto);
  },

  /**
   * Close an incident
   */
  close: async (
    id: string
  ): Promise<{ success: boolean; data: BackendIncident }> => {
    return incidentsService.update(id, {
      status: "CLOSED",
    } as UpdateIncidentDto);
  },

  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<any> => {
    // You might want to create a separate endpoint for this
    const response = await incidentsService.getAll({ limit: 1 });
    const total = response.data.total;

    // Get counts by status (you'd ideally have a backend endpoint for this)
    const open = await incidentsService.getAll({ status: "REPORTED" });
    const investigating = await incidentsService.getAll({
      status: "ASSESSING",
    });
    const responding = await incidentsService.getAll({ status: "RESPONDING" });
    const resolved = await incidentsService.getAll({ status: "RESOLVED" });

    return {
      total,
      open: open.data.total,
      investigating: investigating.data.total,
      responding: responding.data.total,
      resolved: resolved.data.total,
    };
  },

  /**
   * Transform backend incident to frontend display format
   */
  transformToDisplay: (backendIncident: BackendIncident): Incident => {
    // Map backend status to frontend status
    let displayStatus:
      | "OPEN"
      | "INVESTIGATING"
      | "CONTAINED"
      | "RESOLVED"
      | "CLOSED" = "OPEN";
    if (
      backendIncident.status === "ASSESSING" ||
      backendIncident.status === "RESPONDING"
    ) {
      displayStatus = "INVESTIGATING";
    } else if (backendIncident.status === "CONTAINED") {
      displayStatus = "CONTAINED";
    } else if (backendIncident.status === "RESOLVED") {
      displayStatus = "RESOLVED";
    } else if (
      backendIncident.status === "CLOSED" ||
      backendIncident.status === "FALSE_ALARM"
    ) {
      displayStatus = "CLOSED";
    }

    // Determine domain based on incident type
    let domain: "SOCIAL" | "ECONOMIC" | "POLITICAL" | "SECURITY" = "SECURITY";
    if (backendIncident.type.includes("POLITICAL")) {
      domain = "POLITICAL";
    } else if (
      backendIncident.type.includes("ECONOMIC") ||
      backendIncident.type.includes("FRAUD")
    ) {
      domain = "ECONOMIC";
    } else if (
      backendIncident.type.includes("SOCIAL") ||
      backendIncident.type.includes("DOMESTIC")
    ) {
      domain = "SOCIAL";
    }

    return {
      id: backendIncident.id,
      reference: backendIncident.reference,
      title: backendIncident.title,
      description: backendIncident.description,
      type: backendIncident.type,
      category: backendIncident.type, // For backward compatibility
      domain,
      severity: backendIncident.severity,
      status: displayStatus,
      subjectId:
        backendIncident.involvedCitizen?.id || backendIncident.assignedTo?.id,
      suspectName: backendIncident.involvedCitizen?.fullName,
      suspectPhoto: backendIncident.involvedCitizen?.avatar,
      timestamp: backendIncident.reportedAt.toString(),
      location: backendIncident.location,
      casualties: backendIncident.casualties,
      witnesses: backendIncident.witnesses,
      evidence: backendIncident.evidence?.map((e) => ({
        ...e,
        type:
          e.type === "DOCUMENT"
            ? "DOCUMENT"
            : e.type === "PHOTO"
            ? "PHOTO"
            : e.type === "VIDEO"
            ? "VIDEO"
            : "AUDIO",
        size: "N/A", // You'd get this from the actual file
        url: e.location, // Assuming location is the file URL
      })) as unknown as Attachment[],
      reportedBy: backendIncident.reportedBy?.fullName,
      assignedTo: backendIncident.assignedTo?.fullName,
      isSensitive: backendIncident.isSensitive,
      createdAt: backendIncident.createdAt.toString(),
      updatedAt: backendIncident.updatedAt.toString(),
    };
  },

  /**
   * Transform array of backend incidents to frontend display format
   */
  transformManyToDisplay: (backendIncidents: BackendIncident[]): Incident[] => {
    return backendIncidents.map((inc) =>
      incidentsService.transformToDisplay(inc)
    );
  },
};

// Add to src/services/api.ts

export const auditService = {
  /**
   * Get all audit logs with pagination and filtering
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    action?: string;
    resource?: string;
    actor?: string;
    fromDate?: string;
    toDate?: string;
    severity?: string;
    outcome?: string;
    search?: string;
  }) => {
    const response = await api.get("/audit", { params });
    return response.data;
  },

  /**
   * Get audit summary for dashboard
   */
  getSummary: async (days?: number) => {
    const response = await api.get("/audit/summary", { params: { days } });
    return response.data;
  },

  /**
   * Export audit logs
   */
  exportLogs: async (
    format: "json" | "csv",
    fromDate?: Date,
    toDate?: Date
  ) => {
    const params: any = { format };
    if (fromDate) params.fromDate = fromDate.toISOString();
    if (toDate) params.toDate = toDate.toISOString();

    const response = await api.get("/audit/export", { params });
    return response.data;
  },
};

// Add to your existing api.ts

export interface AccessLog {
  id: string;
  timestamp: string;
  location: string;
  locationDetails?: string;
  nspid?: string;
  success: boolean;
  zone: string;
  zoneLevel?: string;
  reason?: string;
  cardId: string;
  cardType?: string;
  employee?: {
    id: string;
    nspid: string;
    fullName: string;
    avatar?: string;
  };
}

export const rfidService = {
  /**
   * Get recent access logs
   */
  getLogs: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    zone?: string;
    success?: boolean;
    fromDate?: string;
    toDate?: string;
  }) => {
    const response = await api.get("/rfid/logs", { params });
    return response.data;
  },

  /**
   * Process an RFID scan
   */
  processScan: async (data: {
    cardId: string;
    location: string;
    zone: string;
  }) => {
    const response = await api.post("/rfid/scan", data);
    return response.data;
  },

  /**
   * Get dashboard statistics
   */
  getStats: async () => {
    const response = await api.get("/rfid/stats");
    return response.data;
  },
};

// Add this to your existing api.ts

export interface BiometricMatch {
  matchId: string | null;
  confidence: number;
  isStaff: boolean;
  subject: {
    id: string;
    fullName: string;
    nationalId?: string;
    nspid?: string;
    avatarUrl: string;
    riskScore: number;
    status: string;
    clearance?: string;
    department?: string;
  } | null;
  biometricAnalysis: {
    forensicDossierSummary: string;
    structuralIntegrity: string;
    geometryMatch: string;
    qualityScore: number;
  };
  allMatches?: Array<{
    id: string;
    fullName: string;
    confidence: number;
    type: string;
  }>;
}

export interface RecognizeResponse {
  success: boolean;
  data: BiometricMatch;
}

export const biometricService = {
  /**
   * Recognize face from image
   */
  recognize: async (
    imageBase64: string,
    database: "ALL" | "CITIZENS" | "EMPLOYEES" = "ALL"
  ): Promise<RecognizeResponse> => {
    // Keep the full data URL - backend will handle the prefix
    const response = await api.post("/biometric/recognize", {
      image: imageBase64,
      database,
    });
    return response.data;
  },

  /**
   * Enroll a new face
   */
  enroll: async (data: {
    subjectId: string;
    subjectType: "EMPLOYEE" | "CITIZEN";
    images: string[];
    captureDevice?: string;
    captureLocation?: string;
  }) => {
    const response = await api.post("/biometric/enroll", data);
    return response.data;
  },
};

export interface CabinetMember {
  id: string;
  name: string;
  ministry: string;
  position: string;
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  implementationScore: number;
  status: "EXCELLENT" | "GOOD" | "AT_RISK" | "CRITICAL";
  imageUrl?: string;
  appointmentDate: string;
  constituency?: string;
  politicalParty?: string;
  performanceMetrics?: {
    budgetAbsorption: number;
    projectCompletion: number;
    policyInitiatives: number;
    constituencySatisfaction: number;
  };
}

export const cabinetService = {
  /**
   * Get complete cabinet scorecard
   */
  getScorecard: async (): Promise<{
    success: boolean;
    data: {
      members: CabinetMember[];
      stats: {
        total: number;
        excellent: number;
        good: number;
        atRisk: number;
        critical: number;
        averageScore: number;
      };
    };
  }> => {
    const response = await api.get("/cabinet/scorecard");
    return response.data;
  },

  /**
   * Get all cabinet members with pagination
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    ministry?: string;
    status?: string;
    grade?: string;
  }) => {
    const response = await api.get("/cabinet", { params });
    return response.data;
  },

  /**
   * Get cabinet member by ID
   */
  getById: async (id: string) => {
    const response = await api.get(`/cabinet/${id}`);
    return response.data;
  },

  /**
   * Create new cabinet member
   */
  create: async (data: any) => {
    const response = await api.post("/cabinet", data);
    return response.data;
  },

  /**
   * Update cabinet member
   */
  update: async (id: string, data: any) => {
    const response = await api.patch(`/cabinet/${id}`, data);
    return response.data;
  },

  /**
   * Delete cabinet member (deactivate)
   */
  delete: async (id: string) => {
    const response = await api.delete(`/cabinet/${id}`);
    return response.data;
  },

  /**
   * Get dashboard statistics
   */
  getDashboardStats: async () => {
    const response = await api.get("/cabinet/dashboard/stats");
    return response.data;
  },
};

export interface Directive {
  id: string;
  reference: string;
  title: string;
  description: string;
  issuedDate: string;
  deadline?: string;
  assignedTo: string;
  status:
    | "DRAFT"
    | "ACTIVE"
    | "ON_TRACK"
    | "DELAYED"
    | "CRITICAL"
    | "COMPLETED"
    | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  progress: number;
  milestones?: any[];
  attachments?: any[];
}

export const directivesService = {
  /**
   * Get all directives with pagination
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
  }) => {
    const response = await api.get("/directives", { params });
    return response.data;
  },

  /**
   * Get directive by ID
   */
  getById: async (id: string) => {
    const response = await api.get(`/directives/${id}`);
    return response.data;
  },

  /**
   * Get directive by reference
   */
  getByReference: async (reference: string) => {
    const response = await api.get(`/directives/reference/${reference}`);
    return response.data;
  },

  /**
   * Create new directive
   */
  create: async (data: any) => {
    const response = await api.post("/directives", data);
    return response.data;
  },

  /**
   * Update directive
   */
  update: async (id: string, data: any) => {
    const response = await api.patch(`/directives/${id}`, data);
    return response.data;
  },

  /**
   * Update directive progress
   */
  updateProgress: async (id: string, progress: number) => {
    const response = await api.patch(`/directives/${id}/progress`, {
      progress,
    });
    return response.data;
  },

  /**
   * Delete directive
   */
  delete: async (id: string) => {
    const response = await api.delete(`/directives/${id}`);
    return response.data;
  },

  /**
   * Get dashboard statistics
   */
  getDashboardStats: async () => {
    const response = await api.get("/directives/dashboard");
    return response.data;
  },

  /**
   * Get stats cards data
   */
  getStatsCards: async () => {
    const response = await api.get("/directives/stats/cards");
    return response.data;
  },
};

export interface Project {
  id: string;
  code: string;
  name: string;
  description?: string;
  sector: string;
  location: string;
  totalBudget: number;
  spentToDate: number;
  currency: string;
  status:
    | "PLANNING"
    | "APPROVED"
    | "ACTIVE"
    | "STALLED"
    | "COMPLETED"
    | "CANCELLED";
  contractor: string;
  completion: number;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  projectManager?: string;
}

export const projectsService = {
  /**
   * Get all projects with pagination
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sector?: string;
    status?: string;
  }) => {
    const response = await api.get("/projects", { params });
    return response.data;
  },

  /**
   * Get project by ID
   */
  getById: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  /**
   * Get project by code
   */
  getByCode: async (code: string) => {
    const response = await api.get(`/projects/code/${code}`);
    return response.data;
  },

  /**
   * Create new project
   */
  create: async (data: any) => {
    const response = await api.post("/projects", data);
    return response.data;
  },

  /**
   * Update project
   */
  update: async (id: string, data: any) => {
    const response = await api.patch(`/projects/${id}`, data);
    return response.data;
  },

  /**
   * Update project progress
   */
  updateProgress: async (id: string, completion: number) => {
    const response = await api.patch(`/projects/${id}/progress`, {
      completion,
    });
    return response.data;
  },

  /**
   * Update project spent amount
   */
  updateSpent: async (id: string, spent: number) => {
    const response = await api.patch(`/projects/${id}/spent`, { spent });
    return response.data;
  },

  /**
   * Delete project
   */
  delete: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  /**
   * Get dashboard statistics
   */
  getDashboardStats: async () => {
    const response = await api.get("/projects/dashboard");
    return response.data;
  },

  /**
   * Get sector summary
   */
  getSectorSummary: async () => {
    const response = await api.get("/projects/sector-summary");
    return response.data;
  },

  /**
   * Get budget utilization
   */
  getBudgetUtilization: async () => {
    const response = await api.get("/projects/budget-utilization");
    return response.data;
  },
};

// ============ ECONOMY SERVICES ============

export interface EconomicIndicator {
  id: string;
  label: string;
  value: string;
  unit?: string;
  currency?: string;
  trend?: "up" | "down" | "stable";
  change?: string;
  description?: string;
  color?: string;
}

export interface ForexDataPoint {
  time: string;
  rate: number;
}

export interface CommodityPrice {
  price: number;
  change: number;
  changePercent: string;
}

export interface EconomyPulseResponse {
  success: boolean;
  data: {
    forex: {
      current: number;
      bid: number;
      ask: number;
      lastUpdated: string;
      historical: ForexDataPoint[];
    };
    commodities: {
      brent: CommodityPrice;
      gold: CommodityPrice;
    };
    indicators: EconomicIndicator[];
  };
  timestamp: string;
}

export const economyService = {
  /**
   * Get complete economic pulse data (forex, commodities, indicators)
   */
  getPulse: async (): Promise<EconomyPulseResponse> => {
    const response = await api.get("/economy/pulse");
    return response.data;
  },

  /**
   * Get current USD/UGX forex rate
   */
  getForex: async (): Promise<{ success: boolean; data: any }> => {
    const response = await api.get("/economy/forex");
    return response.data;
  },

  /**
   * Get historical forex data for chart
   */
  getHistoricalForex: async (): Promise<{
    success: boolean;
    data: ForexDataPoint[];
  }> => {
    const response = await api.get("/economy/forex/historical");
    return response.data;
  },

  /**
   * Get commodity prices (Brent Crude, Gold)
   */
  getCommodities: async (): Promise<{
    success: boolean;
    data: { brent: CommodityPrice; gold: CommodityPrice };
  }> => {
    const response = await api.get("/economy/commodities");
    return response.data;
  },
};

export const economicIndicatorsService = {
  /**
   * Get indicators formatted for Economic Pulse
   */
  getPulseIndicators: async (): Promise<{
    success: boolean;
    data: EconomicIndicator[];
  }> => {
    const response = await api.get("/economic-indicators/pulse");
    return response.data;
  },

  /**
   * Get all indicators with pagination (for management)
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
  }) => {
    const response = await api.get("/economic-indicators", { params });
    return response.data;
  },

  /**
   * Get indicators grouped by category
   */
  getGrouped: async () => {
    const response = await api.get("/economic-indicators/grouped");
    return response.data;
  },

  /**
   * Get indicator by ID
   */
  getById: async (id: string) => {
    const response = await api.get(`/economic-indicators/${id}`);
    return response.data;
  },

  /**
   * Create new indicator
   */
  create: async (data: any) => {
    const response = await api.post("/economic-indicators", data);
    return response.data;
  },

  /**
   * Update indicator
   */
  update: async (id: string, data: any) => {
    const response = await api.patch(`/economic-indicators/${id}`, data);
    return response.data;
  },

  /**
   * Bulk update indicators
   */
  bulkUpdate: async (updates: Array<{ id: string; value: number }>) => {
    const response = await api.post(
      "/economic-indicators/bulk-update",
      updates
    );
    return response.data;
  },

  /**
   * Delete indicator
   */
  delete: async (id: string) => {
    const response = await api.delete(`/economic-indicators/${id}`);
    return response.data;
  },
};
export interface Bill {
  id: string;
  billNumber: string;
  title: string;
  description: string;
  summary?: string;
  status:
    | "FIRST_READING"
    | "COMMITTEE"
    | "SECOND_READING"
    | "ASSENT_PENDING"
    | "ASSENTED"
    | "WITHDRAWN"
    | "REJECTED";
  priority: "Critical" | "High" | "Medium" | "Low";
  sponsor: string;
  sponsorDetails?: string;
  introducedDate: string;
  firstReadingDate?: string;
  committeeDate?: string;
  secondReadingDate?: string;
  assentDate?: string;
  enactmentDate?: string;
  committeeAmendments?: any[];
  votingRecord?: any;
  documents?: any[];
  presidentialRemarks?: string;
  timelineEvents?: any[];
}

export interface BillKanban {
  FIRST_READING: Bill[];
  COMMITTEE: Bill[];
  SECOND_READING: Bill[];
  ASSENT_PENDING: Bill[];
  ASSENTED: Bill[];
}

export interface BillStats {
  total: number;
  firstReading: number;
  committee: number;
  secondReading: number;
  assentPending: number;
  assented: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export const legislativeService = {
  /**
   * Get Kanban board (bills organized by status)
   */
  getKanban: async (): Promise<{ success: boolean; data: BillKanban }> => {
    const response = await api.get("/legislative/kanban");
    return response.data;
  },

  /**
   * Get statistics
   */
  getStats: async (): Promise<{ success: boolean; data: BillStats }> => {
    const response = await api.get("/legislative/stats");
    return response.data;
  },

  /**
   * Get all bills with pagination
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    sponsor?: string;
  }) => {
    const response = await api.get("/legislative", { params });
    return response.data;
  },

  /**
   * Get bill by ID
   */
  getById: async (id: string) => {
    const response = await api.get(`/legislative/${id}`);
    return response.data;
  },

  /**
   * Get bill by bill number
   */
  getByBillNumber: async (billNumber: string) => {
    const response = await api.get(`/legislative/number/${billNumber}`);
    return response.data;
  },

  /**
   * Create new bill
   */
  create: async (data: any) => {
    const response = await api.post("/legislative", data);
    return response.data;
  },

  /**
   * Update bill
   */
  update: async (id: string, data: any) => {
    const response = await api.patch(`/legislative/${id}`, data);
    return response.data;
  },

  /**
   * Update bill status only
   */
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/legislative/${id}/status`, { status });
    return response.data;
  },

  /**
   * Add timeline event
   */
  addTimelineEvent: async (
    id: string,
    event: { event: string; description: string; type: string }
  ) => {
    const response = await api.post(`/legislative/${id}/timeline`, event);
    return response.data;
  },

  /**
   * Sign bill into law (President only)
   */
  signIntoLaw: async (id: string, remarks?: string) => {
    const response = await api.post(`/legislative/${id}/sign`, { remarks });
    return response.data;
  },

  /**
   * Delete bill
   */
  delete: async (id: string) => {
    const response = await api.delete(`/legislative/${id}`);
    return response.data;
  },
};

export interface Report {
  id: string;
  reference: string;
  title: string;
  summary: string;
  date: string;
  category:
    | "GOVERNANCE"
    | "FINANCE"
    | "PROJECTS"
    | "SERVICE"
    | "POLICY"
    | "RISK"
    | "SECURITY"
    | "PARTNERSHIPS"
    | "ICT";
  period: "WEEKLY" | "MONTHLY" | "QUARTERLY" | "BI_ANNUAL" | "ANNUAL";
  status: "PENDING_REVIEW" | "REVIEWED" | "FLAGGED";
  ministryId: string;
  ministryName: string;
  ministryAcronym: string;
  submittedBy?: string;
  attachments?: any[];
  linkedDirectiveId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ministry {
  id: string;
  acronym: string;
  name: string;
  head: string;
}

export const reportsService = {
  /**
   * Get all reports with pagination and filters
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    period?: string;
    status?: string;
    ministryId?: string;
  }) => {
    const response = await api.get("/reports", { params });
    return response.data;
  },

  /**
   * Get reports by ministry
   */
  getByMinistry: async (ministryId: string) => {
    const response = await api.get(`/reports/ministry/${ministryId}`);
    return response.data;
  },

  /**
   * Get report by ID
   */
  getById: async (id: string) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  /**
   * Get report by reference
   */
  getByReference: async (reference: string) => {
    const response = await api.get(`/reports/reference/${reference}`);
    return response.data;
  },

  /**
   * Get statistics
   */
  getStats: async () => {
    const response = await api.get("/reports/stats");
    return response.data;
  },

  /**
   * Create new report
   */
  create: async (data: any) => {
    const response = await api.post("/reports", data);
    return response.data;
  },

  /**
   * Update report
   */
  update: async (id: string, data: any) => {
    const response = await api.patch(`/reports/${id}`, data);
    return response.data;
  },

  /**
   * Update report status
   */
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/reports/${id}/status`, { status });
    return response.data;
  },

  /**
   * Link report to directive
   */
  linkToDirective: async (id: string, directiveId: string) => {
    const response = await api.post(`/reports/${id}/link/${directiveId}`, {});
    return response.data;
  },

  /**
   * Unlink report from directive
   */
  unlinkFromDirective: async (id: string) => {
    const response = await api.delete(`/reports/${id}/link`);
    return response.data;
  },

  /**
   * Delete report
   */
  delete: async (id: string) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },
};

// Ministries service (if you store them in DB)
export const ministriesService = {
  /**
   * Get all ministries
   */
  getAll: async () => {
    // You could store ministries in DB or keep them as static data
    // For now, return the static list from your component
    const ministries = [
      {
        id: "OPM",
        name: "Office of the Prime Minister",
        head: "Rt. Hon. Prime Minister",
        acronym: "OPM",
      },
      {
        id: "MOFPED",
        name: "Ministry of Finance, Planning and Economic Development",
        head: "Hon. Matia Kasaija",
        acronym: "MOFPED",
      },
      {
        id: "MOH",
        name: "Ministry of Health",
        head: "Hon. Jane Aceng",
        acronym: "MOH",
      },
      {
        id: "MOES",
        name: "Ministry of Education and Sports",
        head: "Hon. Janet Kataaha Museveni",
        acronym: "MOES",
      },
      {
        id: "MAAIF",
        name: "Ministry of Agriculture, Animal Industry and Fisheries",
        head: "Hon. Frank Tumwebaze",
        acronym: "MAAIF",
      },
      {
        id: "MOWT",
        name: "Ministry of Works and Transport",
        head: "Gen. Edward Katumba Wamala",
        acronym: "MOWT",
      },
      {
        id: "MIA",
        name: "Ministry of Internal Affairs",
        head: "Maj. Gen. Kahinda Otafiire",
        acronym: "MIA",
      },
      {
        id: "MOFA",
        name: "Ministry of Foreign Affairs",
        head: "Gen. Jeje Odongo",
        acronym: "MOFA",
      },
      {
        id: "MOJCA",
        name: "Ministry of Justice and Constitutional Affairs",
        head: "Hon. Norbert Mao",
        acronym: "MOJCA",
      },
      {
        id: "MEMD",
        name: "Ministry of Energy and Mineral Development",
        head: "Hon. Ruth Ssentamu Nankabirwa",
        acronym: "MEMD",
      },
      {
        id: "MOLG",
        name: "Ministry of Local Government",
        head: "Hon. Raphael Magyezi",
        acronym: "MOLG",
      },
      {
        id: "MWE",
        name: "Ministry of Water and Environment",
        head: "Hon. Sam Mangusho Cheptoris",
        acronym: "MWE",
      },
      {
        id: "MGLSD",
        name: "Ministry of Gender, Labour and Social Development",
        head: "Hon. Betty Amongi",
        acronym: "MGLSD",
      },
      {
        id: "MLHUD",
        name: "Ministry of Lands, Housing & Urban Development",
        head: "Hon. Judith Nabakooba",
        acronym: "MLHUD",
      },
      {
        id: "MOICT",
        name: "Ministry of ICT & National Guidance",
        head: "Hon. Dr. Chris Baryomunsi",
        acronym: "MOICT",
      },
      {
        id: "MTWA",
        name: "Ministry of Tourism, Wildlife and Antiquities",
        head: "Hon. Tom Butime",
        acronym: "MTWA",
      },
      {
        id: "MODVA",
        name: "Ministry of Defense and Veteran Affairs",
        head: "Hon. Jacob Oboth-Oboth",
        acronym: "MODVA",
      },
      {
        id: "KCCA",
        name: "Ministry of Kampala Capital City and Metropolitan Affairs",
        head: "Hon. Minsa Kabanda",
        acronym: "KCCA",
      },
      {
        id: "MEACA",
        name: "Ministry of East African Community Affairs",
        head: "Rt. Hon. Rebecca Kadaga",
        acronym: "MEACA",
      },
      {
        id: "MOSTI",
        name: "Ministry of Science, Technology & Innovation",
        head: "Hon. Dr. Monica Musenero",
        acronym: "MOSTI",
      },
      {
        id: "MOPS",
        name: "Ministry of Public Service",
        head: "Hon. Muruli Mukasa",
        acronym: "MOPS",
      },
      {
        id: "MOKA",
        name: "Ministry for Karamoja Affairs",
        head: "Hon. Peter Lokeris",
        acronym: "MOKA",
      },
      {
        id: "MODPR",
        name: "Ministry of Disaster Preparedness and Refugees",
        head: "Hon. Hillary Onek",
        acronym: "MODPR",
      },
      {
        id: "MTIC",
        name: "Ministry of Trade, Industry and Cooperatives",
        head: "Hon. Francis Mwebesa",
        acronym: "MTIC",
      },
    ];
    return { success: true, data: ministries };
  },
};

export interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  recipientId: string;
  content: string;
  delivered: boolean;
  read: boolean;
  createdAt: string;
  deliveredAt?: string;
  readAt?: string;
}

export interface Conversation {
  contactId: string;
  contactName: string;
  contactRole: string;
  contactImage?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: "ONLINE" | "OFFLINE" | "AWAY" | "BUSY";
}

export const communicationsService = {
  /**
   * Send a message
   */
  sendMessage: async (recipientId: string, content: string) => {
    const response = await api.post("/communications/messages", {
      recipientId,
      content,
    });
    return response.data;
  },

  /**
   * Get all conversations for current user
   */
  getConversations: async () => {
    const response = await api.get("/communications/conversations");
    return response.data;
  },

  /**
   * Get conversation history with a contact
   */
  getHistory: async (contactId: string, limit: number = 50) => {
    const response = await api.get(`/communications/history/${contactId}`, {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Mark all messages from contact as read
   */
  markAsRead: async (contactId: string) => {
    const response = await api.post(`/communications/read/${contactId}`, {});
    return response.data;
  },
};

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  badgeNumber?: string;
  role: string;
  clearance: string;
  organization: string;
  department?: string;
  avatarUrl?: string;
  facePhotoEnrolled: boolean;
  lastLogin?: string;
  createdAt: string;
}

export const profileService = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<{ success: boolean; data: UserProfile }> => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: {
    fullName?: string;
    email?: string;
    badgeNumber?: string;
    department?: string;
    organization?: string;
  }) => {
    const response = await api.patch("/auth/profile", data);
    return response.data;
  },

  /**
   * Upload avatar
   */
  uploadAvatar: async (avatarBase64: string) => {
    const response = await api.post("/auth/avatar", { avatar: avatarBase64 });
    return response.data;
  },

  /**
   * Remove avatar
   */
  removeAvatar: async () => {
    const response = await api.delete("/auth/avatar");
    return response.data;
  },
};
