import { useSelector } from "react-redux";

const AppPrice = () => {
    const price = useSelector(state => state.price.value);

    return (
        <div className="app__price">
            <span className="amount">{price}</span>
            <span className="rate">+ {(price * 0.0354).toFixed(2)} (3.54%)</span>
            <span className="unit">USD</span>
        </div>
    )
}

export default AppPrice;
