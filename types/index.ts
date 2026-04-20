export type Category =
  | "Security"
  | "Identity & Access"
  | "Cloud & Infrastructure"
  | "Data"
  | "Applications"
  | "Network"
  | "Business Operations"

export type ServiceType = "Platform" | "Program" | "Consulting"
export type IntakeMethod = "ServiceNow" | "Email" | "Form"

export interface ServiceFeature {
  name: string
  description: string
}

export interface ServiceSLA {
  availability: string
  responseTime: string
  resolutionTime: string
  supportHours: string
}

export interface ServiceOwner {
  name: string
  email: string
}

export interface ServiceContact {
  email: string
  team: string
}

export interface Service {
  id: string
  name: string
  category: Category
  tags: string[]
  serviceType: ServiceType
  icon: string
  owner: ServiceOwner
  summary: string
  features: ServiceFeature[]
  sla: ServiceSLA
  contact: ServiceContact
  intakeMethod: IntakeMethod
  lastUpdated: string
}
