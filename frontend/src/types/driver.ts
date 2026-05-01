import { ContractType } from './rwa'

export type KYCStatus = 'not_started' | 'pending' | 'verified' | 'rejected'

export interface DriverProfile {
  id: string
  phone: string
  fullName: string
  ktpNumber: string
  simNumber: string
  kycStatus: KYCStatus
  assignedVehicleId?: string
  assignedVehicleUnitId?: string
  contractType: ContractType
  flatFeeDaily: number
  operatorId: string
  joinedAt: string
}

export interface DriverDailyStatus {
  driverId: string
  date: string
  gpsActive: boolean
  gpsActiveMinutes: number
  flatFeePaid: boolean
  flatFeeAmount: number
  kmToday: number
  routeLogCount: number
  activeHours: number
  movementSegments: number
}

export interface DriverScheduleEntry {
  date: string
  startTime: string
  endTime: string
  zone: string
  vehicleUnitId: string
  notes?: string
}

export interface KYCDocument {
  type: 'ktp' | 'sim' | 'selfie'
  label: string
  status: KYCStatus
  uploadedAt?: string
  fileUrl?: string
  rejectionReason?: string
}

export interface ServiceReminder {
  vehicleUnitId: string
  kmUntilService: number
  serviceType: string
  urgency: 'ok' | 'soon' | 'overdue'
}
