import userRoles from "./userRoles";

// Create a role-based redirect object using the enums
const roleBasedRedirect = Object.freeze({
  [userRoles.DIRECTOR]: "/director/dashboard",
  [userRoles.DEPUTY_DIRECTOR]: "/dd/dashboard",
  [userRoles.PRODUCT_MANAGER]: "/pm/dashboard",
  [userRoles.FIELD_FORCE_MANAGER]: "/ff/dashboard",
  [userRoles.REGIONAL_MANAGER]: "/rm/dashboard",
  [userRoles.MEDICAL_REPRESENTATIVE]: "/mr/dashboard",
});

export default roleBasedRedirect;
