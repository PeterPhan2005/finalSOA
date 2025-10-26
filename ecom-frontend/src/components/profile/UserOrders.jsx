import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingBag, FaBoxOpen } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Loader from '../shared/Loader';
import { getUserOrders } from '../../store/actions';

const UserOrders = () => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.errors);
    const { userOrders } = useSelector((state) => state.order); // Changed from state.orders to state.order
    
    // Filter out PENDING and CANCELLED orders - only show completed orders
    const orders = (userOrders || []).filter(order => 
        order.orderStatus === 'Accepted' || 
        order.orderStatus === 'DELIVERED' || 
        order.orderStatus === 'SHIPPED' || 
        order.orderStatus === 'PROCESSING'
    );

    useEffect(() => {
        dispatch(getUserOrders());
    }, [dispatch]);
    
    // Debug log
    useEffect(() => {
        console.log('=== USER ORDERS DEBUG ===');
        console.log('userOrders from state:', userOrders);
        console.log('filtered orders array:', orders);
        console.log('filtered orders length:', orders.length);
    }, [userOrders, orders]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="lg:px-14 sm:px-8 px-4 py-10 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-gray-600 hover:text-gray-900">
                        <MdArrowBack size={28} />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FaShoppingBag size={32} className="text-gray-700" />
                        My Orders
                    </h1>
                </div>
            </div>

            {!orders || orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <FaBoxOpen className="text-gray-300 text-8xl mb-6" />
                    <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                        No Orders Placed
                    </h2>
                    <p className="text-gray-500 mb-6">
                        You haven't placed any orders yet. Start shopping now!
                    </p>
                    <Link 
                        to="/products"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
                    >
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order, index) => (
                        <div 
                            key={order.orderId || index}
                            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Order #{order.orderId}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Placed on {order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'N/A'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
                                        ${order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                                          order.orderStatus === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                          order.orderStatus === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                                          order.orderStatus === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                                          'bg-gray-100 text-gray-800'}`}>
                                        {order.orderStatus || 'PENDING'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Amount:</span>
                                    <span className="font-semibold text-gray-800">
                                        ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="font-medium text-gray-800">
                                        {order.payment?.paymentMethod || 'Cash on Delivery'}
                                    </span>
                                </div>
                                {order.orderItems && order.orderItems.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-sm text-gray-600 mb-2 font-semibold">Order Items:</p>
                                        <div className="space-y-2">
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} className="text-sm text-gray-700">
                                                    {item.product?.productName || 'Product'} x {item.quantity}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserOrders;
