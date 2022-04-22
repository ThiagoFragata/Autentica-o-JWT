import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { validateUsersPermissions } from "../utils/validateUsersPermissions";

interface UseCanParams {
  permissions?: string[];
  roles?: string[];
}

export function useCan({ permissions = [], roles = [] }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidPermissions = validateUsersPermissions({
    user,
    permissions,
    roles,
  });

  return userHasValidPermissions;
}
