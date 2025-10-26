import React, { useEffect } from 'react'
import './App.css'
import Products from './components/products/Products'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/home/Home'
import Navbar from './components/shared/Navbar'
import About from './components/About'
import Contact from './components/Contact'
import { Toaster } from 'react-hot-toast'
import Cart from './components/cart/Cart'
import LogIn from './components/auth/LogIn'
import PrivateRoute from './components/PrivateRoute'
import Register from './components/auth/Register'
import Checkout from './components/checkout/Checkout'
import OrderSuccess from './components/checkout/OrderSuccess'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './components/admin/dashboard/Dashboard'
import AdminProducts from './components/admin/products/AdminProducts'
import Sellers from './components/admin/sellers/Sellers'
import Category from './components/admin/categories/Category'
import Orders from './components/admin/orders/Orders'
import { useDispatch, useSelector } from 'react-redux'
import { getUserCart } from './store/actions'
import UserOrders from './components/profile/UserOrders'
import Profile from './components/profile/Profile'

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart || { cart: [] });

  // Only load cart from server if user is logged in AND cart is empty
  // This prevents duplicate calls after login (login action already loads cart)
  useEffect(() => {
    const shouldLoadCart = user && user.id && (!cart || cart.length === 0);
    
    if (shouldLoadCart) {
      // Add delay to ensure token is ready
      const timer = setTimeout(() => {
        console.log("App.jsx - Loading cart for logged-in user");
        dispatch(getUserCart()).catch((error) => {
          console.log("App.jsx - Error loading cart:", error);
          // If error loading cart, clear it
          dispatch({ type: "CLEAR_CART" });
          localStorage.removeItem("cartItems");
        });
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [user?.id, dispatch, cart?.length]);

  return (
    <React.Fragment>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={ <Home />}/>
          <Route path='/products' element={ <Products />}/>
          <Route path='/about' element={ <About />}/>
          <Route path='/contact' element={ <Contact />}/>
          <Route path='/cart' element={ <Cart />}/>
        
          <Route path='/' element={<PrivateRoute />}>
            <Route path='/checkout' element={ <Checkout />}/>
            <Route path='/order-success' element={ <OrderSuccess />}/>
            <Route path='/profile' element={ <Profile />}/>
            <Route path='/profile/orders' element={ <UserOrders />}/>
          </Route>

          <Route path='/' element={<PrivateRoute publicPage />}>
            <Route path='/login' element={ <LogIn />}/>
            <Route path='/register' element={ <Register />}/>
          </Route>

           <Route path='/' element={<PrivateRoute adminOnly />}>
            <Route path='/admin' element={ <AdminLayout />}>
              <Route path='' element={<Dashboard />} />
              <Route path='products' element={<AdminProducts />} />
              <Route path='sellers' element={<Sellers />} />
              <Route path='orders' element={<Orders />} />
              <Route path='categories' element={<Category />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <Toaster position='bottom-center'/>
    </React.Fragment>
  )
}

export default App
