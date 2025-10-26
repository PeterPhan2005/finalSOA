import { useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaUserShield, FaShoppingBag, FaHome } from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    
    const isAdmin = user && user?.roles?.includes("ROLE_ADMIN");
    const isSeller = user && user?.roles?.includes("ROLE_SELLER");
    const isRegularUser = user && !isAdmin && !isSeller;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
                    <div className="px-6 pb-6">
                        <div className="flex items-center -mt-16">
                            <div className="h-32 w-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                <FaUser className="text-6xl text-gray-400" />
                            </div>
                            <div className="ml-6 mt-16">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {user?.username || 'User'}
                                </h1>
                                <div className="flex items-center gap-2 mt-2">
                                    {isAdmin && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                                            <MdAdminPanelSettings className="mr-1" />
                                            Admin
                                        </span>
                                    )}
                                    {isSeller && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                            <FaUserShield className="mr-1" />
                                            Seller
                                        </span>
                                    )}
                                    {isRegularUser && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                            <FaUser className="mr-1" />
                                            Customer
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <FaUser className="text-gray-400 text-xl mr-4" />
                            <div>
                                <p className="text-sm text-gray-500">Username</p>
                                <p className="text-lg font-semibold text-gray-900">{user?.username}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <FaEnvelope className="text-gray-400 text-xl mr-4" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-lg font-semibold text-gray-900">{user?.email || 'Not provided'}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <FaUserShield className="text-gray-400 text-xl mr-4" />
                            <div>
                                <p className="text-sm text-gray-500">Account Type</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {isAdmin ? 'Administrator' : isSeller ? 'Seller Account' : 'Customer Account'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Home */}
                        <Link
                            to="/"
                            className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            <FaHome className="text-2xl mr-4" />
                            <div>
                                <p className="font-semibold text-lg">Home</p>
                                <p className="text-sm text-blue-100">Back to homepage</p>
                            </div>
                        </Link>

                        {/* Orders - Only for regular users */}
                        {isRegularUser && (
                            <Link
                                to="/profile/orders"
                                className="flex items-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <FaShoppingBag className="text-2xl mr-4" />
                                <div>
                                    <p className="font-semibold text-lg">My Orders</p>
                                    <p className="text-sm text-green-100">View order history</p>
                                </div>
                            </Link>
                        )}

                        {/* Admin/Seller Panel */}
                        {(isAdmin || isSeller) && (
                            <Link
                                to={isAdmin ? "/admin" : "/admin/orders"}
                                className="flex items-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <MdAdminPanelSettings className="text-2xl mr-4" />
                                <div>
                                    <p className="font-semibold text-lg">
                                        {isAdmin ? 'Admin Panel' : 'Seller Panel'}
                                    </p>
                                    <p className="text-sm text-purple-100">
                                        {isAdmin ? 'Manage the platform' : 'Manage your products'}
                                    </p>
                                </div>
                            </Link>
                        )}

                        {/* Products */}
                        <Link
                            to="/products"
                            className="flex items-center p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            <FaShoppingBag className="text-2xl mr-4" />
                            <div>
                                <p className="font-semibold text-lg">Browse Products</p>
                                <p className="text-sm text-orange-100">
                                    {isRegularUser ? 'Start shopping' : 'View products'}
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
