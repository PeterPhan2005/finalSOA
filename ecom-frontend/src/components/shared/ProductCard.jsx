import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import ProductViewModal from "./ProductViewModal";
import truncateText from "../../utils/truncateText";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/actions";
import toast from "react-hot-toast";

const ProductCard = ({
        productId,
        productName,
        image,
        description,
        quantity,
        price,
        discount,
        specialPrice,
        about = false,
}) => {
    const [openProductViewModal, setOpenProductViewModal] = useState(false);
    const btnLoader = false;
    const [selectedViewProduct, setSelectedViewProduct] = useState("");
    const isAvailable = quantity && Number(quantity) > 0;
    const dispatch = useDispatch();
    
    // Get user from Redux store
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");
    const isSeller = user && user?.roles?.includes("ROLE_SELLER");
    const canPurchase = user && !isAdmin && !isSeller; // Only regular users can purchase

    const handleProductView = (product) => {
        if (!about) {
            setSelectedViewProduct(product);
            setOpenProductViewModal(true);
        }
    };

    const addToCartHandler = (cartItems) => {
        if (!user) {
            toast.error("Please login to add items to cart");
            return;
        }
        if (isAdmin || isSeller) {
            toast.error("Admin and Seller accounts cannot make purchases");
            return;
        }
        dispatch(addToCart(cartItems, 1, toast));
    };

    return (
        <div className="border rounded-lg shadow-xl overflow-hidden transition-shadow duration-300">
            <div onClick={() => {
                handleProductView({
                    id: productId,
                    productName,
                    image,
                    description,
                    quantity,
                    price,
                    discount,
                    specialPrice,
                })
            }} 
                    className="w-full overflow-hidden aspect-3/2">
                <img 
                className="w-full h-full cursor-pointer transition-transform duration-300 transform hover:scale-105"
                src={image}
                alt={productName}>
                </img>
            </div>
            <div className="p-4">
                <h2 onClick={() => {
                handleProductView({
                    id: productId,
                    productName,
                    image,
                    description,
                    quantity,
                    price,
                    discount,
                    specialPrice,
                })
            }}
                    className="text-lg font-semibold mb-2 cursor-pointer">
                    {truncateText(productName, 50)}
                </h2>
                
                <div className="min-h-20 max-h-20">
                    <p className="text-gray-600 text-sm">
                        {truncateText(description, 80)}
                    </p>
                </div>

                {/* Stock availability display */}
                <div className="mt-2 mb-2">
                    {isAvailable ? (
                        <p className="text-sm text-green-600 font-semibold">
                            In Stock: {quantity} units available
                        </p>
                    ) : (
                        <p className="text-sm text-red-600 font-semibold">
                            Out of Stock
                        </p>
                    )}
                </div>

            { !about && (
                <div className="flex items-center justify-between">
                {specialPrice ? (
                    <div className="flex flex-col">
                        <span className="text-gray-400 line-through">
                            ${Number(price).toFixed(2)}
                        </span>
                        <span className="text-xl font-bold text-slate-700">
                            ${Number(specialPrice).toFixed(2)}
                        </span>
                    </div>
                ) : (
                    <span className="text-xl font-bold text-slate-700">
                        {"  "}
                        ${Number(price).toFixed(2)}
                    </span>
                )}

                {(isAdmin || isSeller) ? (
                    <div className="bg-gray-400 text-white py-2 px-3 rounded-lg items-center w-36 flex justify-center cursor-not-allowed">
                        <span className="text-sm">View Only</span>
                    </div>
                ) : (
                    <button
                        disabled={!isAvailable || btnLoader}
                        onClick={() => addToCartHandler({
                            image,
                            productName,
                            description,
                            specialPrice,
                            price,
                            productId,
                            quantity,
                        })}
                        className={`bg-blue-500 ${isAvailable ? "opacity-100 hover:bg-blue-600" : "opacity-70"}
                            text-white py-2 px-3 rounded-lg items-center transition-colors duration-300 w-36 flex justify-center`}>
                        <FaShoppingCart className="mr-2"/>
                        {isAvailable ? "Add to Cart" : "Stock Out"}
                    </button>
                )}
                </div>
            )}
                
            </div>
            <ProductViewModal 
                open={openProductViewModal}
                setOpen={setOpenProductViewModal}
                product={selectedViewProduct}
                isAvailable={isAvailable}
            />
        </div>
    )
}

export default ProductCard;