import { useEffect, useMemo, useState } from 'react';

import {
    Plus,
    Search,
    Edit2,
    Trash2
} from 'lucide-react';

import api from '../services/api';
import ProductForm from '../components/ProductForm';

export default function Products() {

    const [items, setItems] = useState([]);
    const [query, setQuery] = useState('');
    const [editing, setEditing] = useState(undefined);
    const [error, setError] = useState('');
    const [defaultThreshold, setDefaultThreshold] = useState(5);

    // Load Products
    const load = () => {

        return api.get('/products')
            .then(response => setItems(response.data))
            .catch(() => setError('Could not load products'));
    };

    // Fetch Products and Settings
    useEffect(() => {

        load();

        api.get('/settings')
            .then(response => {
                setDefaultThreshold(
                    response.data.defaultLowStockThreshold
                );
            })
            .catch(() => {});

    }, []);

    // Search and Filter Products
    const filtered = useMemo(() => {

        return items.filter(product =>
            (product.name + ' ' + product.sku)
                .toLowerCase()
                .includes(query.toLowerCase())
        );

    }, [items, query]);

    // Save Product (Create or Update)
    const save = async (data) => {

        if (editing) {

            await api.put(`/products/${editing.id}`, data);

        } else {

            await api.post('/products', data);
        }

        await load();
    };

    // Delete Product
    const remove = async (product) => {

        if (!window.confirm(
            `Delete ${product.name}? This cannot be undone.`
        )) {
            return;
        }

        try {

            await api.delete(`/products/${product.id}`);

            load();

        } catch (e) {

            setError(
                e.response?.data?.message || 'Delete failed'
            );
        }
    };

    return (
        <div>

            {/* Page Header */}
            <div className="flex flex-wrap justify-between gap-3 items-start mb-6">

                <div>

                    <h1 className="text-2xl font-bold">
                        Products
                    </h1>

                    <p className="muted mt-1">
                        Manage your products and stock levels.
                    </p>

                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => setEditing(null)}
                >
                    <Plus size={17} />
                    Add product
                </button>

            </div>

            {/* Error Message */}
            {error && (
                <p className="text-red-600 mb-3">
                    {error}
                </p>
            )}

            {/* Products Container */}
            <div className="card">

                {/* Search Bar */}
                <div className="p-4 border-b border-slate-100">

                    <div className="relative max-w-sm">

                        <Search
                            size={17}
                            className="absolute left-3 top-3 muted"
                        />

                        <input
                            className="field pl-9"
                            placeholder="Search by name or SKU..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />

                    </div>

                </div>

                {/* Empty State */}
                {filtered.length === 0 ? (

                    <p className="p-10 text-center muted">

                        {items.length
                            ? 'No matching products.'
                            : 'No products yet. Add your first product.'}

                    </p>

                ) : (

                    /* Products Table */
                    <div className="table-wrap">

                        <table>

                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>SKU</th>
                                    <th>Quantity</th>
                                    <th>Stock status</th>
                                    <th>Selling price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filtered.map(product => {

                                    const low =
                                        product.quantity <=
                                        (product.lowStockThreshold ?? defaultThreshold);

                                    return (
                                        <tr key={product.id}>

                                            {/* Product Details */}
                                            <td>

                                                <div className="font-semibold">
                                                    {product.name}
                                                </div>

                                                {product.description && (
                                                    <div className="muted text-xs max-w-xs truncate">
                                                        {product.description}
                                                    </div>
                                                )}

                                            </td>

                                            {/* SKU */}
                                            <td>
                                                {product.sku}
                                            </td>

                                            {/* Quantity */}
                                            <td className="font-semibold">
                                                {product.quantity}
                                            </td>

                                            {/* Stock Status */}
                                            <td>

                                                <span
                                                    className={`badge ${
                                                        low
                                                            ? 'badge-low'
                                                            : 'badge-ok'
                                                    }`}
                                                >
                                                    {low
                                                        ? 'Low stock'
                                                        : 'In stock'}
                                                </span>

                                            </td>

                                            {/* Selling Price */}
                                            <td>

                                                {product.sellingPrice == null
                                                    ? '—'
                                                    : `₹${Number(product.sellingPrice).toFixed(2)}`}

                                            </td>

                                            {/* Action Buttons */}
                                            <td>

                                                <div className="flex gap-2">

                                                    <button
                                                        title="Edit"
                                                        className="btn btn-secondary !p-2"
                                                        onClick={() => setEditing(product)}
                                                    >
                                                        <Edit2 size={15} />
                                                    </button>

                                                    <button
                                                        title="Delete"
                                                        className="btn btn-danger !p-2"
                                                        onClick={() => remove(product)}
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* Add / Edit Product Modal */}
            {editing !== undefined && (

                <ProductForm
                    product={editing}
                    onClose={() => setEditing(undefined)}
                    onSave={save}
                />

            )}

        </div>
    );
}