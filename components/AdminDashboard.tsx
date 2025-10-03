
import React, { useState, useMemo } from 'react';
import type { Order, Product, OrderStatus } from '../types';
import ProductManager from './ProductManager';
import OrderDetailsModal from './OrderDetailsModal';

interface AdminDashboardProps {
    orders: Order[];
    products: Product[];
    onAddProduct: (product: Omit<Product, 'id'>) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (productId: number) => void;
    onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

// Fix: Replaced JSX.Element with React.ReactNode to resolve namespace error.
const statusConfig: { [key in OrderStatus]: { label: string; chip: string; icon: React.ReactNode; } } = {
    'Confirmed': { label: 'تم التأكيد', chip: 'bg-purple-100 text-purple-800', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
    'Preparing': { label: 'جاري التحضير', chip: 'bg-yellow-100 text-yellow-800', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    'Ready': { label: 'جاهز للتوصيل', chip: 'bg-blue-100 text-blue-800', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    'Delivered': { label: 'تم التوصيل', chip: 'bg-green-100 text-green-800', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h2a1 1 0 001-1V7a1 1 0 00-1-1h-2" /></svg> },
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, products, onAddProduct, onUpdateProduct, onDeleteProduct, onUpdateOrderStatus }) => {
    const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

    const OrdersView = () => {
        const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
        const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
        const [searchTerm, setSearchTerm] = useState('');
        const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: 'asc' | 'desc' } | null>({ key: 'date', direction: 'desc' });

        const statusCounts = useMemo(() => {
            return orders.reduce((acc, order) => {
                acc[order.status] = (acc[order.status] || 0) + 1;
                return acc;
            }, {} as Record<OrderStatus, number>);
        }, [orders]);

        const filteredAndSortedOrders = useMemo(() => {
            let filteredOrders = [...orders];

            if (statusFilter !== 'all') {
                filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
            }

            if (searchTerm.trim()) {
                const lowercasedSearchTerm = searchTerm.toLowerCase();
                filteredOrders = filteredOrders.filter(order =>
                    order.customerName.toLowerCase().includes(lowercasedSearchTerm) ||
                    order.customerPhone.includes(lowercasedSearchTerm) ||
                    order.id.toLowerCase().includes(lowercasedSearchTerm)
                );
            }

            if (sortConfig !== null) {
                filteredOrders.sort((a, b) => {
                    const valA = a[sortConfig.key];
                    const valB = b[sortConfig.key];
                    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                    return 0;
                });
            }

            return filteredOrders;
        }, [orders, statusFilter, searchTerm, sortConfig]);

        const requestSort = (key: keyof Order) => {
            let direction: 'asc' | 'desc' = 'asc';
            if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
                direction = 'desc';
            }
            setSortConfig({ key, direction });
        };
        
        const getSortIndicator = (key: keyof Order) => {
            if (!sortConfig || sortConfig.key !== key) return <span className="text-gray-400"> ◇</span>;
            return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
        };

        const handleUpdateStatusAndCloseModal = (orderId: string, status: OrderStatus) => {
            onUpdateOrderStatus(orderId, status);
            setSelectedOrder(prev => prev ? {...prev, status} : null);
        };


        return (
            <>
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">📑 لوحة تحكم الطلبات</h1>
                    <p className="text-slate-500 mt-1">عرض وتتبع جميع طلبات العملاء.</p>
                </header>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col justify-between">
                        <h3 className="font-semibold text-gray-500 text-sm">إجمالي الطلبات</h3>
                        <p className="text-3xl font-bold text-slate-800">{orders.length}</p>
                    </div>
                    {(Object.keys(statusConfig) as OrderStatus[]).map(status => (
                        <div key={status} className="bg-white p-4 rounded-xl shadow-sm border flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                               <h3 className="font-semibold text-gray-500 text-sm">{statusConfig[status].label}</h3>
                               {statusConfig[status].icon}
                            </div>
                            <p className="text-3xl font-bold text-slate-800">{statusCounts[status] || 0}</p>
                        </div>
                    ))}
                </div>

                 <div className="mb-4 bg-white p-4 rounded-xl shadow-sm border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="ابحث بالاسم، الهاتف، أو رقم الطلب..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option value="all">كل الحالات</option>
                            {(Object.keys(statusConfig) as OrderStatus[]).map(status => (
                                <option key={status} value={status}>{statusConfig[status].label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('id')}>رقم الطلب <span className="text-gray-600">{getSortIndicator('id')}</span></th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('date')}>التاريخ <span className="text-gray-600">{getSortIndicator('date')}</span></th>
                                    <th scope="col" className="px-6 py-3">العميل</th>
                                    <th scope="col" className="px-6 py-3">الهاتف</th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('totalAmount')}>الإجمالي <span className="text-gray-600">{getSortIndicator('totalAmount')}</span></th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort('status')}>الحالة <span className="text-gray-600">{getSortIndicator('status')}</span></th>
                                    <th scope="col" className="px-6 py-3 text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedOrders.map(order => (
                                    <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{order.id}</td>
                                        <td className="px-6 py-4">{new Date(order.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric'})}</td>
                                        <td className="px-6 py-4">{order.customerName}</td>
                                        <td className="px-6 py-4">{order.customerPhone}</td>
                                        <td className="px-6 py-4 font-semibold">{order.totalAmount.toLocaleString()} ج.م</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${statusConfig[order.status].chip}`}>
                                                {statusConfig[order.status].label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => setSelectedOrder(order)} className="font-medium text-blue-600 hover:underline">
                                                عرض التفاصيل
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                 {filteredAndSortedOrders.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100 mt-4">
                        <p className="text-gray-500">لا توجد طلبات تطابق معايير البحث.</p>
                    </div>
                )}
                 {selectedOrder && (
                    <OrderDetailsModal 
                        order={selectedOrder} 
                        onClose={() => setSelectedOrder(null)} 
                        onUpdateStatus={handleUpdateStatusAndCloseModal}
                    />
                )}
            </>
        );
    };

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