import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MdPersonAdd } from "react-icons/md";

import SellerTable from "./SellerTable";
import ErrorPage from "../../shared/ErrorPage";
import Loader from "../../shared/Loader";
import Modal from "../../shared/Modal";
import AddSellerForm from "./AddSellerForm";
import useSellerFilter from "./useSellerFilter";

const Sellers = () => {
  const [openModal, setOpenModal] = useState(false);
  const { sellers, pagination } = useSelector((state) => state.seller);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);

  // Calling the `useSellerFilter` custom hook to fetch sellers and pagination based on the current URL parameters.
  useSellerFilter();

  // Check if there are NO sellers at all in the system
  const hasNoSellersAtAll = pagination?.totalElements === 0;
  
  // Check if current page is empty but sellers exist on other pages
  const currentPageEmpty = (!sellers || sellers?.length === 0) && !hasNoSellersAtAll;

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <React.Fragment>
      <div className="pt-6 pb-10 flex justify-end">
        <button
          onClick={() => setOpenModal(true)}
          className="bg-custom-blue hover:bg-blue-800 text-white font-semibold py-2 px-4 flex items-center gap-2 rounded-md shadow-md transition-colors hover:text-slate-300 duration-300"
        >
          <MdPersonAdd className="text-xl" />
          Add Seller
        </button>
      </div>

      {!hasNoSellersAtAll && !currentPageEmpty && (
        <h1 className="text-slate-800 text-3xl text-center font-bold pb-6 uppercase">
          All Sellers
        </h1>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {hasNoSellersAtAll ? (
            <div className="flex flex-col items-center justify-center text-gray-600 py-10">
              <h2 className="text-2xl font-semibold">
                No Seller Created Yet
              </h2>
            </div>
          ) : (
            <>
              {currentPageEmpty && (
                <div className="flex flex-col items-center justify-center text-gray-500 py-6 mb-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-medium">No sellers on this page</h3>
                  <p className="text-sm mt-1">Try navigating to a different page.</p>
                </div>
              )}
              <SellerTable sellers={sellers} pagination={pagination} />
            </>
          )}
        </>
      )}

      <Modal open={openModal} setOpen={setOpenModal} title="Add New Seller">
        <AddSellerForm setOpen={setOpenModal} />
      </Modal>
    </React.Fragment>
  );
};

export default Sellers;