export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  REFRESH_TOKEN: '/auth/refresh',

  // KYC
  KYC_LIST: '/kyc-review/list',
  KYC_DETAIL: (id: string) => `/kyc-review/${id}`,
  KYC_APPROVE: () => `/kyc-review/approve`,
  KYC_REJECT: () => `/kyc-review/reject`,

  // Users
  USERS_LIST: '/users',
  USER_DETAIL: (id: string) => `/users/${id}`,

  // Employers
  EMPLOYERS_LIST: '/employers',
  EMPLOYER_DETAIL: (id: string) => `/employers/${id}`,
  EMPLOYER_FLAG: (id: string) => `/employers/${id}/flag`,

  // Jobs
  JOBS_LIST: '/jobs',
  JOB_DETAIL: (id: string) => `/jobs/${id}`,

  // Jobs-scraper
  SCRAPER_JOBS: '/scraper/jobs',
  SCRAPER_JOB_DETAIL: (id: string) => `/scraper/jobs/${id}`,
  SCRAPER_JOBS_BULK: '/scraper/jobs/bulk',
  SCRAPER_JOB_GENERATE: '/scraper/jobs/generate',
  
  
  // Dashboard
  DASHBOARD_OVERVIEW: '/dashboard/overview',
  DASHBOARD_RECENT_ACTIVITY: '/dashboard/recent-activity',
  DASHBOARD_USER_GROWTH: '/dashboard/user-growth',
  DASHBOARD_JOB_STATISTICS: '/dashboard/job-statistics',
  DASHBOARD_APPLICATION_FUNNEL: '/dashboard/application-funnel',
  DASHBOARD_TOP_EMPLOYERS: '/dashboard/top-employers',
  DASHBOARD_PENDING_REVIEWS: '/dashboard/pending-reviews',

  // 🧩 Skills
  META_SKILLS_LIST: '/meta/skills',
  META_SKILL_CREATE: '/meta/skills',
  META_SKILL_UPDATE: (id: string) => `/meta/skills/${id}`,
  META_SKILL_DELETE: (id: string) => `/meta/skills/${id}`,

  // 🧩 Certifications
  META_CERTIFICATIONS_LIST: '/meta/certifications',
  META_CERTIFICATION_CREATE: '/meta/certifications',
  META_CERTIFICATION_UPDATE: (id: string) => `/meta/certifications/${id}`,
  META_CERTIFICATION_DELETE: (id: string) => `/meta/certifications/${id}`,

  // 🧩 Roles
  META_ROLES_LIST: '/meta/roles',
  META_ROLE_CREATE: '/meta/roles',
  META_ROLE_UPDATE: (id: string) => `/meta/roles/${id}`,
  META_ROLE_DELETE: (id: string) => `/meta/roles/${id}`,

  // 🧩 Job Categories
  META_JOB_CATEGORIES_LIST: '/meta/job-categories',
  META_JOB_CATEGORY_CREATE: '/meta/job-categories',
  META_JOB_CATEGORY_UPDATE: (id: string) => `/meta/job-categories/${id}`,
  META_JOB_CATEGORY_DELETE: (id: string) => `/meta/job-categories/${id}`,

};