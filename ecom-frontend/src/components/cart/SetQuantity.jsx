const btnStyles = "border-[1.2px] border-slate-800 px-3 py-1 rounded-sm hover:bg-slate-100 transition-colors";
const SetQuantity = ({
    quantity,
    cardCounter,
    handeQtyIncrease,
    handleQtyDecrease,
}) => {
   return (
   <div className="flex gap-8 items-center">
        {cardCounter ? null : <div className="font-semibold">QUANTITY</div>}
        <div className="flex md:flex-row flex-col gap-2 items-center lg:text-[22px] text-sm">
            <button
                disabled={quantity<=1}
                className={`${btnStyles} ${quantity<=1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleQtyDecrease}>
                -
            </button>
            <div className="w-16 text-center border-[1.2px] border-slate-300 rounded-sm py-1 text-slate-800 font-semibold">
                {quantity}
            </div>
            <button
                className={btnStyles}
                onClick={handeQtyIncrease}>
                +
            </button>
        </div>
    </div>
   );
};

export default SetQuantity;