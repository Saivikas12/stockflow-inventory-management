import { useState } from 'react';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Boxes } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export default function Auth({ mode }) {

    const signup = mode === 'signup';

    const { login, signup: register } = useAuth();

    const nav = useNavigate();
    const loc = useLocation();

    // Form State
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        organizationName: ''
    });

    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    // Handle Input Changes
    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Handle Form Submission
    const submit = async (e) => {

        e.preventDefault();
        setError('');

        // Validate Password
        if (signup && form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setBusy(true);

        try {

            if (signup) {

                await register({
                    email: form.email,
                    password: form.password,
                    organizationName: form.organizationName
                });

            } else {

                await login({
                    email: form.email,
                    password: form.password
                });
            }

            nav(loc.state?.from || '/');

        } catch (err) {

            setError(
                err.response?.data?.message ||
                'Unable to continue. Check the API connection.'
            );

        } finally {

            setBusy(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#f5f7fb]">

            <form
                onSubmit={submit}
                className="card bg-white p-8 w-full max-w-md"
            >

                {/* Logo */}
                <div className="flex items-center gap-2 font-bold text-2xl mb-2">

                    <Boxes className="text-blue-600" />

                    StockFlow

                </div>

                {/* Heading */}
                <h1 className="text-2xl font-bold mt-6">

                    {signup ? 'Create your account' : 'Welcome back'}

                </h1>

                <p className="muted text-sm mt-1 mb-6">

                    {signup
                        ? 'Start managing your inventory.'
                        : 'Sign in to your inventory workspace.'}

                </p>

                {/* Error Message */}
                {error && (
                    <p className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">
                        {error}
                    </p>
                )}

                {/* Organization Name */}
                {signup && (
                    <label className="block text-sm font-medium mb-4">

                        Organization name

                        <input
                            className="field mt-1"
                            name="organizationName"
                            required
                            value={form.organizationName}
                            onChange={change}
                            placeholder="My Test Store"
                        />

                    </label>
                )}

                {/* Email */}
                <label className="block text-sm font-medium mb-4">

                    Email

                    <input
                        className="field mt-1"
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={change}
                        placeholder="you@example.com"
                    />

                </label>

                {/* Password */}
                <label className="block text-sm font-medium mb-4">

                    Password

                    <input
                        className="field mt-1"
                        type="password"
                        name="password"
                        required
                        minLength="8"
                        value={form.password}
                        onChange={change}
                        placeholder="At least 8 characters"
                    />

                </label>

                {/* Confirm Password */}
                {signup && (
                    <label className="block text-sm font-medium mb-5">

                        Confirm password

                        <input
                            className="field mt-1"
                            type="password"
                            name="confirmPassword"
                            required
                            value={form.confirmPassword}
                            onChange={change}
                        />

                    </label>
                )}

                {/* Submit Button */}
                <button
                    disabled={busy}
                    className="btn btn-primary w-full py-3"
                >

                    {busy
                        ? 'Please wait...'
                        : signup
                            ? 'Create account'
                            : 'Sign in'}

                </button>

                {/* Login / Signup Navigation */}
                <p className="text-center text-sm muted mt-6">

                    {signup
                        ? 'Already have an account?'
                        : 'New to StockFlow?'}

                    {' '}

                    <Link
                        className="text-blue-600 font-semibold"
                        to={signup ? '/login' : '/signup'}
                    >
                        {signup ? 'Sign in' : 'Create account'}
                    </Link>

                </p>

            </form>

        </div>
    );
}