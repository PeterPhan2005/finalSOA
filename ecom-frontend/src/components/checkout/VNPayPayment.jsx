import { Button } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { placeVNPayOrder } from '../../store/actions';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard } from 'react-icons/fa';

const VNPayPayment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const { selectedUserCheckoutAddress } = useSelector((state) => state.auth);
    const { totalPrice } = useSelector((state) => state.carts);
    
    // Convert USD to VND (approximate rate: 1 USD = 25,000 VND)
    const USD_TO_VND = 25000;
    const totalPriceVND = (totalPrice * USD_TO_VND).toLocaleString('vi-VN');

    const placeOrderHandler = () => {
        if (!selectedUserCheckoutAddress) {
            toast.error("Please select a delivery address");
            return;
        }

        const sendData = {
            addressId: selectedUserCheckoutAddress.addressId,
            paymentMethod: "VNPay"
        };

        setLoading(true);
        dispatch(placeVNPayOrder(sendData, toast, navigate, setLoading));
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <FaCreditCard className="mr-3 text-blue-600" />
                    VNPay Payment
                </h2>
                <p className="text-gray-600 mb-4">
                    You will be redirected to VNPay payment gateway to complete your payment securely.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Payment Amount:</h3>
                    <p className="text-2xl font-bold text-blue-900">{totalPriceVND} VND</p>
                    <p className="text-sm text-blue-600 mt-1">(≈ ${totalPrice?.toFixed(2)} USD)</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Payment Information:</h3>
                    <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                        <li>Secure payment via VNPay gateway</li>
                        <li>Support multiple payment methods: ATM cards, credit cards, QR code</li>
                        <li>Payment session expires in 15 minutes</li>
                        <li>Your order will be confirmed after successful payment</li>
                    </ul>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={placeOrderHandler}
                    disabled={loading || !selectedUserCheckoutAddress}
                    variant="contained"
                    sx={{
                        backgroundColor: '#0088cc',
                        '&:hover': {
                            backgroundColor: '#006699',
                        },
                        padding: '12px 32px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                    }}
                >
                    {loading ? 'Processing...' : 'Proceed to VNPay Payment'}
                </Button>
            </div>
        </div>
    );
};

export default VNPayPayment;
