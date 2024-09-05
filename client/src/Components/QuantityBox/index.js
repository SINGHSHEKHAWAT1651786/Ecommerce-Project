// Import necessary icons and components
import { FaMinus } from "react-icons/fa6"; // Minus icon
import { FaPlus } from "react-icons/fa6"; // Plus icon
import Button from '@mui/material/Button'; // Material-UI Button component
import { useContext, useEffect, useState } from "react"; // React hooks
import { MyContext } from "../../App"; // Context for global state management

const QuantityBox = (props) => {

    // State to manage the input value, initialized to 1
    const [inputVal, setInputVal] = useState(1);

    // Access the global context
    const context = useContext(MyContext);

    // Effect to update inputVal when props.value changes
    useEffect(() => {
        if (props?.value !== undefined && props?.value !== null && props?.value !== "") {
            setInputVal(parseInt(props?.value)); // Set the input value from props
        }
    }, [props.value]); // Dependency array to run effect when props.value changes

    // Handler for decreasing the quantity
    const minus = () => {
        if (inputVal !== 1 && inputVal > 0) {
            setInputVal(inputVal - 1); // Decrease quantity if greater than 1
        }
        context.setAlertBox({ open: false }); // Close any alert box
    }

    // Handler for increasing the quantity
    const plus = () => {
        let stock = parseInt(props.item.countInStock); // Get the stock count
        if (inputVal < stock) {
            setInputVal(inputVal + 1); // Increase quantity if less than stock
        } else {
            context.setAlertBox({
                open: true, // Show alert box
                error: true, // Set as an error
                msg: "The quantity is greater than product count in stock" // Alert message
            });
        }
    }

    // Effect to call props.quantity and props.selectedItem when inputVal changes
    useEffect(() => {
        if (props.quantity) {
            props.quantity(inputVal); // Pass the current quantity to the parent component
        }

        if (props.selectedItem) {
            props.selectedItem(props.item, inputVal); // Pass the item and quantity to the parent component
        }
    }, [inputVal]); // Dependency array to run effect when inputVal changes

    return (
        <div className='quantityDrop d-flex align-items-center'>
            <Button onClick={minus}><FaMinus /></Button> {/* Decrease quantity */}
            <input type="text" value={inputVal} readOnly /> {/* Display current quantity */}
            <Button onClick={plus}><FaPlus /></Button> {/* Increase quantity */}
        </div>
    )
}

export default QuantityBox;
