export const HOUSE_IDENTITY = {
  house: "House of Qui",
  system: "Qui Core",
  codename: "Xia",
  version: "0.1.0",
  stage: "foundation"
}

export function getSystemIdentity() {
  return `${HOUSE_IDENTITY.system} • ${HOUSE_IDENTITY.house}`
}