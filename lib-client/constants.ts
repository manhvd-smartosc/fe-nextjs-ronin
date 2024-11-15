export const Routes = {
  API: {
    TOKENS: '/api/tokens/',
    PROFILE: '/api/profile/',
    SESSION: '/api/auth/session/',
    COMMENT: '/api/comment/',
  },
  STATIC: {
    // repeated in folder structure, static folder, seed
    // docker volumes prod, Dockerfile.prod, gitignore
    // Routes.STATIC.AVATARS, Routes.STATIC.HEADERS - constants, not env vars
    IMAGES: '/uploads/images/',
    TOKENS: '/uploads/tokens/',
  },
} as const;
