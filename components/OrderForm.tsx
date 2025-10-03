
import React, { useState, useMemo } from 'react';
import type { OrderItem, Product, PaymentMethod } from '../types';

interface OrderFormProps {
    onPlaceOrder: (customerDetails: { name: string; phone: string; alternatePhone: string; address: string; landmark: string; paymentMethod: PaymentMethod }, items: OrderItem[]) => void;
    products: Product[];
}

const OrderForm: React.FC<OrderFormProps> = ({ onPlaceOrder, products }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [alternatePhone, setAlternatePhone] = useState('');
    const [address, setAddress] = useState('');
    const [landmark, setLandmark] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
    const [cart, setCart] = useState<Record<number, number>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleQuantityChange = (productId: number, quantity: number) => {
        setCart(prevCart => {
            const newCart = { ...prevCart };
            if (quantity > 0) {
                newCart[productId] = quantity;
            } else {
                delete newCart[productId];
            }
            return newCart;
        });
    };

    const orderedItems = useMemo((): OrderItem[] => {
        return Object.entries(cart)
            .map(([productId, quantity]) => {
                const product = products.find(p => p.id === Number(productId));
                if (!product) {
                    return null;
                }
                return {
                    productId: product.id,
                    name: product.name,
                    quantity: Number(quantity),
                    price: product.price,
                };
            })
            .filter((item): item is OrderItem => item !== null);
    }, [cart, products]);

    const totalAmount = useMemo(() => {
        return orderedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [orderedItems]);
    
    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!name.trim()) newErrors.name = "الاسم مطلوب.";
        
        const phoneRegex = /^01[0125][0-9]{8}$/;
        if (!phone.trim()) {
            newErrors.phone = "رقم التليفون الأساسي مطلوب.";
        } else if (!phoneRegex.test(phone)) {
            newErrors.phone = "يرجى إدخال رقم هاتف مصري صحيح (11 رقمًا يبدأ بـ 01).";
        }

        if (alternatePhone.trim() && !phoneRegex.test(alternatePhone)) {
             newErrors.alternatePhone = "يرجى إدخال رقم هاتف مصري صحيح (11 رقمًا يبدأ بـ 01).";
        }
        
        if (!address.trim()) newErrors.address = "العنوان مطلوب.";
        
        if (orderedItems.length === 0) {
            newErrors.cart = 'يرجى إضافة منتجات إلى السلة أولاً.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        onPlaceOrder({ name, phone, alternatePhone, address, landmark, paymentMethod }, orderedItems);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
             <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">📦 بوتشر ماركت – طلب أوردر 📦</h1>
                <p className="text-slate-500 mt-1">أدخل بياناتك واختر المنتجات التي تريدها.</p>
            </div>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md border border-gray-100 space-y-8">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">بيانات العميل</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors`} required />
                            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                        </div>
                         <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">رقم التليفون الأساسي</label>
                            <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors`} required />
                            {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                        </div>
                        <div>
                            <label htmlFor="alternatePhone" className="block text-sm font-medium text-gray-700 mb-1">رقم بديل (اختياري)</label>
                            <input type="tel" id="alternatePhone" value={alternatePhone} onChange={e => setAlternatePhone(e.target.value)} className={`w-full px-3 py-2 border ${errors.alternatePhone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors`} />
                            {errors.alternatePhone && <p className="text-red-600 text-xs mt-1">{errors.alternatePhone}</p>}
                        </div>
                         <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">العنوان بالتفصيل (شارع – عمارة – شقة)</label>
                            <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors`} required />
                            {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">علامة مميزة</label>
                            <input type="text" id="landmark" value={landmark} onChange={e => setLandmark(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="md:col-span-2 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                            <p className="font-semibold text-yellow-800">📍 ابعت اللوكيشن من واتساب مباشرة</p>
                            <p className="text-sm text-yellow-700">لضمان دقة التوصيل، يرجى إرسال موقعك الحالي عبر واتساب بعد تأكيد الطلب.</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">🍽 تفاصيل الطلب</h2>
                    <div className="space-y-4 mt-4">
                        {products.map(product => (
                            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-gray-800">{product.name}</p>
                                    <p className="text-sm text-gray-500">{product.price.toLocaleString()} ج.م / كجم</p>
                                </div>
                                <div className="w-28">
                                    <label htmlFor={`quantity-${product.id}`} className="sr-only">الكمية</label>
                                    <input 
                                       type="number"
                                       id={`quantity-${product.id}`}
                                       min="0"
                                       step="0.5"
                                       placeholder="0"
                                       onChange={e => handleQuantityChange(product.id, parseFloat(e.target.value))}
                                       className="w-full text-center px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">💳 طريقة الدفع</h2>
                     <div className="mt-4 space-y-4">
                        <div className="flex items-center p-4 border rounded-lg has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                            <input id="cash" name="payment-method" type="radio" value="Cash" checked={paymentMethod === 'Cash'} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"/>
                            <label htmlFor="cash" className="mr-3 block text-sm font-medium text-gray-900">
                                كاش عند الاستلام 💵
                            </label>
                        </div>
                         <div className="flex items-center p-4 border rounded-lg has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
                            <input id="instapay" name="payment-method" type="radio" value="InstaPay" checked={paymentMethod === 'InstaPay'} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"/>
                            <label htmlFor="instapay" className="mr-3 block text-sm font-medium text-gray-900">
                                تحويل InstaPay 📲
                                <span className="block text-xs text-gray-500">"بيانات التحويل هنبعتها وقت التأكيد"</span>
                            </label>
                        </div>
                    </div>
                </div>


                <div className="border-t pt-6">
                     <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-center mb-6">
                       <p className="font-bold">🚚 بعد إستلام بياناتك، فريقنا هيحسب الإجمالي + تكلفة الشحن .. ونبعتلك رسالة تأكيد قبل التنفيذ ✅</p>
                    </div>
                    {errors.cart && <p className="text-red-600 text-sm text-center mb-4 font-semibold">{errors.cart}</p>}
                    <div className="flex justify-between items-center">
                        <div>
                             <p className="text-lg font-bold text-gray-800">إجمالي المنتجات:</p>
                            <p className="text-2xl font-bold text-blue-600">{totalAmount.toLocaleString()} ج.م</p>
                        </div>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
                            تأكيد الطلب
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default OrderForm;
