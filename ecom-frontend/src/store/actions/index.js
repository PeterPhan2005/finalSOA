import api from "../../api/api"

export const fetchProducts = (queryString) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/public/products?${queryString}`);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch products",
         });
    }
};


export const fetchCategories = () => async (dispatch) => {
    try {
        dispatch({ type: "CATEGORY_LOADER" });
        const { data } = await api.get(`/public/categories`);
        dispatch({
            type: "FETCH_CATEGORIES",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_ERROR" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch categories",
         });
    }
};


export const addToCart = (data, qty = 1, toast) => 
    async (dispatch, getState) => {
        const { user } = getState().auth;
        const { cart } = getState().carts;
        
        // Find the product
        const { products } = getState().products;
        const getProduct = products.find(
            (item) => item.productId === data.productId
        );

        // Check if product already exists in cart
        const existingCartItem = cart.find(item => item.productId === data.productId);
        const currentQuantityInCart = existingCartItem ? existingCartItem.quantity : 0;
        const newTotalQuantity = currentQuantityInCart + qty;

        // Check if there's enough stock for the new total quantity
        if (getProduct.quantity < newTotalQuantity) {
            toast.error(`Only ${getProduct.quantity} items available in stock`);
            return;
        }

        // If user is logged in, sync with server
        if (user && user.id) {
            try {
                await api.post(`/carts/products/${data.productId}/quantity/${qty}`);
                // Reload cart from server
                await dispatch(getUserCart());
                toast.success(`${data?.productName} added to the cart`);
            } catch (error) {
                console.log(error);
                toast.error("Failed to add to cart");
            }
        } else {
            // If not logged in, only add to local state
            dispatch({ type: "ADD_CART", payload: {...data, quantity: newTotalQuantity}});
            toast.success(`${data?.productName} added to the cart`);
            localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        }
};


export const increaseCartQuantity = 
    (data, toast) =>
    async (dispatch, getState) => {
        const { user } = getState().auth;
        
        // If user is logged in, sync with server
        if (user && user.id) {
            try {
                await api.put(`/cart/products/${data.productId}/quantity/increase`);
                await dispatch(getUserCart());
            } catch (error) {
                console.log(error);
                toast.error("Failed to update cart");
            }
        } else {
            // Find the product for local cart
            const { products } = getState().products;
            const { cart } = getState().carts;
            
            const getProduct = products.find(
                (item) => item.productId === data.productId
            );

            // Find current quantity in cart
            const cartItem = cart.find(item => item.productId === data.productId);
            const currentQuantity = cartItem ? cartItem.quantity : 0;

            const isQuantityExist = getProduct && getProduct.quantity >= currentQuantity + 1;

            if (isQuantityExist) {
                const newQuantity = currentQuantity + 1;

                dispatch({
                    type: "ADD_CART",
                    payload: {...data, quantity: newQuantity },
                });
                localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
            } else {
                toast.error("Quantity Reached to Limit");
            }
        }
    };



export const decreaseCartQuantity = 
    (data, newQuantity) => async (dispatch, getState) => {
        const { user } = getState().auth;
        
        // If user is logged in, sync with server
        if (user && user.id) {
            try {
                await api.put(`/cart/products/${data.productId}/quantity/decrease`);
                await dispatch(getUserCart());
            } catch (error) {
                console.log(error);
            }
        } else {
            dispatch({
                type: "ADD_CART",
                payload: {...data, quantity: newQuantity},
            });
            localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        }
    }

export const updateCartQuantity = 
    (data, newQuantity, toast) => async (dispatch, getState) => {
        const { user } = getState().auth;
        const { products } = getState().products;
        
        console.log('updateCartQuantity called with:', { productId: data.productId, newQuantity });
        
        // Find the product to check stock
        const getProduct = products.find(
            (item) => item.productId === data.productId
        );

        // Check if quantity is valid
        if (!getProduct || newQuantity < 1) {
            toast.error("Invalid quantity");
            await dispatch(getUserCart()); // Reload to reset
            return;
        }

        // Check stock availability
        if (getProduct.quantity < newQuantity) {
            toast.error(`Only ${getProduct.quantity} items available in stock`);
            await dispatch(getUserCart()); // Reload to reset
            return;
        }
        
        // If user is logged in, sync with server
        if (user && user.id) {
            try {
                console.log('Calling API: /cart/products/' + data.productId + '/set-quantity/' + newQuantity);
                const response = await api.put(`/cart/products/${data.productId}/set-quantity/${newQuantity}`);
                console.log('API Response:', response.data);
                await dispatch(getUserCart());
            } catch (error) {
                console.log('API Error:', error);
                toast.error("Failed to update quantity");
                await dispatch(getUserCart()); // Reload to reset
            }
        } else {
            dispatch({
                type: "ADD_CART",
                payload: {...data, quantity: newQuantity},
            });
            localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
        }
    }

export const removeFromCart = (data, toast) => async (dispatch, getState) => {
    const { user } = getState().auth;
    
    // If user is logged in, sync with server
    if (user && user.id) {
        try {
            const { cartId } = getState().carts;
            await api.delete(`/carts/${cartId}/product/${data.productId}`);
            await dispatch(getUserCart());
            toast.success(`${data.productName} removed from cart`);
        } catch (error) {
            console.log(error);
            toast.error("Failed to remove from cart");
        }
    } else {
        dispatch({type: "REMOVE_CART", payload: data });
        toast.success(`${data.productName} removed from cart`);
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
    }
}



export const authenticateSignInUser 
    = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
        try {
            setLoader(true);
            const { data } = await api.post("/auth/signin", sendData);
            console.log("=== LOGIN RESPONSE ===");
            console.log("Full response data:", JSON.stringify(data, null, 2));
            console.log("data.jwtToken:", data.jwtToken);
            
            // CRITICAL STEP 1: Save to localStorage FIRST
            localStorage.setItem("auth", JSON.stringify(data));
            console.log("Auth saved to localStorage BEFORE dispatch");
            
            // CRITICAL STEP 2: Dispatch to Redux store
            dispatch({ type: "LOGIN_USER", payload: data });
            console.log("User dispatched to Redux store");
            
            // CRITICAL STEP 3: Verify localStorage
            const savedAuth = localStorage.getItem("auth");
            console.log("Verify - auth in localStorage:", savedAuth ? 'exists' : 'missing');
            if (savedAuth) {
                const parsed = JSON.parse(savedAuth);
                console.log("Verify - parsed auth has jwtToken:", !!parsed.jwtToken);
            }
            
            // CRITICAL STEP 4: Wait to ensure everything is ready
            await new Promise(resolve => setTimeout(resolve, 150));
            
            // CRITICAL STEP 5: Load user's cart from server after login
            try {
                console.log("Now loading cart with fresh token...");
                await dispatch(getUserCart());
                console.log("Cart loaded successfully");
            } catch (cartError) {
                console.log("Error loading cart:", cartError);
                // If cart doesn't exist or error, clear local cart
                dispatch({ type: "CLEAR_CART" });
                localStorage.removeItem("cartItems");
            }
            
            reset();
            toast.success("Login Success");
            
            // CRITICAL STEP 6: Navigate after everything is set up
            setTimeout(() => {
                navigate("/");
            }, 100);
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Internal Server Error");
        } finally {
            setLoader(false);
        }
}


export const registerNewUser 
    = (sendData, toast, reset, navigate, setLoader) => async (dispatch) => {
        try {
            setLoader(true);
            const { data } = await api.post("/auth/signup", sendData);
            reset();
            toast.success(data?.message || "User Registered Successfully");
            navigate("/login");
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.response?.data?.password || "Internal Server Error");
        } finally {
            setLoader(false);
        }
};


export const logOutUser = (navigate) => (dispatch) => {
    dispatch({ type:"LOG_OUT" });
    localStorage.removeItem("auth");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("CHECKOUT_ADDRESS");
    localStorage.removeItem("client-secret");
    navigate("/login");
};

export const addUpdateUserAddress =
     (sendData, toast, addressId, setOpenAddressModal) => async (dispatch, getState) => {
    console.log("=== ADD/UPDATE ADDRESS ACTION CALLED ===");
    console.log("Address ID:", addressId);
    console.log("Send Data:", sendData);
    
    // Check if auth exists
    const auth = localStorage.getItem("auth");
    console.log("Auth in localStorage:", auth ? "exists" : "missing");
    if (auth) {
        const parsedAuth = JSON.parse(auth);
        console.log("Has JWT token:", !!parsedAuth.jwtToken);
        console.log("JWT token length:", parsedAuth.jwtToken?.length);
    }
    
    dispatch({ type:"BUTTON_LOADER" });
    try {
        if (!addressId) {
            console.log("Creating new address...");
            const { data } = await api.post("/addresses", sendData);
            console.log("Address created successfully:", data);
        } else {
            console.log("Updating address with ID:", addressId);
            await api.put(`/addresses/${addressId}`, sendData);
            console.log("Address updated successfully");
        }
        dispatch(getUserAddresses());
        toast.success("Address saved successfully");
        dispatch({ type:"IS_SUCCESS" });
    } catch (error) {
        console.error("=== ADD/UPDATE ADDRESS ERROR ===");
        console.error("Error status:", error?.response?.status);
        console.error("Error message:", error?.response?.data?.message);
        console.error("Full error:", error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
        dispatch({ type:"IS_ERROR", payload: null });
    } finally {
        setOpenAddressModal(false);
    }
};


export const deleteUserAddress = 
    (toast, addressId, setOpenDeleteModal) => async (dispatch, getState) => {
    try {
        dispatch({ type: "BUTTON_LOADER" });
        await api.delete(`/addresses/${addressId}`);
        dispatch({ type: "IS_SUCCESS" });
        dispatch(getUserAddresses());
        dispatch(clearCheckoutAddress());
        toast.success("Address deleted successfully");
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Some Error Occured",
         });
    } finally {
        setOpenDeleteModal(false);
    }
};

export const clearCheckoutAddress = () => {
    return {
        type: "REMOVE_CHECKOUT_ADDRESS",
    }
};

export const getUserAddresses = () => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/users/addresses`);
        dispatch({type: "USER_ADDRESS", payload: data});
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch user addresses",
         });
    }
};

export const selectUserCheckoutAddress = (address) => {
    localStorage.setItem("CHECKOUT_ADDRESS", JSON.stringify(address));
    
    return {
        type: "SELECT_CHECKOUT_ADDRESS",
        payload: address,
    }
};


export const addPaymentMethod = (method) => {
    return {
        type: "ADD_PAYMENT_METHOD",
        payload: method,
    }
};


export const createUserCart = (sendCartItems) => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        await api.post('/cart/create', sendCartItems);
        await dispatch(getUserCart());
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to create cart items",
         });
    }
};


export const getUserCart = () => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get('/carts/users/cart');
        
        dispatch({
            type: "GET_USER_CART_PRODUCTS",
            payload: data.products,
            totalPrice: data.totalPrice,
            cartId: data.cartId
        })
        // Update localStorage after getting cart from server
        localStorage.setItem("cartItems", JSON.stringify(data.products));
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch cart items",
         });
    }
};


export const createStripePaymentSecret 
    = (sendData) => async (dispatch, getState) => {
        try {
            dispatch({ type: "IS_FETCHING" });
            const { data } = await api.post("/order/stripe-client-secret", sendData);
            dispatch({ type: "CLIENT_SECRET", payload: data });
              localStorage.setItem("client-secret", JSON.stringify(data));
              dispatch({ type: "IS_SUCCESS" });
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to create client secret");
        }
};


export const stripePaymentConfirmation 
    = (sendData, setErrorMesssage, setLoadng, toast) => async (dispatch, getState) => {
        try {
            const response  = await api.post("/order/users/payments/online", sendData);
            if (response.data) {
                localStorage.removeItem("CHECKOUT_ADDRESS");
                localStorage.removeItem("cartItems");
                localStorage.removeItem("client-secret");
                dispatch({ type: "REMOVE_CLIENT_SECRET_ADDRESS"});
                dispatch({ type: "CLEAR_CART"});
                toast.success("Order Accepted");
              } else {
                setErrorMesssage("Payment Failed. Please try again.");
              }
        } catch (error) {
            setErrorMesssage("Payment Failed. Please try again.");
        }
};


export const placeCODOrder = (sendData, toast, navigate) => async (dispatch, getState) => {
    try {
        console.log("=== PLACE COD ORDER ===");
        console.log("Sending COD order request with data:", sendData);
        console.log("Current user:", getState().auth.user);
        
        // Check localStorage
        const authData = localStorage.getItem("auth");
        console.log("Auth in localStorage:", authData ? 'exists' : 'missing');
        if (authData) {
            const parsed = JSON.parse(authData);
            console.log("Auth data:", {
                hasJwtToken: !!parsed.jwtToken,
                username: parsed.username,
                tokenLength: parsed.jwtToken?.length
            });
        }
        
        const response = await api.post("/order/users/payments/cod", sendData);
        console.log("COD order response:", response.data);
        if (response.data) {
            localStorage.removeItem("CHECKOUT_ADDRESS");
            localStorage.removeItem("cartItems");
            dispatch({ type: "REMOVE_CLIENT_SECRET_ADDRESS"});
            dispatch({ type: "CLEAR_CART"});
            toast.success("Order placed successfully! You will pay on delivery.");
            // Navigate to success page
            navigate('/order-success');
        } else {
            toast.error("Failed to place order. Please try again.");
        }
    } catch (error) {
        console.log("COD order error:", error);
        console.log("Error response:", error?.response);
        console.log("Error response data:", error?.response?.data);
        toast.error(error?.response?.data?.message || "Failed to place order. Please try again.");
    }
};

export const placeVNPayOrder = (sendData, toast, navigate, setLoading) => async (dispatch, getState) => {
    try {
        console.log("=== PLACE VNPAY ORDER ===");
        console.log("Sending VNPay order request with data:", sendData);
        
        const response = await api.post("/payment/vnpay/create", sendData);
        console.log("VNPay order response:", response.data);
        
        if (response.data && response.data.paymentUrl) {
            // Clear cart and checkout data
            localStorage.removeItem("CHECKOUT_ADDRESS");
            localStorage.removeItem("cartItems");
            dispatch({ type: "REMOVE_CLIENT_SECRET_ADDRESS"});
            dispatch({ type: "CLEAR_CART"});
            
            toast.success("Redirecting to VNPay payment gateway...");
            
            // Redirect to VNPay payment URL
            window.location.href = response.data.paymentUrl;
        } else {
            toast.error("Failed to create payment. Please try again.");
            setLoading(false);
        }
    } catch (error) {
        console.log("VNPay order error:", error);
        console.log("Error response:", error?.response);
        toast.error(error?.response?.data?.error || "Failed to create payment. Please try again.");
        setLoading(false);
    }
};

export const analyticsAction = () => async (dispatch, getState) => {
        try {
            dispatch({ type: "IS_FETCHING"});
            const { data } = await api.get('/admin/app/analytics');
            dispatch({
                type: "FETCH_ANALYTICS",
                payload: data,
            })
            dispatch({ type: "IS_SUCCESS"});
        } catch (error) {
            dispatch({ 
                type: "IS_ERROR",
                payload: error?.response?.data?.message || "Failed to fetch analytics data",
            });
        }
};

export const getUserOrders = (pageNumber = 0, pageSize = 10) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/users/orders?pageNumber=${pageNumber}&pageSize=${pageSize}`);
        dispatch({
            type: "GET_USER_ORDERS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch your orders",
         });
    }
};

export const getOrdersForDashboard = (queryString, isAdmin) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const endpoint = isAdmin ? "/admin/orders" : "/seller/orders";
        const { data } = await api.get(`${endpoint}?${queryString}`);
        dispatch({
            type: "GET_ADMIN_ORDERS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch orders data",
         });
    }
};



export const updateOrderStatusFromDashboard =
     (orderId, orderStatus, toast, setLoader, isAdmin) => async (dispatch, getState) => {
    try {
        setLoader(true);
        const endpoint = isAdmin ? "/admin/orders/" : "/seller/orders/";
        const { data } = await api.put(`${endpoint}${orderId}/status`, { status: orderStatus});
        toast.success(data.message || "Order updated successfully");
        
        // Get current query string from URL
        const currentUrl = new URLSearchParams(window.location.search);
        const queryString = currentUrl.toString() || 'pageNumber=0&pageSize=10&sortBy=orderId&sortOrder=asc';
        await dispatch(getOrdersForDashboard(queryString, isAdmin));
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
    } finally {
        setLoader(false)
    }
};


export const dashboardProductsAction = (queryString, isAdmin) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const endpoint = isAdmin ? "/admin/products" : "/seller/products";
        const { data } = await api.get(`${endpoint}?${queryString}`);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch dashboard products",
         });
    }
};


export const updateProductFromDashboard = 
    (sendData, toast, reset, setLoader, setOpen, isAdmin) => async (dispatch, getState) => {
    try {
        setLoader(true);
        const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
        await api.put(`${endpoint}${sendData.id}`, sendData);
        toast.success("Product update successful");
        reset();
        setLoader(false);
        setOpen(false);
        
        // Get current query string from URL to maintain pagination/filters
        const currentUrl = new URLSearchParams(window.location.search);
        const queryString = currentUrl.toString() || 'pageNumber=0&pageSize=10&sortBy=productId&sortOrder=asc';
        await dispatch(dashboardProductsAction(queryString, isAdmin));
    } catch (error) {
        setLoader(false);
        toast.error(error?.response?.data?.description || "Product update failed");
    }
};



export const addNewProductFromDashboard = 
    (sendData, toast, reset, setLoader, setOpen, isAdmin) => async(dispatch, getState) => {
        try {
            setLoader(true);
            const endpoint = isAdmin ? "/admin/categories/" : "/seller/categories/";
            await api.post(`${endpoint}${sendData.categoryId}/product`,
                sendData
            );
            toast.success("Product created successfully");
            reset();
            setOpen(false);
            
            // Get current query string from URL to maintain pagination/filters
            const currentUrl = new URLSearchParams(window.location.search);
            const queryString = currentUrl.toString() || 'pageNumber=0&pageSize=10&sortBy=productId&sortOrder=asc';
            await dispatch(dashboardProductsAction(queryString, isAdmin));
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.description || "Product creation failed");
        } finally {
            setLoader(false);
        }
    }

export const deleteProduct = 
    (setLoader, productId, toast, setOpenDeleteModal, isAdmin) => async (dispatch, getState) => {
    try {
        setLoader(true)
        const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
        await api.delete(`${endpoint}${productId}`);
        toast.success("Product deleted successfully");
        setLoader(false);
        setOpenDeleteModal(false);
        
        // Get current query string from URL to maintain pagination/filters
        const currentUrl = new URLSearchParams(window.location.search);
        const queryString = currentUrl.toString() || 'pageNumber=0&pageSize=10&sortBy=productId&sortOrder=asc';
        await dispatch(dashboardProductsAction(queryString, isAdmin));
    } catch (error) {
        console.log(error);
        setLoader(false);
        toast.error(
            error?.response?.data?.description || error?.response?.data?.message || "Product deletion failed"
        )
    }
};


export const updateProductImageFromDashboard = 
    (formData, productId, toast, setLoader, setOpen, isAdmin) => async (dispatch, getState) => {
    try {
        setLoader(true);
        const endpoint = isAdmin ? "/admin/products/" : "/seller/products/";
        await api.put(`${endpoint}${productId}/image`, formData);
        toast.success("Image upload successful");
        setLoader(false);
        setOpen(false);
        
        // Get current query string from URL to maintain pagination/filters
        const currentUrl = new URLSearchParams(window.location.search);
        const queryString = currentUrl.toString() || 'pageNumber=0&pageSize=10&sortBy=productId&sortOrder=asc';
        await dispatch(dashboardProductsAction(queryString, isAdmin));
    } catch (error) {
        setLoader(false);
        toast.error(error?.response?.data?.description || "Product Image upload failed");
    }
};

export const getAllCategoriesDashboard = (queryString) => async (dispatch) => {
  dispatch({ type: "CATEGORY_LOADER" });
  try {
    const { data } = await api.get(`/public/categories?${queryString}`);
    dispatch({
      type: "FETCH_CATEGORIES",
      payload: data["content"],
      pageNumber: data["pageNumber"],
      pageSize: data["pageSize"],
      totalElements: data["totalElements"],
      totalPages: data["totalPages"],
      lastPage: data["lastPage"],
    });

    dispatch({ type: "CATEGORY_SUCCESS" });
  } catch (err) {
    console.log(err);

    dispatch({
      type: "IS_ERROR",
      payload: err?.response?.data?.message || "Failed to fetch categories",
    });
  }
};

export const createCategoryDashboardAction =
  (sendData, setOpen, reset, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });
      await api.post("/admin/categories", sendData);
      dispatch({ type: "CATEGORY_SUCCESS" });
      reset();
      toast.success("Category Created Successful");
      setOpen(false);
      
      // Get current query string from URL
      const currentUrl = new URLSearchParams(window.location.search);
      const queryString = currentUrl.toString() || 'pageNumber=0&pageSize=10&sortBy=categoryId&sortOrder=asc';
      await dispatch(getAllCategoriesDashboard(queryString));
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.categoryName || "Failed to create new category"
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

export const updateCategoryDashboardAction =
  (sendData, setOpen, categoryID, reset, toast) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.put(`/admin/categories/${categoryID}`, sendData);

      dispatch({ type: "CATEGORY_SUCCESS" });

      reset();
      toast.success("Category Update Successful");
      setOpen(false);
      
      // Get current query string from URL
      const currentUrl = new URLSearchParams(window.location.search);
      const queryString = currentUrl.toString() || 'pageNumber=0&pageSize=10&sortBy=categoryId&sortOrder=asc';
      await dispatch(getAllCategoriesDashboard(queryString));
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.categoryName || "Failed to update category"
      );

      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };

export const deleteCategoryDashboardAction =
  (setOpen, categoryID, toast) => async (dispatch, getState) => {
    try {
      dispatch({ type: "CATEGORY_LOADER" });

      await api.delete(`/admin/categories/${categoryID}`);

      dispatch({ type: "CATEGORY_SUCCESS" });

      toast.success("Category Delete Successful");
      setOpen(false);
      
      // Get current query string from URL
      const currentUrl = new URLSearchParams(window.location.search);
      const queryString = currentUrl.toString() || 'pageNumber=0&pageSize=10&sortBy=categoryId&sortOrder=asc';
      await dispatch(getAllCategoriesDashboard(queryString));
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to delete category");
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Internal Server Error",
      });
    }
  };


  export const getAllSellersDashboard =
  (queryString) => async (dispatch, getState) => {
    const { user } = getState().auth;
    try {
      dispatch({ type: "IS_FETCHING" });
      const { data } = await api.get(`/auth/sellers?${queryString}`);
      dispatch({
        type: "GET_SELLERS",
        payload: data["content"],
        pageNumber: data["pageNumber"],
        pageSize: data["pageSize"],
        totalElements: data["totalElements"],
        totalPages: data["totalPages"],
        lastPage: data["lastPage"],
      });

      dispatch({ type: "IS_SUCCESS" });
    } catch (err) {
      console.log(err);
      dispatch({
        type: "IS_ERROR",
        payload: err?.response?.data?.message || "Failed to fetch sellers data",
      });
    }
  };

export const addNewDashboardSeller =
  (sendData, toast, reset, setOpen, setLoader) => async (dispatch) => {
    try {
      setLoader(true);
      await api.post("/auth/signup", sendData);
      reset();
      toast.success("Seller registered successfully!");

      // Get current query string from URL
      const currentUrl = new URLSearchParams(window.location.search);
      const queryString = currentUrl.toString() || 'pageNumber=0&pageSize=10&sortBy=userId&sortOrder=asc';
      await dispatch(getAllSellersDashboard(queryString));
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.password ||
          "Internal Server Error"
      );
    } finally {
      setLoader(false);
      setOpen(false);
    }
  };