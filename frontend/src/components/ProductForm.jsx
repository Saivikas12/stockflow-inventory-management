import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const empty = {
    name: '',
    sku: '',
    description: '',
    quantity: 0,
    costPrice: '',
    sellingPrice: '',
    lowStockThreshold: ''
};

export default function ProductForm({ product, onClose, onSave }) {

    const [form, setForm] = useState(empty);
    const [error, setError] = useState('');

    // Load product data when editing
    useEffect(() => {

        if (product) {
            setForm({
                ...empty,
                ...product,
                costPrice: product.costPrice ?? '',
                sellingPrice: product.sellingPrice ?? '',
                lowStockThreshold: product.lowStockThreshold ?? ''
            });
        } else {
            setForm(empty);
        }

    }, [product]);

    // Handle input changes
    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const submit = async (e) => {

        e.preventDefault();
        setError('');

        try {

            await onSave({
                ...form,
                quantity: Number(form.quantity),

                costPrice: form.costPrice === ''
                    ? null
                    : Number(form.costPrice),

                sellingPrice: form.sellingPrice === ''
                    ? null
                    : Number(form.sellingPrice),

                lowStockThreshold: form.lowStockThreshold === ''
                    ? null
                    : Number(form.lowStockThreshold)
            });

            onClose();

        } catch (err) {

            setError(
                err.response?.data?.message || 'Could not save product'
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">

            <form
                onSubmit={submit}
                className="bg-white rounded-2xl p-6 w-full max-w-xl max-h-[92vh] overflow-y-auto"
            >

                {/* Header */}
                <div className="flex justify-between items-center mb-5">

                    <h2 className="text-xl font-bold">
                        {product ? 'Edit product' : 'Add product'}
                    </h2>

                    <button type="button" onClick={onClose}>
                        <X />
                    </button>

                </div>

                {/* Error Message */}
                {error && (
                    <p className="text-red-600 text-sm mb-3">
                        {error}
                    </p>
                )}

                {/* Product Fields */}
                <div className="grid sm:grid-cols-2 gap-4">

                    {[
                        ['name', 'Product name', true],
                        ['sku', 'SKU', true],
                        ['quantity', 'Quantity on hand', true],
                        ['costPrice', 'Cost price'],
                        ['sellingPrice', 'Selling price'],
                        ['lowStockThreshold', 'Low stock threshold']
                    ].map(([name, label, required]) => (

                        <label
                            key={name}
                            className="text-sm font-medium"
                        >
                            {label}

                            <input
                                className="field mt-1"
                                name={name}
                                type={
                                    name === 'quantity' ||
                                    name.includes('Price') ||
                                    name === 'lowStockThreshold'
                                        ? 'number'
                                        : 'text'
                                }
                                min={
                                    name === 'quantity' ||
                                    name === 'lowStockThreshold' ||
                                    name.includes('Price')
                                        ? '0'
                                        : undefined
                                }
                                step={name.includes('Price') ? '0.01' : '1'}
                                required={!!required}
                                value={form[name]}
                                onChange={change}
                            />
                        </label>

                    ))}

                    {/* Description */}
                    <label className="sm:col-span-2 text-sm font-medium">

                        Description

                        <textarea
                            className="field mt-1"
                            rows="3"
                            name="description"
                            value={form.description || ''}
                            onChange={change}
                        />

                    </label>

                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-2 mt-6">

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button className="btn btn-primary">
                        Save product
                    </button>

                </div>

            </form>

        </div>
    );
}