
import React, { useState } from 'react';
import type { Product } from '../types';

interface ProductManagerProps {
    products: Product[];
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (productId: number) => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

    // State for delete confirmation modal
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const openAddModal = () => {
        setEditingProduct(null);
        setProductName('');
        setProductPrice('');
        setErrors({});
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setProductName(product.name);
        setProductPrice(String(product.price));
        setErrors({});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };
    
    const validateProductForm = () => {
        const newErrors: { name?: string; price?: string } = {};
        const price = parseFloat(productPrice);

        if (!productName.trim()) {
            newErrors.name = "اسم المنتج مطلوب.";
        }

        if (!productPrice.trim()) {
            newErrors.price = "السعر مطلوب.";
        } else if (isNaN(price) || price <= 0) {
            newErrors.price = "يرجى إدخال سعر صحيح أكبر من صفر.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateProductForm()) {
            return;
        }

        const price = parseFloat(productPrice);
        if (editingProduct) {
            onUpdateProduct({ ...editingProduct, name: productName, price });
        } else {
            onAddProduct({ name: productName, price });
        }
        closeModal();
    };

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            onDeleteProduct(productToDelete.id);
            setIsDeleteConfirmOpen(false);
            setProductToDelete(null);
        }
    };
    
    const cancelDelete = () => {
        setIsDeleteConfirmOpen(false);
        setProductToDelete(null);
    };

    const AddEditModal = () => (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={closeModal}>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                    {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
                        <input
                            type="text"
                            id="product-name"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                            required
                        />
                        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-1">السعر / كجم (ج.م)</label>
                        <input
                            type="number"
                            id="product-price"
                            value={productPrice}
                            min="0"
                            step="any"
                            onChange={(e) => setProductPrice(e.target.value)}
                            className={`w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                            required
                        />
                         {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
                    </div>
                    <div className="flex justify-end space-x-4 space-x-reverse pt-4">
                        <button type="button" onClick={closeModal} className="px-6 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition">
                            إلغاء
                        </button>
                        <button type="submit" className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition font-semibold">
                            حفظ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    const ConfirmationModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={cancelDelete}>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4 text-center animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-lg leading-6 font-bold text-gray-900">تأكيد الحذف</h3>
                <div className="mt-2 px-4 py-3">
                    <p className="text-sm text-gray-600">
                        هل أنت متأكد أنك تريد حذف المنتج "{productToDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.
                    </p>
                </div>
                <div className="flex justify-center space-x-4 space-x-reverse mt-4">
                    <button
                        onClick={cancelDelete}
                        className="px-6 py-2 bg-gray-100 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        إلغاء
                    </button>
                     <button
                        onClick={confirmDelete}
                        className="px-6 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        حذف
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
             <header className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">🥩 إدارة المنتجات</h1>
                        <p className="text-slate-500 mt-1">إضافة، تعديل، وحذف المنتجات المعروضة للعملاء.</p>
                    </div>
                    <button onClick={openAddModal} className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        إضافة منتج
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">اسم المنتج</th>
                                <th scope="col" className="px-6 py-3">السعر / كجم</th>
                                <th scope="col" className="px-6 py-3 text-center">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{product.name}</td>
                                    <td className="px-6 py-4 font-semibold">{product.price.toLocaleString()} ج.م</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => openEditModal(product)} className="font-medium text-blue-600 hover:underline mx-2">تعديل</button>
                                        <button onClick={() => handleDeleteClick(product)} className="font-medium text-red-600 hover:underline mx-2">حذف</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             {products.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100 mt-4">
                    <p className="text-gray-500">لم يتم إضافة أي منتجات حتى الآن.</p>
                </div>
            )}
            {isModalOpen && <AddEditModal />}
            {isDeleteConfirmOpen && <ConfirmationModal />}
        </div>
    );
};

export default ProductManager;
