import { relations } from "drizzle-orm";

import { profiles } from "./profiles";
import { education } from "./education";
import { labMembers } from "./lab-members";
import { faculties, departments, researchCenters } from "./institution";
import { publications, publicationAuthors } from "./publications";
import { publicationLikes, publicationComments, publicationRatings, publicationReviews } from "./publication-engagement";
import { news, events } from "./news";
import { projects, researchDomains, grants, grantReports } from "./projects";
import { equipment, equipmentBookings, maintenanceLogs } from "./equipment";
import { partners, collaborationRequests, collaborationProjects, collaborationMilestones, collaborationIpDisclosures } from "./partners";
import { trainingSessions, trainingEnrollments, trainingAssessments, trainingResults } from "./training";
import { complianceRecords, auditLogs, ethicsApprovals } from "./compliance";
import { notifications, notificationPreferences } from "./notifications";

// ─── Profiles ────────────────────────────────────────────────────────────────

export const profilesRelations = relations(profiles, ({ many, one }) => ({
  education: many(education),
  publicationAuthors: many(publicationAuthors),
  labMembers: many(labMembers),
  notifications: many(notifications),
  notificationPreferences: one(notificationPreferences),
  sentCollaborationRequests: many(collaborationRequests, { relationName: "fromUser" }),
  receivedCollaborationRequests: many(collaborationRequests, { relationName: "toUser" }),
  auditLogs: many(auditLogs),
  facultiesAsDean: many(faculties),
  departmentsAsHod: many(departments),
  researchCentersAsDirector: many(researchCenters),
  projectsAsPi: many(projects),
  ledResearchDomains: many(researchDomains),
  custodiedEquipment: many(equipment),
  technicianMaintenanceLogs: many(maintenanceLogs),
  organizedEvents: many(events),
  authoredNews: many(news),
  equipmentBookings: many(equipmentBookings),
  // Training
  createdTrainingSessions: many(trainingSessions, { relationName: "trainer" }),
  trainingEnrollments: many(trainingEnrollments),
  invitedEnrollments: many(trainingEnrollments, { relationName: "inviter" }),
  gradedResults: many(trainingResults, { relationName: "grader" }),
  // Collaboration
  piCollaborationProjects: many(collaborationProjects, { relationName: "pi" }),
}));

// ─── Education ───────────────────────────────────────────────────────────────

export const educationRelations = relations(education, ({ one }) => ({
  profile: one(profiles, {
    fields: [education.profileId],
    references: [profiles.id],
  }),
}));

// ─── Lab Members ─────────────────────────────────────────────────────────────

export const labMembersRelations = relations(labMembers, ({ one }) => ({
  lab: one(researchCenters, {
    fields: [labMembers.labId],
    references: [researchCenters.id],
  }),
  user: one(profiles, {
    fields: [labMembers.userId],
    references: [profiles.id],
  }),
}));

// ─── Institution Hierarchy ───────────────────────────────────────────────────

export const facultiesRelations = relations(faculties, ({ many, one }) => ({
  departments: many(departments),
  dean: one(profiles, {
    fields: [faculties.deanId],
    references: [profiles.id],
  }),
}));

export const departmentsRelations = relations(departments, ({ many, one }) => ({
  faculty: one(faculties, {
    fields: [departments.facultyId],
    references: [faculties.id],
  }),
  researchCenters: many(researchCenters),
  hod: one(profiles, {
    fields: [departments.hodId],
    references: [profiles.id],
  }),
}));

export const researchCentersRelations = relations(researchCenters, ({ many, one }) => ({
  department: one(departments, {
    fields: [researchCenters.departmentId],
    references: [departments.id],
  }),
  director: one(profiles, {
    fields: [researchCenters.directorId],
    references: [profiles.id],
  }),
  labMembers: many(labMembers),
  complianceRecords: many(complianceRecords),
  projects: many(projects),
  equipment: many(equipment),
  news: many(news),
  events: many(events),
  partners: many(partners),
  researchDomains: many(researchDomains),
  trainingSessions: many(trainingSessions),
  collaborationProjects: many(collaborationProjects),
}));

// ─── Publications ────────────────────────────────────────────────────────────

export const publicationsRelations = relations(publications, ({ many }) => ({
  publicationAuthors: many(publicationAuthors),
  likes: many(publicationLikes),
  comments: many(publicationComments),
  ratings: many(publicationRatings),
  reviews: many(publicationReviews),
}));

export const publicationAuthorsRelations = relations(publicationAuthors, ({ one }) => ({
  publication: one(publications, {
    fields: [publicationAuthors.publicationId],
    references: [publications.id],
  }),
  profile: one(profiles, {
    fields: [publicationAuthors.profileId],
    references: [profiles.id],
  }),
}));

// ─── Publication Engagement ──────────────────────────────────────────────────

export const publicationLikesRelations = relations(publicationLikes, ({ one }) => ({
  publication: one(publications, {
    fields: [publicationLikes.publicationId],
    references: [publications.id],
  }),
  user: one(profiles, {
    fields: [publicationLikes.userId],
    references: [profiles.id],
  }),
}));

export const publicationCommentsRelations = relations(publicationComments, ({ one }) => ({
  publication: one(publications, {
    fields: [publicationComments.publicationId],
    references: [publications.id],
  }),
  user: one(profiles, {
    fields: [publicationComments.userId],
    references: [profiles.id],
  }),
}));

export const publicationRatingsRelations = relations(publicationRatings, ({ one }) => ({
  publication: one(publications, {
    fields: [publicationRatings.publicationId],
    references: [publications.id],
  }),
  user: one(profiles, {
    fields: [publicationRatings.userId],
    references: [profiles.id],
  }),
}));

export const publicationReviewsRelations = relations(publicationReviews, ({ one }) => ({
  publication: one(publications, {
    fields: [publicationReviews.publicationId],
    references: [publications.id],
  }),
  user: one(profiles, {
    fields: [publicationReviews.userId],
    references: [profiles.id],
  }),
}));

// ─── News & Events ───────────────────────────────────────────────────────────

export const newsRelations = relations(news, ({ one }) => ({
  lab: one(researchCenters, {
    fields: [news.labId],
    references: [researchCenters.id],
  }),
  author: one(profiles, {
    fields: [news.authorId],
    references: [profiles.id],
  }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  lab: one(researchCenters, {
    fields: [events.labId],
    references: [researchCenters.id],
  }),
  organizer: one(profiles, {
    fields: [events.organizerId],
    references: [profiles.id],
  }),
}));

// ─── Projects & Research ─────────────────────────────────────────────────────

export const projectsRelations = relations(projects, ({ many, one }) => ({
  lab: one(researchCenters, {
    fields: [projects.labId],
    references: [researchCenters.id],
  }),
  pi: one(profiles, {
    fields: [projects.piId],
    references: [profiles.id],
  }),
  grants: many(grants),
  ethicsApprovals: many(ethicsApprovals),
}));

export const researchDomainsRelations = relations(researchDomains, ({ one }) => ({
  lab: one(researchCenters, {
    fields: [researchDomains.labId],
    references: [researchCenters.id],
  }),
  leadResearcher: one(profiles, {
    fields: [researchDomains.leadResearcherId],
    references: [profiles.id],
  }),
}));

export const grantsRelations = relations(grants, ({ many, one }) => ({
  project: one(projects, {
    fields: [grants.projectId],
    references: [projects.id],
  }),
  grantReports: many(grantReports),
}));

export const grantReportsRelations = relations(grantReports, ({ one }) => ({
  grant: one(grants, {
    fields: [grantReports.grantId],
    references: [grants.id],
  }),
}));

// ─── Equipment & Maintenance ─────────────────────────────────────────────────

export const equipmentRelations = relations(equipment, ({ many, one }) => ({
  lab: one(researchCenters, {
    fields: [equipment.labId],
    references: [researchCenters.id],
  }),
  custodian: one(profiles, {
    fields: [equipment.custodianId],
    references: [profiles.id],
  }),
  bookings: many(equipmentBookings),
  maintenanceLogs: many(maintenanceLogs),
}));

export const equipmentBookingsRelations = relations(equipmentBookings, ({ one }) => ({
  equipment: one(equipment, {
    fields: [equipmentBookings.equipmentId],
    references: [equipment.id],
  }),
  user: one(profiles, {
    fields: [equipmentBookings.userId],
    references: [profiles.id],
  }),
}));

export const maintenanceLogsRelations = relations(maintenanceLogs, ({ one }) => ({
  equipment: one(equipment, {
    fields: [maintenanceLogs.equipmentId],
    references: [equipment.id],
  }),
  technician: one(profiles, {
    fields: [maintenanceLogs.technicianId],
    references: [profiles.id],
  }),
}));

// ─── Partners & Collaboration ────────────────────────────────────────────────

export const partnersRelations = relations(partners, ({ one, many }) => ({
  lab: one(researchCenters, {
    fields: [partners.labId],
    references: [researchCenters.id],
  }),
  collaborationProjects: many(collaborationProjects),
  collaborationRequests: many(collaborationRequests),
}));

export const collaborationRequestsRelations = relations(collaborationRequests, ({ one }) => ({
  fromUser: one(profiles, {
    fields: [collaborationRequests.fromUserId],
    references: [profiles.id],
    relationName: "fromUser",
  }),
  toUser: one(profiles, {
    fields: [collaborationRequests.toUserId],
    references: [profiles.id],
    relationName: "toUser",
  }),
  partner: one(partners, {
    fields: [collaborationRequests.partnerId],
    references: [partners.id],
  }),
}));

export const collaborationProjectsRelations = relations(collaborationProjects, ({ one, many }) => ({
  request: one(collaborationRequests, {
    fields: [collaborationProjects.requestId],
    references: [collaborationRequests.id],
  }),
  lab: one(researchCenters, {
    fields: [collaborationProjects.labId],
    references: [researchCenters.id],
  }),
  partner: one(partners, {
    fields: [collaborationProjects.partnerId],
    references: [partners.id],
  }),
  pi: one(profiles, {
    fields: [collaborationProjects.piId],
    references: [profiles.id],
    relationName: "pi",
  }),
  milestones: many(collaborationMilestones),
  ipDisclosures: many(collaborationIpDisclosures),
}));

export const collaborationMilestonesRelations = relations(collaborationMilestones, ({ one }) => ({
  project: one(collaborationProjects, {
    fields: [collaborationMilestones.projectId],
    references: [collaborationProjects.id],
  }),
}));

export const collaborationIpDisclosuresRelations = relations(collaborationIpDisclosures, ({ one }) => ({
  project: one(collaborationProjects, {
    fields: [collaborationIpDisclosures.projectId],
    references: [collaborationProjects.id],
  }),
}));

// ─── Training ─────────────────────────────────────────────────────────────────

export const trainingSessionsRelations = relations(trainingSessions, ({ one, many }) => ({
  lab: one(researchCenters, {
    fields: [trainingSessions.labId],
    references: [researchCenters.id],
  }),
  creator: one(profiles, {
    fields: [trainingSessions.creatorId],
    references: [profiles.id],
    relationName: "trainer",
  }),
  enrollments: many(trainingEnrollments),
  assessments: many(trainingAssessments),
}));

export const trainingEnrollmentsRelations = relations(trainingEnrollments, ({ one }) => ({
  session: one(trainingSessions, {
    fields: [trainingEnrollments.sessionId],
    references: [trainingSessions.id],
  }),
  user: one(profiles, {
    fields: [trainingEnrollments.userId],
    references: [profiles.id],
  }),
  invitedBy: one(profiles, {
    fields: [trainingEnrollments.invitedBy],
    references: [profiles.id],
    relationName: "inviter",
  }),
}));

export const trainingAssessmentsRelations = relations(trainingAssessments, ({ one, many }) => ({
  session: one(trainingSessions, {
    fields: [trainingAssessments.sessionId],
    references: [trainingSessions.id],
  }),
  results: many(trainingResults),
}));

export const trainingResultsRelations = relations(trainingResults, ({ one }) => ({
  assessment: one(trainingAssessments, {
    fields: [trainingResults.assessmentId],
    references: [trainingAssessments.id],
  }),
  user: one(profiles, {
    fields: [trainingResults.userId],
    references: [profiles.id],
  }),
  grader: one(profiles, {
    fields: [trainingResults.graderId],
    references: [profiles.id],
    relationName: "grader",
  }),
}));

// ─── Compliance & Audit ──────────────────────────────────────────────────────

export const complianceRecordsRelations = relations(complianceRecords, ({ one }) => ({
  lab: one(researchCenters, {
    fields: [complianceRecords.labId],
    references: [researchCenters.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(profiles, {
    fields: [auditLogs.userId],
    references: [profiles.id],
  }),
}));

export const ethicsApprovalsRelations = relations(ethicsApprovals, ({ one }) => ({
  project: one(projects, {
    fields: [ethicsApprovals.projectId],
    references: [projects.id],
  }),
}));

// ─── Notifications ───────────────────────────────────────────────────────────

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(profiles, {
    fields: [notifications.userId],
    references: [profiles.id],
  }),
}));

export const notificationPreferencesRelations = relations(notificationPreferences, ({ one }) => ({
  user: one(profiles, {
    fields: [notificationPreferences.userId],
    references: [profiles.id],
  }),
}));
