import { jwtDecode } from 'jwt-decode'

interface GoogleIdTokenPayload {
  name: string
  email: string
  picture: string
  email_verified: boolean
}

export const getUsrFrmIdTkn = (idToken: string) => {
  const decoded = jwtDecode<GoogleIdTokenPayload>(idToken)

  return {
    name: decoded.name,
    email: decoded.email,
    profilePic: decoded.picture
  }
}
