
import React from 'react';
import type { Order, OrderStatus } from '../types';

interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
    onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const statusTranslations: { [key in OrderStatus]: string } = {
    'Delivered': 'تم التوصيل',
    'Ready': 'جاهز للتوصيل',
    'Preparing': 'جاري التحضير',
    'Confirmed': 'تم التأكيد',
};

const statusOptions: OrderStatus[] = ['Confirmed', 'Preparing', 'Ready', 'Delivered'];

const paymentMethodText = {
    'Cash': 'كاش عند الاستلام',
    'InstaPay': 'تحويل InstaPay'
};

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose, onUpdateStatus }) => {
    if (!order) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b sticky top-0 bg-white z-10">
                    <div className="flex justify-between items-center">
                        <div>
                           <h2 className="text-xl font-bold text-slate-800">تفاصيل الطلب</h2>
                           <p className="text-sm font-semibold text-blue-600">{order.id}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <span className="sr-only">Close</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label htmlFor="order-status" className="block text-sm font-medium text-gray-700 mb-2">تحديث حالة الطلب:</label>
                        <select
                            id="order-status"
                            value={order.status}
                            onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors font-semibold"
                        >
                            {statusOptions.map(status => (
                                <option key={status} value={status}>{statusTranslations[status]}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">بيانات العميل</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            <p><strong className="text-gray-500">الاسم:</strong> {order.customerName}</p>
                            <p><strong className="text-gray-500">الهاتف الأساسي:</strong> {order.customerPhone}</p>
                            {order.alternatePhone && <p><strong className="text-gray-500">هاتف بديل:</strong> {order.alternatePhone}</p>}
                             <p className="sm:col-span-2"><strong className="text-gray-500">العنوان:</strong> {order.customerAddress}</p>
                            {order.landmark && <p className="sm:col-span-2"><strong className="text-gray-500">علامة مميزة:</strong> {order.landmark}</p>}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">المنتجات المطلوبة</h3>
                        <div className="space-y-3">
                            {order.items.map(item => (
                                <div key={item.productId} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                                    <div>
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.quantity} كجم × {item.price.toLocaleString()} ج.م/كجم</p>
                                    </div>
                                    <p className="font-semibold text-gray-900">{(item.price * item.quantity).toLocaleString()} ج.م</p>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <div className="border-t pt-4 space-y-2">
                             <div className="flex justify-between text-sm">
                                <span className="text-gray-600">طريقة الدفع:</span>
                                <span className="font-semibold">{paymentMethodText[order.paymentMethod]}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold">
                                <span>الإجمالي:</span>
                                <span>{order.totalAmount.toLocaleString()} ج.م</span>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="p-4 bg-gray-50 border-t text-center">
                    <button onClick={onClose} className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition font-semibold">
                       إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
