
import React from 'react';
import type { Order, OrderStatus } from '../types';

// Icon Components
const ConfirmedIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);
const PreparingIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const ReadyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);
const DeliveredIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h2a1 1 0 001-1V7a1 1 0 00-1-1h-2" />
    </svg>
);

const statusSteps: { status: OrderStatus; label: string; description: string; icon: React.ReactNode }[] = [
    { status: 'Confirmed', label: 'تم تأكيد الطلب', description: 'استلمنا طلبك وجاري مراجعته.', icon: <ConfirmedIcon /> },
    { status: 'Preparing', label: 'جاري التحضير', description: 'فريقنا يقوم بتجهيز طلبك الآن.', icon: <PreparingIcon /> },
    { status: 'Ready', label: 'جاهز للتوصيل', description: 'تم تجهيز طلبك وينتظر مندوب التوصيل.', icon: <ReadyIcon /> },
    { status: 'Delivered', label: 'تم التوصيل', description: 'استمتع بطلبك!', icon: <DeliveredIcon /> },
];

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

interface OrderTrackerProps {
    order: Order;
    onNewOrder: () => void;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ order, onNewOrder }) => {
    const currentStatusIndex = statusSteps.findIndex(step => step.status === order.status);
    
    const paymentMethodText = {
        'Cash': 'كاش عند الاستلام',
        'InstaPay': 'تحويل InstaPay'
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <div className="text-center mb-8 pb-4 border-b">
                    <h1 className="text-2xl font-bold text-slate-800">🎉 شكرًا لطلبك!</h1>
                    <p className="text-slate-500 mt-2">يمكنك متابعة حالة طلبك من هنا. رقم طلبك هو:</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2 bg-blue-50 inline-block px-4 py-1 rounded-md">{order.id}</p>
                </div>

                {/* Visual Progress Bar */}
                <div className="my-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">مراحل الطلب</h3>
                    <div className="flex items-start">
                         {statusSteps.map((step, index) => {
                             const isCompleted = index < currentStatusIndex;
                             const isActive = index === currentStatusIndex;
                             const isLastStep = index === statusSteps.length - 1;

                             const stepCircleClass = isCompleted 
                                ? 'bg-blue-600 text-white' 
                                : isActive 
                                ? 'bg-green-500 text-white animate-pulse'
                                : 'bg-gray-200 text-gray-500';
                            
                             const stepTextClass = isCompleted || isActive ? 'text-gray-800 font-semibold' : 'text-gray-500';
                             const connectorClass = isCompleted ? 'bg-blue-600' : 'bg-gray-200';

                             return (
                                <React.Fragment key={step.status}>
                                    <div className="flex flex-col items-center text-center" style={{width: '25%'}}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${stepCircleClass}`}>
                                            {isCompleted ? <CheckIcon /> : step.icon}
                                        </div>
                                        <p className={`mt-2 text-xs md:text-sm ${stepTextClass}`}>{step.label}</p>
                                    </div>
                                    {!isLastStep && (
                                        <div className={`flex-1 h-1 mt-5 transition-colors duration-300 ${connectorClass}`}></div>
                                    )}
                                </React.Fragment>
                             );
                         })}
                    </div>
                     <div className="mt-8 text-center bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="font-semibold text-blue-800">{statusSteps[currentStatusIndex].label}</p>
                        <p className="text-sm text-blue-700">{statusSteps[currentStatusIndex].description}</p>
                    </div>
                </div>
                {/* End of Visual Progress Bar */}
                
                <div className="bg-gray-50 p-6 rounded-lg border-t pt-6 mt-8">
                     <h3 className="text-lg font-bold text-gray-800 mb-4">ملخص الطلب</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                         <div className="flex justify-between"><span className="font-medium text-gray-500">العميل:</span> <span className="font-semibold text-gray-800">{order.customerName}</span></div>
                         <div className="flex justify-between"><span className="font-medium text-gray-500">الهاتف الأساسي:</span> <span className="font-semibold text-gray-800">{order.customerPhone}</span></div>
                         {order.alternatePhone && <div className="flex justify-between"><span className="font-medium text-gray-500">هاتف بديل:</span> <span className="font-semibold text-gray-800">{order.alternatePhone}</span></div>}
                         <div className="flex justify-between"><span className="font-medium text-gray-500">طريقة الدفع:</span> <span className="font-semibold text-gray-800">{paymentMethodText[order.paymentMethod]}</span></div>
                         <div className="md:col-span-2 flex justify-between"><span className="font-medium text-gray-500">العنوان:</span> <span className="font-semibold text-gray-800 text-left">{order.customerAddress}</span></div>
                         {order.landmark && <div className="md:col-span-2 flex justify-between"><span className="font-medium text-gray-500">علامة مميزة:</span> <span className="font-semibold text-gray-800 text-left">{order.landmark}</span></div>}
                     </div>
                     <hr className="my-4" />
                     <div className="space-y-2">
                        {order.items.map(item => (
                            <div key={item.productId} className="flex justify-between text-sm">
                                <span>{item.name} (x{item.quantity})</span>
                                <span className="font-medium">{(item.price * item.quantity).toLocaleString()} ج.م</span>
                            </div>
                        ))}
                     </div>
                     <hr className="my-4" />
                      <div className="flex justify-between font-bold text-lg">
                        <span>إجمالي المنتجات</span>
                        <span>{order.totalAmount.toLocaleString()} ج.م</span>
                      </div>
                </div>

                <div className="mt-8 text-center border-t pt-6">
                    {order.status === 'Delivered' ? (
                        <div className="animate-fade-in">
                            <p className="text-lg font-semibold text-gray-800 mb-4">هل أنت مستعد لطلبك التالي؟</p>
                            <button onClick={onNewOrder} className="bg-blue-600 text-white font-bold py-3 px-10 text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
                                ابدأ طلبًا جديدًا
                            </button>
                        </div>
                    ) : (
                        <button onClick={onNewOrder} className="bg-gray-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-900 transition-colors">
                            إنشاء طلب جديد
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderTracker;