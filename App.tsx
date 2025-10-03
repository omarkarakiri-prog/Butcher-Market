
import React, { useState } from 'react';
import type { Order, OrderItem, Product, PaymentMethod, OrderStatus } from './types';
import OrderForm from './components/OrderForm';
import OrderTracker from './components/OrderTracker';
import AdminDashboard from './components/AdminDashboard';

const initialProducts: Product[] = [
    // Per Dish section from the menu
    { id: 1, name: 'ممبار محشي - لحمة (Stuffed Mumbar)', price: 375 },
    { id: 2, name: 'لحم الحواوشي المتبل (Oriental Hawawshi Meat)', price: 320 },
    { id: 3, name: 'لحم حواوشي السجق (Hawawshi Sausages Meat)', price: 370 },
    { id: 4, name: 'كوردون بلو - لحمة (Meat Cordon Bleu)', price: 510 },
    { id: 5, name: 'بفتيك لحم متبل (Marinated Escalope)', price: 520 },
    { id: 6, name: 'شاورما لحم متبلة (Marinated Shawarma)', price: 520 },
    { id: 7, name: 'انتركوت ستيك متبل شوي (Marinated Steak - Grill)', price: 520 },
    { id: 8, name: 'ريش شوي متبلة (Marinated Ribs - Grill)', price: 520 },
    { id: 21, name: 'ورقة لحمة (Meat Paper)', price: 0 },
    { id: 22, name: 'كبدة متبلة - بانيه (Marinated liver - Pane)', price: 0 },
    { id: 23, name: 'كبدة متبلة - بالردة (Marinated liver - Fry)', price: 330 },
    { id: 24, name: 'شيش كباب متبل (Marinated Shish)', price: 280 },

    // Meat Products section
    { id: 25, name: 'صافي (Safi)', price: 420 },
    { id: 26, name: 'ممبار محشي - لحمة (صنف مصنعات) (Stuffed Mumbar)', price: 440 },
    { id: 9, name: 'برجر بوتشر (Burger Butcher)', price: 420 },
    { id: 10, name: 'تشيز برجر جامبو (Cheese Burger)', price: 440 },
    { id: 11, name: 'سجق شرقي (Oriental Sausages)', price: 420 },
    { id: 12, name: 'سجق لبناني (Lebanese Sausages)', price: 440 },
    { id: 13, name: 'كفتة شوي - طرب (Kofta For Grill)', price: 420 },
    { id: 14, name: 'كفتة داوود باشا (Kofta Dawood Basha)', price: 420 },
    { id: 15, name: 'كاندي سويت (Candy Sweet)', price: 460 },
    { id: 16, name: 'كفتة بانيه - لحمة (Beef Kofta - Bane)', price: 400 },
    { id: 17, name: 'كفتة رز (Rice Kofta)', price: 360 },

    // Ready to Cook section
    { id: 18, name: 'ممبار محشي - عادي (Stuffed Mumbar - Regular)', price: 290 },
    { id: 19, name: 'ممبار محشي - بوبس (Pops Mumbar)', price: 330 },
    { id: 20, name: 'ممبار ضاني - محشي (Stuffed Mumbar - Lamb)', price: 0 },
    
    // New Products from the second menu
    // Beef Steak section
    { id: 27, name: 'شورت ريبس (Short Ribs)', price: 400 },
    { id: 28, name: 'ريش شوي (Beef Ribs)', price: 420 },
    { id: 29, name: 'سمانة ستيك (Beef Steak)', price: 460 },
    { id: 30, name: 'ريب اي ستيك (Rib Eye Steak)', price: 460 },
    { id: 31, name: 'انتركوت ستيك (Strip Loin Steak)', price: 460 },
    { id: 32, name: 'توماهوك ستيك (Tomahawk Steak)', price: 480 },

    // Beef Roast section
    { id: 33, name: 'عرق فلتو (Fillet Roast)', price: 460 },
    { id: 34, name: 'عرق روستو (Eye Round Roast)', price: 480 },
    { id: 35, name: 'عكاوي (Oxtail)', price: 390 },

    // Basic Cuts section
    { id: 36, name: 'كباب حلة - دهن زيادة (Beef Cubes Extra Fat)', price: 400 },
    { id: 37, name: 'لحم مفروم - دهن زيادة (Minced Beef - Extra Fat)', price: 400 },
    { id: 38, name: 'دوش كندوز (Beef Breast)', price: 410 },
    { id: 39, name: 'كباب خضار - دهن قليل (Beef Cubes Low Fat)', price: 420 },
    { id: 40, name: 'شاورما (Shawarma)', price: 430 },
    { id: 41, name: 'بفتيك/بيكاتا (Escalope/Piccata)', price: 460 },
    { id: 42, name: 'موزة / كولاته كندوز (Minced Beef - Premium)', price: 500 },
    { id: 43, name: 'لحم مفروم - دهن قليل (Minced Beef - Low Fat)', price: 450 },
    { id: 44, name: 'كباب حلة - صافي (Beef Cubes Premium)', price: 450 },
    { id: 45, name: 'مكعبات رأس عصفور (Beef fondue)', price: 460 },
    { id: 46, name: 'كبده صافي (Ox Liver)', price: 490 },
    { id: 47, name: 'كبده وقلب وكلاوي (Ox Liver, Heart & Kidney)', price: 470 },
];

// Mock initial data
const initialOrders: Order[] = [
    {
        id: 'BM-171701',
        customerName: 'أحمد محمود',
        customerPhone: '0123456789',
        customerAddress: '123 شارع المثال، القاهرة',
        items: [{ productId: 11, name: 'سجق شرقي (Oriental Sausages)', quantity: 2, price: 420 }],
        totalAmount: 840,
        status: 'Delivered',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: 'Cash',
        landmark: 'بجوار المسجد الكبير',
    },
    {
        id: 'BM-171700',
        customerName: 'فاطمة علي',
        customerPhone: '0109876543',
        customerAddress: '45 شارع النصر، الجيزة',
        items: [{ productId: 6, name: 'شاورما لحم متبلة (Marinated Shawarma)', quantity: 1.5, price: 520 }],
        totalAmount: 780,
        status: 'Ready',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: 'InstaPay',
    },
    {
        id: 'BM-171699',
        customerName: 'كريم صلاح',
        customerPhone: '01122334455',
        customerAddress: '789 شارع الحرية، الإسكندرية',
        items: [
            { productId: 10, name: 'تشيز برجر جامبو (Cheese Burger)', quantity: 0.5, price: 440 },
            { productId: 13, name: 'كفتة شوي - طرب (Kofta For Grill)', quantity: 1, price: 420 }
        ],
        totalAmount: 640,
        status: 'Preparing',
        date: new Date().toISOString(),
        paymentMethod: 'Cash',
    },
];


const App: React.FC = () => {
    type View = 'customer_form' | 'customer_tracker' | 'admin_dashboard';

    const [view, setView] = useState<View>('customer_form');
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

    const generateOrderId = () => {
        return `BM-${Math.floor(100000 + Math.random() * 900000)}`;
    };

    const handlePlaceOrder = (customerDetails: { name: string; phone: string; alternatePhone: string; address: string; landmark: string; paymentMethod: PaymentMethod }, items: OrderItem[]) => {
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newOrder: Order = {
            id: generateOrderId(),
            customerName: customerDetails.name,
            customerPhone: customerDetails.phone,
            alternatePhone: customerDetails.alternatePhone,
            customerAddress: customerDetails.address,
            landmark: customerDetails.landmark,
            items,
            totalAmount,
            status: 'Confirmed',
            date: new Date().toISOString(),
            paymentMethod: customerDetails.paymentMethod,
        };

        setOrders(prevOrders => [newOrder, ...prevOrders]);
        setCurrentOrder(newOrder);
        setView('customer_tracker');
    };
    
    const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === orderId ? { ...order, status } : order
            )
        );
    };

    const handleCreateNewOrder = () => {
        setCurrentOrder(null);
        setView('customer_form');
    };

    const handleAddProduct = (product: Omit<Product, 'id'>) => {
        setProducts(prev => [...prev, { ...product, id: Date.now() }]);
    };

    const handleUpdateProduct = (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const handleDeleteProduct = (productId: number) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
    };


    const renderContent = () => {
        switch (view) {
            case 'customer_tracker':
                return currentOrder ? <OrderTracker order={currentOrder} onNewOrder={handleCreateNewOrder} /> : <OrderForm onPlaceOrder={handlePlaceOrder} products={products} />;
            case 'admin_dashboard':
                return <AdminDashboard 
                    orders={orders} 
                    products={products}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                />;
            case 'customer_form':
            default:
                return <OrderForm onPlaceOrder={handlePlaceOrder} products={products} />;
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                         <div className="flex items-center">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM8 9h8m-8 4h4" />
                            </svg>
                             <span className="font-bold text-xl ml-2 text-slate-800">بوتشر ماركت</span>
                         </div>
                        <div className="flex items-center space-x-4">
                             <button
                                onClick={() => setView('customer_form')}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${view.startsWith('customer') ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                واجهة العميل
                            </button>
                            <button
                                onClick={() => setView('admin_dashboard')}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${view === 'admin_dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                واجهة المسؤول
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="p-4 sm:p-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
