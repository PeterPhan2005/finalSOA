import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addPaymentMethod } from '../../store/actions';
import { FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';

const PaymentMethod = () => {
    const dispatch = useDispatch();
    const { paymentMethod } = useSelector((state) => state.payment);

    // Automatically set payment method to COD if not selected
    useEffect(() => {
        if (!paymentMethod) {
            dispatch(addPaymentMethod('COD'));
        }
    }, [dispatch, paymentMethod]);

    const handlePaymentChange = (event) => {
        dispatch(addPaymentMethod(event.target.value));
    };

  return (
    <div className='max-w-md mx-auto p-5 bg-white shadow-md rounded-lg mt-16 border'>
        <h1 className='text-2xl font-semibold mb-4'>Payment Method</h1>
        <FormControl component="fieldset" className='w-full'>
            <RadioGroup value={paymentMethod || 'COD'} onChange={handlePaymentChange}>
                {/* COD Payment */}
                <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg mb-3 hover:bg-blue-100 transition-colors cursor-pointer'>
                    <FormControlLabel
                        value="COD"
                        control={<Radio color='primary' />}
                        label={
                            <div className='flex items-center'>
                                <FaMoneyBillWave className='text-green-600 text-2xl mr-3' />
                                <div>
                                    <h3 className='text-lg font-semibold text-gray-800'>Cash on Delivery (COD)</h3>
                                    <p className='text-sm text-gray-600'>Pay when you receive your order</p>
                                </div>
                            </div>
                        }
                        className='w-full m-0'
                    />
                </div>

                {/* VNPay Payment */}
                <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer'>
                    <FormControlLabel
                        value="VNPay"
                        control={<Radio color='primary' />}
                        label={
                            <div className='flex items-center'>
                                <FaCreditCard className='text-blue-600 text-2xl mr-3' />
                                <div>
                                    <h3 className='text-lg font-semibold text-gray-800'>VNPay Payment</h3>
                                    <p className='text-sm text-gray-600'>Pay online with ATM card, credit card, or QR code</p>
                                </div>
                            </div>
                        }
                        className='w-full m-0'
                    />
                </div>
            </RadioGroup>
        </FormControl>
    </div>
  )
}

export default PaymentMethod