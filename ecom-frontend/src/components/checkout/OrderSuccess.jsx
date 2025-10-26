import React, { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/api';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/order/users/orders`);
                const order = response.data.content.find(o => o.orderId === parseInt(orderId));
                
                if (order) {
                    setOrderDetails(order);
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className="text-gray-600">Loading order details...</div>
            </div>
        );
    }

    const paymentMethod = orderDetails?.payment?.paymentMethod || 'Cash on Delivery';
    const totalAmount = orderDetails?.totalAmount || 0;

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
            <div className="p-8 rounded-lg shadow-lg text-center max-w-md mx-auto border border-gray-200 bg-white">
                <div className="text-green-500 mb-4 flex justify-center">    
                    <FaCheckCircle size={64} />
                </div>
                <h2 className='text-3xl font-bold text-gray-800 mb-2'>Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-4">
                    Thank you for your order! Your order has been placed successfully.
                </p>
                
                {orderDetails && (
                    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                        <p className='text-sm text-gray-700 mb-1'>
                            <strong>Order ID:</strong> #{orderDetails.orderId}
                        </p>
                        <p className='text-sm text-gray-700 mb-1'>
                            <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
                        </p>
                        <p className='text-sm text-gray-700 mb-2'>
                            <strong>Payment Method:</strong> {paymentMethod}
                        </p>
                        {paymentMethod === 'Cash on Delivery' && (
                            <p className='text-sm text-gray-600 mt-2'>
                                Please keep the exact amount ready when our delivery personnel arrives.
                            </p>
                        )}
                        {paymentMethod === 'VNPay' && (
                            <p className='text-sm text-gray-600 mt-2'>
                                Your payment has been confirmed. Thank you for using VNPay!
                            </p>
                        )}
                    </div>
                )}
                
                <div className='space-y-3'>
                    <button
                        onClick={() => navigate('/profile/orders')}
                        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors'>
                        View My Orders
                    </button>
                    <button
                        onClick={() => navigate('/products')}
                        className='w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md transition-colors'>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccess

