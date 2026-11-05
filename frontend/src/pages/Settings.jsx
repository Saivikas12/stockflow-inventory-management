import { useEffect, useState } from 'react';

import api from '../services/api';

export default function Settings() {

    const [value, setValue] = useState(5);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch Existing Settings
    useEffect(() => {

        api.get('/settings')
            .then(response => {
                setValue(response.data.defaultLowStockThreshold);
            });

    }, []);

    // Save Settings
    const save = async (e) => {

        e.preventDefault();

        setMessage('');
        setError('');

        try {

            const response = await api.put('/settings', {
                defaultLowStockThreshold: Number(value)
            });

            setValue(response.data.defaultLowStockThreshold);

            setMessage('Settings saved successfully.');

        } catch (e) {

            setError(
                e.response?.data?.message ||
                'Could not save settings'
            );
        }
    };

    return (
        <div>

            {/* Page Header */}
            <h1 className="text-2xl font-bold">
                Settings
            </h1>

            <p className="muted mt-1 mb-6">
                Configure your inventory defaults.
            </p>

            {/* Settings Form */}
            <form
                onSubmit={save}
                className="card p-6 max-w-xl"
            >

                <h2 className="font-bold">
                    Inventory settings
                </h2>

                {/* Low Stock Threshold */}
                <label className="block text-sm font-medium mt-5">

                    Default low-stock threshold

                    <p className="muted font-normal mt-1 mb-2">
                        Used when a product does not have its own threshold.
                    </p>

                    <input
                        className="field max-w-xs"
                        type="number"
                        min="0"
                        required
                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />

                </label>

                {/* Success Message */}
                {message && (
                    <p className="text-green-700 text-sm mt-3">
                        {message}
                    </p>
                )}

                {/* Error Message */}
                {error && (
                    <p className="text-red-600 text-sm mt-3">
                        {error}
                    </p>
                )}

                {/* Save Button */}
                <button className="btn btn-primary mt-5">
                    Save settings
                </button>

            </form>

        </div>
    );
}