
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import Loader from "../components/Loader";

function ProtectedRoute({children}) {
    const { user, loading, authError, getUser } = useContext(UserContext);

    if (loading) {
        return <Loader />;
    }

    if (authError && !user) {
        return (
            <main role="alert">
                <p>{authError}</p>
                <button type="button" onClick={getUser}>Try again</button>
            </main>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
