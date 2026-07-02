// =============================================================================
// Shared TypeScript Enums
// =============================================================================
// These mirror the Prisma schema enums for use in client-side code.
// The Prisma-generated enums are only available in .server.ts files.
// These are safe to import from any component or utility.
// =============================================================================

/**
 * User roles for RBAC enforcement.
 */
export const Role = {
  CLIENT: "CLIENT",
  ADMIN: "ADMIN",
  ESTIMATOR: "ESTIMATOR",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

/**
 * Project lifecycle states.
 */
export const ProjectStatus = {
  LEAD: "LEAD",
  ESTIMATING: "ESTIMATING",
  ACTIVE: "ACTIVE",
  WARRANTY: "WARRANTY",
  COMPLETED: "COMPLETED",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

/**
 * Types of projects Huestone Homes handles.
 */
export const ProjectType = {
  PAINTING: "PAINTING",
  RESTORATION: "RESTORATION",
  CNC_CARVING: "CNC_CARVING",
} as const;

export type ProjectType = (typeof ProjectType)[keyof typeof ProjectType];

/**
 * Estimate approval workflow states.
 */
export const EstimateStatus = {
  DRAFT: "DRAFT",
  SENT: "SENT",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type EstimateStatus =
  (typeof EstimateStatus)[keyof typeof EstimateStatus];

/**
 * Invoice payment states.
 */
export const InvoiceStatus = {
  UNPAID: "UNPAID",
  PARTIAL: "PARTIAL",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

/**
 * Contract signing states.
 */
export const ContractStatus = {
  PENDING: "PENDING",
  SIGNED: "SIGNED",
} as const;

export type ContractStatus =
  (typeof ContractStatus)[keyof typeof ContractStatus];

/**
 * Change order approval states.
 */
export const ChangeOrderStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type ChangeOrderStatus =
  (typeof ChangeOrderStatus)[keyof typeof ChangeOrderStatus];

/**
 * Line item cost categories.
 */
export const LineItemCategory = {
  MATERIALS: "MATERIALS",
  LABOR: "LABOR",
  CNC_MACHINE_TIME: "CNC_MACHINE_TIME",
  EQUIPMENT: "EQUIPMENT",
  SUBCONTRACTOR: "SUBCONTRACTOR",
  PERMITS: "PERMITS",
  OVERHEAD: "OVERHEAD",
} as const;

export type LineItemCategory =
  (typeof LineItemCategory)[keyof typeof LineItemCategory];
