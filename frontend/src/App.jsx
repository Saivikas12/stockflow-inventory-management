import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation
} from 'react-router-dom';

import {
    AuthProvider,
    useAuth
} from './context/AuthContext';

import Shell from './components/Shell';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Settings from './pages/Settings';

// Protected Routes
function Protected() {

    const { user } = useAuth();
    const location = useLocation();

    return user ? (

        <Shell />

    ) : (

        <Navigate
            to="/login"
            replace
            state={{ from: location.pathname }}
        />

    );
}

// Guest Routes
function Guest({ mode }) {

    const { user } = useAuth();

    return user ? (

        <Navigate
            to="/"
            replace
        />

    ) : (

        <Auth mode={mode} />

    );
}

// Application Routes
function RoutesView() {

    return (
        <Routes>

            {/* Login Page */}
            <Route
                path="/login"
                element={<Guest mode="login" />}
            />

            {/* Signup Page */}
            <Route
                path="/signup"
                element={<Guest mode="signup" />}
            />

            {/* Protected Application Routes */}
            <Route element={<Protected />}>

                <Route
                    index
                    element={<Dashboard />}
                />

                <Route
                    path="products"
                    element={<Products />}
                />

                <Route
                    path="settings"
                    element={<Settings />}
                />

            </Route>

            {/* Fallback Route */}
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>
    );
}

// Main Application Component
export default function App() {

    return (
        <AuthProvider>

            <BrowserRouter>

                <RoutesView />

            </BrowserRouter>

        </AuthProvider>
    );
}