import { Button, Step, StepLabel, Stepper } from '@mui/material';
import React, { useEffect, useState } from 'react'
import AddressInfo from './AddressInfo';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAddresses, createUserCart } from '../../store/actions';
import toast from 'react-hot-toast';
import Skeleton from '../shared/Skeleton';
import ErrorPage from '../shared/ErrorPage';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';
import CODPayment from './CODPayment';
import { Navigate } from 'react-router-dom';
import VNPayPayment from './VNPayPayment';

const Checkout = () => {
    const [activeStep, setActiveStep] = useState(0);
    const dispatch = useDispatch();
    const { isLoading, errorMessage } = useSelector((state) => state.errors);
    const { cart, totalPrice, cartId } = useSelector((state) => state.carts);
    const { address, selectedUserCheckoutAddress, user } = useSelector(
        (state) => state.auth
    )
    const { paymentMethod } = useSelector((state) => state.payment);
    
    // Check if user is admin or seller
    const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");
    const isSeller = user && user?.roles?.includes("ROLE_SELLER");
    
    // Redirect admin/seller away from checkout
    if (isAdmin || isSeller) {
        return <Navigate to="/" replace />;
    }

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleNext = () => {
        if(activeStep === 0 && !selectedUserCheckoutAddress) {
            toast.error("Please select checkout address before proceeding.");
            return;
        }
        if(activeStep === 1 && !paymentMethod) {
            toast.error("Please select a payment method before proceeding.");
            return;
        }
        
        setActiveStep((prevStep) => prevStep + 1);
    };

    const steps = [
        "Address",
        "Payment Method",
        "Order Summary",
        "Confirm Order",
    ];
    
    useEffect(() => {
        dispatch(getUserAddresses());
    }, [dispatch]);

    // Ensure cart is synced with server before checkout
    useEffect(() => {
        if (cart.length > 0 && !cartId) {
            const sendCartItems = cart.map((item) => {
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                };
            });
            dispatch(createUserCart(sendCartItems));
        }
    }, [cart, cartId, dispatch]);

  return (
    <div className='py-14 min-h-screen pb-32'>
        <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
                <Step key={index}>
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>

        {isLoading ? (
            <div className='lg:w-[80%] mx-auto py-5'>
                <Skeleton />
            </div>
        ) : (
            <div className='mt-5 mb-32'>
                {activeStep === 0 && <AddressInfo address={address} />}
                {activeStep === 1 && <PaymentMethod />}
                {activeStep === 2 && <OrderSummary 
                                        totalPrice={totalPrice}
                                        cart={cart}
                                        address={selectedUserCheckoutAddress}
                                        paymentMethod={paymentMethod}/>}
                {activeStep === 3 && (
                    paymentMethod === 'VNPay' ? <VNPayPayment /> : <CODPayment />
                )}
            </div>
        )}
        

        <div
            className='flex justify-between items-center px-4 fixed z-50 h-24 bottom-0 bg-white left-0 w-full py-4 border-slate-200'
            style={{ boxShadow: "0 -2px 4px rgba(100, 100, 100, 0.15)" }}>
            <Button
                variant='outlined'
                disabled={activeStep === 0}
                onClick={handleBack}>
                    Back
            </Button>

            {activeStep !== steps.length - 1 && (
                <button
                    disabled={
                        errorMessage || (activeStep === 0 && !selectedUserCheckoutAddress)
                    }
                    className={`bg-custom-blue font-semibold px-6 h-10 rounded-md text-white
                       ${
                        errorMessage || (activeStep === 0 && !selectedUserCheckoutAddress)
                        ? "opacity-60"
                        : ""
                       }`}
                       onClick={handleNext}>
                    Proceed
                </button>
            )} 
        </div>
        
        {errorMessage && <ErrorPage message={errorMessage} />}
    </div>
  );
}

export default Checkout;