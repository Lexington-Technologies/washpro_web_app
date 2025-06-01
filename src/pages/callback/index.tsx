import { useEffect, useState } from "react";
import { UserManager, User as OidcUser } from "oidc-client-ts";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Alert, CircularProgress, Card, CardContent } from "@mui/material";
import { CheckCircle, Error as ErrorIcon, Refresh } from "@mui/icons-material";
import { useAuthStore } from "../../store";

type Props = {
    authenticated: boolean | null;
    userManager: UserManager;
    handleLogout: any;
};

const Callback = ({}: Props) => {
    const navigate = useNavigate();
    const { zitadel, isAuthenticated, setAuthenticated, setUser, user, setToken } = useAuthStore();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Helper function to transform OIDC user profile to app User type
    const transformOidcUser = (oidcProfile: any) => {
        return {
            id: oidcProfile.sub || oidcProfile.id || "",
            name: oidcProfile.name || oidcProfile.given_name || oidcProfile.family_name || "Unknown User",
            email: oidcProfile.email || "",
            roles: oidcProfile["urn:zitadel:iam:org:project:roles"] 
                ? Object.keys(oidcProfile["urn:zitadel:iam:org:project:roles"]) 
                : [],
            emailVerified: oidcProfile.email_verified || false,
        };
    };

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleAuthentication = async () => {
            if (!zitadel?.userManager) {
                setError("Authentication service not initialized");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                // First try to handle the signin redirect callback
                const userobj = await zitadel.userManager.signinRedirectCallback();
                
                if (userobj) {
                    console.log('user in signinRedirectCallback', userobj);
                    const transformedUser = transformOidcUser(userobj.profile);
                    
                    setAuthenticated(true);
                    setUser(transformedUser);
                    setToken(userobj.access_token, userobj.refresh_token || "");
                    
                    // Set a timeout to navigate to root after showing success message
                    timeoutId = setTimeout(() => {
                        navigate("/", { replace: true });
                    }, 2000);
                } else {
                    throw new Error("No user information received from authentication provider");
                }
            } catch (error: any) {
                console.error('Error in authentication callback:', error);
                
                // If the callback fails, try to get existing user
                try {
                    const existingUser = await zitadel?.userManager.getUser();
                    if (existingUser) {
                        console.log('Found existing user:', existingUser);
                        const transformedUser = transformOidcUser(existingUser.profile);
                        
                        setAuthenticated(true);
                        setUser(transformedUser);
                        
                        // Navigate to root after short delay
                        timeoutId = setTimeout(() => {
                            navigate("/", { replace: true });
                        }, 1500);
                    } else {
                        setError("Authentication failed. Please try again.");
                        setAuthenticated(false);
                    }
                } catch (secondError: any) {
                    console.error('Error getting existing user:', secondError);
                    setError("Authentication failed. Please try again.");
                    setAuthenticated(false);
                }
            } finally {
                setIsLoading(false);
            }
        };

        // Only run authentication if not already authenticated
        if (isAuthenticated !== true && zitadel) {
            handleAuthentication();
        } else if (isAuthenticated === true && user) {
            // Already authenticated, navigate to root
            navigate("/", { replace: true });
        }

        // Cleanup timeout on unmount
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isAuthenticated, zitadel, setAuthenticated, setUser, setToken, navigate, user]);

    const handleRetry = () => {
        setError(null);
        setIsLoading(true);
        // Force redirect to login
        navigate("/login", { replace: true });
    };

    const handleGoHome = () => {
        navigate("/", { replace: true });
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    bgcolor: "#f5f5f5",
                    px: 2,
                }}
            >
                <Card sx={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
                    <CardContent sx={{ py: 4 }}>
                        <CircularProgress size={60} sx={{ mb: 3, color: "#25306B" }} />
                        <Typography variant="h6" gutterBottom>
                            Completing Authentication
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Please wait while we verify your credentials...
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    bgcolor: "#f5f5f5",
                    px: 2,
                }}
            >
                <Card sx={{ maxWidth: 400, width: "100%", textAlign: "center" }}>
                    <CardContent sx={{ py: 4 }}>
                        <ErrorIcon sx={{ fontSize: 60, color: "#ef4444", mb: 2 }} />
                        <Typography variant="h6" gutterBottom color="error">
                            Authentication Failed
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            {error}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                            <Button
                                variant="contained"
                                startIcon={<Refresh />}
                                onClick={handleRetry}
                                sx={{
                                    bgcolor: "#25306B",
                                    "&:hover": { bgcolor: "#1a1f4b" },
                                }}
                            >
                                Try Again
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleGoHome}
                                sx={{
                                    color: "#25306B",
                                    borderColor: "#25306B",
                                    "&:hover": {
                                        borderColor: "#1a1f4b",
                                        bgcolor: "rgba(37, 48, 107, 0.04)",
                                    },
                                }}
                            >
                                Go Home
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    if (isAuthenticated === true && user) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    bgcolor: "#f5f5f5",
                    px: 2,
                }}
            >
                <Card sx={{ maxWidth: 500, width: "100%", textAlign: "center" }}>
                    <CardContent sx={{ py: 4 }}>
                        <CheckCircle sx={{ fontSize: 60, color: "#10b981", mb: 2 }} />
                        <Typography variant="h5" gutterBottom sx={{ color: "#1e293b" }}>
                            Welcome, {user.name}!
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Authentication successful. Redirecting to dashboard...
                        </Typography>
                        
                        <Alert severity="success" sx={{ mb: 3, textAlign: "left" }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Profile Information:
                            </Typography>
                            <Typography variant="body2">Name: {user.name}</Typography>
                            <Typography variant="body2">Email: {user.email}</Typography>
                            <Typography variant="body2">
                                Email Verified: {user.emailVerified ? "Yes" : "No"}
                            </Typography>
                            {user.roles.length > 0 && (
                                <Typography variant="body2">
                                    Roles: {user.roles.join(", ")}
                                </Typography>
                            )}
                        </Alert>

                        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                            <Button
                                variant="contained"
                                onClick={handleGoHome}
                                sx={{
                                    bgcolor: "#25306B",
                                    "&:hover": { bgcolor: "#1a1f4b" },
                                }}
                            >
                                Go to Dashboard
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    zitadel?.signout();
                                }}
                                sx={{
                                    color: "#25306B",
                                    borderColor: "#25306B",
                                    "&:hover": {
                                        borderColor: "#1a1f4b",
                                        bgcolor: "rgba(37, 48, 107, 0.04)",
                                    },
                                }}
                            >
                                Log out
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    // Fallback loading state
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                bgcolor: "#f5f5f5",
            }}
        >
            <CircularProgress size={60} sx={{ color: "#25306B" }} />
        </Box>
    );
};

export default Callback;