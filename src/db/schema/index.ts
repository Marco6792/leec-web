// ─── Profiles & Auth ─────────────────────────────────────────────────────
export { profiles } from "./profiles";

// ─── Education ──────────────────────────────────────────────────────────
export { education } from "./education";

// ─── Lab Members (multitenancy junction) ─────────────────────────────────
export {
  labMembers,
  authUsers,
  labRoleEnum,
  memberStatusEnum,
} from "./lab-members";

// ─── Institution Hierarchy ──────────────────────────────────────────────
export { faculties, departments, researchCenters } from "./institution";

// ─── Publications ────────────────────────────────────────────────────────
export { publications, publicationAuthors, publicationTypeEnum } from "./publications";

// ─── News & Events ──────────────────────────────────────────────────────
export { news, events, eventTypeEnum } from "./news";

// ─── Projects & Research ────────────────────────────────────────────────
export {
  projects,
  researchDomains,
  grants,
  grantReports,
  projectStatusEnum,
  grantStatusEnum,
} from "./projects";

// ─── Equipment & Maintenance ────────────────────────────────────────────
export {
  equipment,
  equipmentBookings,
  maintenanceLogs,
  equipmentCategoryEnum,
  equipmentStatusEnum,
  bookingStatusEnum,
  maintenanceTypeEnum,
} from "./equipment";

// ─── Training & Assessments ────────────────────────────────────────────
export {
  trainingSessions,
  trainingEnrollments,
  trainingAssessments,
  trainingResults,
  trainingSessionStatusEnum,
  trainingLevelEnum,
  enrollmentStatusEnum,
  assessmentTypeEnum,
} from "./training";

// ─── Partners & Collaboration ───────────────────────────────────────────
export {
  partners,
  collaborationRequests,
  collaborationProjects,
  collaborationMilestones,
  collaborationIpDisclosures,
  partnerTypeEnum,
  partnerTierEnum,
  requestStatusEnum,
  requestTypeEnum,
  collaborationProjectStatusEnum,
  agreementTypeEnum,
  ipStatusEnum,
  ipTypeEnum,
  milestoneStatusEnum,
} from "./partners";

// ─── Compliance & Audit ──────────────────────────────────────────────────
export {
  complianceRecords,
  auditLogs,
  ethicsApprovals,
  complianceTypeEnum,
  complianceStatusEnum,
  auditActionEnum,
  ethicsTypeEnum,
  ethicsStatusEnum,
} from "./compliance";

// ─── Publication Engagement ────────────────────────────────────────────────
export {
  publicationLikes,
  publicationComments,
  publicationRatings,
  publicationReviews,
} from "./publication-engagement";

// ─── Notifications ──────────────────────────────────────────────────────
export {
  notifications,
  notificationPreferences,
  notificationTypeEnum,
  notificationChannelEnum,
} from "./notifications";

// ─── Relations ──────────────────────────────────────────────────────────────
export * from "./relations";

