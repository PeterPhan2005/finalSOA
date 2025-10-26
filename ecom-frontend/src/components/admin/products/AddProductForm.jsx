import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import InputField from '../../shared/InputField';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addNewProductFromDashboard, fetchCategories, updateProductFromDashboard } from '../../../store/actions';
import toast from 'react-hot-toast';
import Spinners from '../../shared/Spinners';
import SelectTextField from '../../shared/SelectTextField';
import Skeleton from '../../shared/Skeleton';
import ErrorPage from '../../shared/ErrorPage';

const AddProductForm = ({ setOpen, product, update=false}) => {
const [loader, setLoader] = useState(false);
const [selectedCategory, setSelectedCategory] = useState();
const { categories } = useSelector((state) => state.products);
const { categoryLoader, errorMessage } = useSelector((state) => state.errors);
const { user } = useSelector((state) => state.auth);
const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");

const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors }
    } = useForm({
        mode: "onTouched"
    });

    const saveProductHandler = (data) => {
        if(!update) {
            // create new product logic
            const sendData = {
                ...data,
                categoryId: selectedCategory.categoryId,
                price: parseFloat(data.price),
                discount: Math.round(parseFloat(data.discount) || 0),
                specialPrice: Math.round(parseFloat(data.specialPrice) || 0),
                quantity: parseInt(data.quantity),
            };
            dispatch(addNewProductFromDashboard(
                sendData, toast, reset, setLoader, setOpen, isAdmin
            ));
        } else {
            const sendData = {
                ...data,
                id: product.id,
                price: parseFloat(data.price),
                discount: Math.round(parseFloat(data.discount) || 0),
                specialPrice: Math.round(parseFloat(data.specialPrice) || 0),
                quantity: parseInt(data.quantity),
            };
            dispatch(updateProductFromDashboard(sendData, toast, reset, setLoader, setOpen, isAdmin));
        }
    };

    // Handle price/discount/specialPrice calculations manually via onChange
    const handlePriceChange = (e) => {
        const price = parseFloat(e.target.value) || 0;
        const discount = parseFloat(getValues('discount')) || 0;
        if (price > 0 && discount >= 0) {
            const specialPrice = price - (price * discount / 100);
            setValue('specialPrice', Math.round(specialPrice));
        }
    };

    const handleDiscountChange = (e) => {
        const discount = parseFloat(e.target.value) || 0;
        const price = parseFloat(getValues('price')) || 0;
        if (price > 0 && discount >= 0 && discount <= 100) {
            const specialPrice = price - (price * discount / 100);
            setValue('specialPrice', Math.round(specialPrice));
        }
    };

    const handleSpecialPriceChange = (e) => {
        const specialPrice = parseFloat(e.target.value) || 0;
        const price = parseFloat(getValues('price')) || 0;
        if (price > 0 && specialPrice >= 0 && specialPrice <= price) {
            const discount = ((price - specialPrice) / price) * 100;
            setValue('discount', Math.round(discount));
        }
    };


    useEffect(() => {
        if (update && product) {
            setValue("productName", product?.productName);
            setValue("price", product?.price);
            setValue("quantity", product?.quantity);
            setValue("discount", product?.discount);
            setValue("specialPrice", product?.specialPrice);
            setValue("description", product?.description);
            
            // Set category for update mode
            if (product?.categoryId && categories && categories.length > 0) {
                const productCategory = categories.find(cat => cat.categoryId === product.categoryId);
                if (productCategory) {
                    setSelectedCategory(productCategory);
                }
            }
        }
    }, [update, product, setValue, categories]);


    useEffect(() => {
        // Always fetch categories (needed for both add and update modes)
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (!categoryLoader && categories) {
            setSelectedCategory(categories[0]);
        }
    }, [categories, categoryLoader]);

    if (categoryLoader) return <Skeleton />
    if (errorMessage) return <ErrorPage message={errorMessage} />

  return (
    <div className='py-5 relative h-full'>
        <form className='space-y-4'
            onSubmit={handleSubmit(saveProductHandler)}>
            <div className='flex md:flex-row flex-col gap-4 w-full'>
                <InputField 
                    label="Product Name"
                    required
                    id="productName"
                    type="text"
                    message="This field is required*"
                    register={register}
                    placeholder="Product Name"
                    errors={errors}
                    />

                <SelectTextField
                    label="Select Categories"
                    select={selectedCategory}
                    setSelect={setSelectedCategory}
                    lists={categories}
                />
            </div>

            <div className='flex md:flex-row flex-col gap-4 w-full'>
                <InputField 
                    label="Price"
                    required
                    id="price"
                    type="number"
                    message="This field is required*"
                    placeholder="Product Price"
                    register={register}
                    errors={errors}
                    onChange={handlePriceChange}
                    />

                    <InputField 
                    label="Quantity"
                    required
                    id="quantity"
                    type="number"
                    message="This field is required*"
                    register={register}
                    placeholder="Product Quantity"
                    errors={errors}
                    />
            </div>
        <div className="flex md:flex-row flex-col gap-4 w-full">
          <InputField
            label="Discount (%)"
            id="discount"
            type="number"
            step="1"
            message="Discount percentage"
            placeholder="Enter discount %"
            register={register}
            errors={errors}
            onChange={handleDiscountChange}
          />
          <InputField
            label="Special Price ($)"
            id="specialPrice"
            type="number"
            step="1"
            message="Final price after discount"
            placeholder="Special price"
            register={register}
            errors={errors}
            onChange={handleSpecialPriceChange}
          />
        </div>
        <p className="text-xs text-gray-500 -mt-2">
          💡 Tip: Enter price and discount % to auto-calculate special price, or enter special price to auto-calculate discount %. Values will be rounded to whole numbers.
        </p>

        <div className="flex flex-col gap-2 w-full">
            <label htmlFor='desc'
              className='font-semibold text-sm text-slate-800'>
                Description <span className="text-red-500">*</span>
            </label>

            <textarea
                rows={5}
                placeholder="Add product description (minimum 6 characters)..."
                className={`px-4 py-2 w-full border outline-hidden bg-transparent text-slate-800 rounded-md ${
                    errors["description"]?.message ? "border-red-500" : "border-slate-700" 
                }`}
                maxLength={255}
                {...register("description", {
                    required: {value: true, message:"Description is required"},
                    minLength: {value: 6, message: "Description must be at least 6 characters"}
                })}
                />

                {errors["description"]?.message && (
                    <p className="text-sm font-semibold text-red-600 mt-0">
                        {errors["description"]?.message}
                    </p>
                )}
        </div>

        <div className='flex w-full justify-between items-center absolute bottom-14'>
            <Button disabled={loader}
                    onClick={() => setOpen(false)}
                    variant='outlined'
                    className='text-white py-[10px] px-4 text-sm font-medium'>
                Cancel
            </Button>

            <Button
                disabled={loader}
                type='submit'
                variant='contained'
                color='primary'
                className='bg-custom-blue text-white  py-[10px] px-4 text-sm font-medium'>
                {loader ? (
                    <div className='flex gap-2 items-center'>
                        <Spinners /> Loading...
                    </div>
                ) : (
                    "Save"
                )}
            </Button>
        </div>
        </form>
    </div>
  )
}

export default AddProductForm