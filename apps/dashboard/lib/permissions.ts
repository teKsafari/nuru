import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

export async function requirePermission(requiredScope?: string) {
	const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

	if (!isAuthenticated || !claims) {
		throw new Error("Unauthorized: Please sign in");
	}

	// If no specific scope is required, just return the claims
	if (!requiredScope) {
		return claims;
	}

	// Check if user has the required scope or is a Super Admin
	const hasRequiredScope = claims.roles?.includes(requiredScope) || claims.roles?.includes('Super Admin');
    
    // In Logto Next.js, actual scopes requested might be accessible, but relying on roles mapped to permissions is safer
    // given our AuthSession type. Let's map required permissions to Roles.
    // If we use the exact role names from the Markdown:
    // "Super Admin", "Educator", "Learner"
    
    // For now, if the requiredScope is something like "create:lesson", we check if they are an Educator or Super Admin
    let isAuthorized = false;
    
    if (claims.roles?.includes('Super Admin')) {
        isAuthorized = true;
    } else if (requiredScope === 'create:lesson' || requiredScope === 'edit:own_lesson' || requiredScope === 'delete:own_lesson' || requiredScope === 'publish:marketplace') {
        if (claims.roles?.includes('Educator')) {
            isAuthorized = true;
        }
    }

	if (!isAuthorized) {
		throw new Error(`Forbidden: Missing required permission/role for action`);
	}

	return claims;
}

export function verifyOwnership(resourceOwnerId: string, currentUserSub: string, roles?: string[]) {
    if (roles?.includes('Super Admin')) {
        return true;
    }

    if (resourceOwnerId !== currentUserSub) {
        throw new Error("Forbidden: You do not own this resource");
    }

    return true;
}
