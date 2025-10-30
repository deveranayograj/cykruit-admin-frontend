export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/admin/auth/login',
  LOGOUT: '/admin/auth/logout',
  PROFILE: '/admin/auth/profile',
  REFRESH_TOKEN: '/admin/auth/refresh',

  // KYC
  KYC_LIST: '/admin/kyc-review/list',
  KYC_DETAIL: (id: string) => `/admin/kyc-review/${id}`,
  KYC_APPROVE: () => `/admin/kyc-review/approve`,
  KYC_REJECT: () => `/admin/kyc-review/reject`,

  // Users
  USERS_LIST: '/admin/users',
  USER_DETAIL: (id: string) => `/admin/users/${id}`,

  // Employers
  EMPLOYERS_LIST: '/admin/employers',
  EMPLOYER_DETAIL: (id: string) => `/admin/employers/${id}`,
  EMPLOYER_FLAG: (id: string) => `/admin/employers/${id}/flag`,

  // Jobs
  JOBS_LIST: '/admin/jobs',
  JOB_DETAIL: (id: string) => `/admin/jobs/${id}`,
  JOB_APPROVE: (id: string) => `/admin/jobs/${id}/approve`,
  JOB_REJECT: (id: string) => `/admin/jobs/${id}/reject`,

  // Dashboard
  DASHBOARD_OVERVIEW: '/admin/dashboard/overview',
  DASHBOARD_RECENT_ACTIVITY: '/admin/dashboard/recent-activity',
  DASHBOARD_USER_GROWTH: '/admin/dashboard/user-growth',
  DASHBOARD_JOB_STATISTICS: '/admin/dashboard/job-statistics',
  DASHBOARD_APPLICATION_FUNNEL: '/admin/dashboard/application-funnel',
  DASHBOARD_TOP_EMPLOYERS: '/admin/dashboard/top-employers',
  DASHBOARD_PENDING_REVIEWS: '/admin/dashboard/pending-reviews',

  // 🧩 Skills
  META_SKILLS_LIST: '/admin/meta/skills',
  META_SKILL_CREATE: '/admin/meta/skills',
  META_SKILL_UPDATE: (id: string) => `/admin/meta/skills/${id}`,
  META_SKILL_DELETE: (id: string) => `/admin/meta/skills/${id}`,

  // 🧩 Certifications
  META_CERTIFICATIONS_LIST: '/admin/meta/certifications',
  META_CERTIFICATION_CREATE: '/admin/meta/certifications',
  META_CERTIFICATION_UPDATE: (id: string) => `/admin/meta/certifications/${id}`,
  META_CERTIFICATION_DELETE: (id: string) => `/admin/meta/certifications/${id}`,

  // 🧩 Roles
  META_ROLES_LIST: '/admin/meta/roles',
  META_ROLE_CREATE: '/admin/meta/roles',
  META_ROLE_UPDATE: (id: string) => `/admin/meta/roles/${id}`,
  META_ROLE_DELETE: (id: string) => `/admin/meta/roles/${id}`,

  // 🧩 Job Categories
  META_JOB_CATEGORIES_LIST: '/admin/meta/job-categories',
  META_JOB_CATEGORY_CREATE: '/admin/meta/job-categories',
  META_JOB_CATEGORY_UPDATE: (id: string) => `/admin/meta/job-categories/${id}`,
  META_JOB_CATEGORY_DELETE: (id: string) => `/admin/meta/job-categories/${id}`,

};