import { OAuth2Client } from 'google-auth-library'

export const createOAuthClient = (redirectUri?: string) =>
  new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, redirectUri)
