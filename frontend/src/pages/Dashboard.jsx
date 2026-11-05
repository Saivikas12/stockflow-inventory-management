import { useEffect, useState } from 'react';

import {
    Package,
    Boxes,
    AlertTriangle,
    ArrowUpRight
} from 'lucide-react';

import { Link } from 'react-router-dom';

import api from '../services/api';

export default function Dashboard() {

    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    // Fetch Dashboard Data
    useEffect(() => {

        api.get('/dashboard')
            .then(response => setData(response.data))
            .catch(() => setError('Could not load dashboard'));

    }, []);

    // Error Handling
    if (error) {
        return (
            <p className="text-red-600">
                {error}
            </p>
        );
    }

    // Loading State
    if (!data) {
        return (
            <p className="muted">
                Loading dashboard...
            </p>
        );
    }

    // Dashboard Statistics
    const stats = [
        ['Total products', data.totalProducts, Package],
        ['Units in stock', data.totalQuantity, Boxes],
        ['Low stock items', data.lowStockItems.length, AlertTriangle]
    ];

    return (
        <div>

            {/* Dashboard Header */}
            <div className="flex justify-between items-start mb-7">

                <div>

                    <h1 className="text-2xl font-bold">
                        Dashboard
                    </h1>

                    <p className="muted mt-1">
                        Here's what's happening with your inventory.
                    </p>

                </div>

                <Link
                    className="btn btn-primary"
                    to="/products"
                >
                    Manage products
                    <ArrowUpRight size={16} />
                </Link>

            </div>

            {/* Statistics Cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-7">

                {stats.map(([label, value, Icon]) => (

                    <div
                        className="card p-5"
                        key={label}
                    >

                        <div className="flex justify-between text-sm muted">

                            <span>{label}</span>

                            <Icon size={19} />

                        </div>

                        <div className="text-3xl font-bold mt-4">
                            {value}
                        </div>

                    </div>

                ))}

            </div>

            {/* Low Stock Section */}
            <section className="card">

                <div className="p-5 border-b border-slate-100 flex justify-between">

                    <div>

                        <h2 className="font-bold">
                            Low stock items
                        </h2>

                        <p className="muted text-sm mt-1">
                            Products at or below their stock threshold
                        </p>

                    </div>

                    <span className="badge badge-low">
                        {data.lowStockItems.length} items
                    </span>

                </div>

                {/* Empty State */}
                {data.lowStockItems.length === 0 ? (

                    <p className="p-8 text-center muted">
                        All products are above their low-stock thresholds.
                    </p>

                ) : (

                    /* Low Stock Table */
                    <div className="table-wrap">

                        <table>

                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>SKU</th>
                                    <th>Quantity</th>
                                    <th>Threshold</th>
                                </tr>
                            </thead>

                            <tbody>

                                {data.lowStockItems.map(p => (

                                    <tr key={p.id}>

                                        <td className="font-semibold">
                                            {p.name}
                                        </td>

                                        <td>
                                            {p.sku}
                                        </td>

                                        <td>
                                            <span className="badge badge-low">
                                                {p.quantity}
                                            </span>
                                        </td>

                                        <td>
                                            {p.lowStockThreshold ??
                                                data.defaultLowStockThreshold}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </div>
    );
}