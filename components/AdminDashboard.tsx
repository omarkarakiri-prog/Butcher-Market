
import React, { useState } from 'react';
import type { Order, Product } from '../types';
import ProductManager from './ProductManager';

interface AdminDashboardProps {
    orders: Order[];
    products: Product[];
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (productId: number) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
    const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Ready': return 'bg-blue-100 text-blue-800';
            case 'Preparing': return 'bg-yellow-100 text-yellow-800';
            case 'Confirmed': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
     const statusTranslations: { [key: string]: string } = {
        'Delivered': 'تم التوصيل',
        'Ready': 'جاهز للتوصيل',
        'Preparing': 'جاري التحضير',
        'Confirmed': 'تم التأكيد',
    };

    const OrdersView = () => (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">📑 تقرير الطلبات المسجلة</h1>
                <p className="text-slate-500 mt-1">عرض وتتبع جميع طلبات العملاء.</p>
            </header>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">رقم الطلب</th>
                                <th scope="col" className="px-6 py-3">التاريخ</th>
                                <th scope="col" className="px-6 py-3">العميل</th>
                                <th scope="col" className="px-6 py-3">الهاتف</th>
                                <th scope="col" className="px-6 py-3">الإجمالي</th>
                                <th scope="col" className="px-6 py-3">الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{order.id}</td>
                                    <td className="px-6 py-4">{new Date(order.date).toLocaleDateString('ar-EG')}</td>
                                    <td className="px-6 py-4">{order.customerName}</td>
                                    <td className="px-6 py-4">{order.customerPhone}</td>
                                    <td className="px-6 py-4 font-semibold">{order.totalAmount.toLocaleString()} ج.م</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${getStatusChip(order.status)}`}>
                                            {statusTranslations[order.status] || order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             {orders.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100 mt-4">
                    <p className="text-gray-500">لا توجد طلبات مسجلة حتى الآن.</p>
                </div>
            )}
        </>
    );

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
             <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">Select a tab</label>
                <select id="tabs" name="tabs" onChange={(e) => setActiveTab(e.target.value as 'orders' | 'products')} value={activeTab} className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <option value="orders">الطلبات</option>
                    <option value="products">المنتجات</option>
                </select>
            </div>
            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 space-x-reverse" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`${
                                activeTab === 'orders'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            الطلبات
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`${
                                activeTab === 'products'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            aria-current={activeTab === 'products' ? 'page' : undefined}
                        >
                            المنتجات
                        </button>
                    </nav>
                </div>
            </div>

            <div className="mt-8">
                {activeTab === 'orders' ? (
                    <OrdersView />
                ) : (
                    <ProductManager
                        products={products}
                        onAddProduct={onAddProduct}
                        onUpdateProduct={onUpdateProduct}
                        onDeleteProduct={onDeleteProduct}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
