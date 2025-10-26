import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeCODOrder } from '../../store/actions';
import toast from 'react-hot-toast';

const CODPayment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const { totalPrice } = useSelector((state) => state.carts);
    const { selectedUserCheckoutAddress } = useSelector((state) => state.auth);

    const handlePlaceOrder = async () => {
        if (!selectedUserCheckoutAddress) {
            toast.error("Please select a delivery address");
            return;
        }

        setIsProcessing(true);
        
        const sendData = {
            addressId: selectedUserCheckoutAddress.addressId,
            paymentMethod: "Cash on Delivery",
            pgName: "COD",
            pgPaymentId: "COD-" + Date.now(),
            pgStatus: "pending",
            pgResponseMessage: "Cash on Delivery"
        };

        try {
            await dispatch(placeCODOrder(sendData, toast, navigate));
        } catch (error) {
            toast.error("Failed to place order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className='max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg border'>
            <h2 className='text-2xl font-semibold mb-4'>Cash on Delivery</h2>
            
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
                <p className='text-gray-700 mb-2'>
                    <strong>Payment Method:</strong> Cash on Delivery (COD)
                </p>
                <p className='text-gray-600 text-sm'>
                    You will pay <strong className='text-lg text-green-600'>${Number(totalPrice).toFixed(2)}</strong> in cash when you receive your order.
                </p>
            </div>

            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
                <p className='text-sm text-gray-700'>
                    <strong>Note:</strong> Please keep the exact amount ready when our delivery personnel arrives.
                </p>
            </div>

            <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className='text-white w-full px-5 py-3 bg-green-600 hover:bg-green-700 rounded-md font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
                {isProcessing ? "Processing Order..." : "Place Order"}
            </button>
        </div>
    )
}

export default CODPayment
