import * as jwt from "jsonwebtoken";

const SECRET = process.env.QUI_SECRET || "house-of-qui-secret_very_hard_to_guess"

export function generateServiceToken(projectId: string) {

  return jwt.sign(
    {
      project: projectId,
      issuer: "house-of-qui"
    },
    SECRET,
    { expiresIn: "7d" }
  )
}

export function verifyServiceToken(token: string) {

  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }

}