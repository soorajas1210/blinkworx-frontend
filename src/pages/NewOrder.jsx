import { useEffect, useState } from "react";
import { Input, Button, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { addNewOrder, getProducts } from "../api/api";
import toast from 'react-hot-toast';
import { useStore } from "../store/useStore";
import Loading from "../components/common/Loading";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const NewOrder = () => {
    const navigate = useNavigate()
    const [orderDescription, setOrderDescription] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [productList, setProductList] = useState([])
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { setCartCount } = useStore()

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const data = await getProducts();
            setProductList(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);
    useEffect(() => {
        setCartCount(selectedItems?.length)
    }, [selectedItems, setCartCount])

    const handleCheckboxChange = (id) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );

    };
    const cancelButtonHandler = () => {
        setCartCount(0)
        navigate('/')
    }
    const handleSubmit = async () => {
        if (!orderDescription || orderDescription?.length < 4) {
            toast('Description (Min 4 chars required)')
            return;
        }
        if (selectedItems.length === 0) {
            toast('Please select products before submit')
            return;
        }

        try {
            setIsSubmitting(true)
            const response = await addNewOrder(orderDescription, selectedItems)
            if (response.status == 201) {
                setCartCount(0)
                navigate('/')
            }
        } catch (error) {
            console.error(error.message)
        } finally {
            setIsSubmitting(false)
        }

    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-slate-50 border border-slate-100 shadow-lg rounded-xl">
            <h2 className="md:text-2xl text-xl text-gray-700 font-bold mb-4">New Order</h2>
            <div className="mb-4">
                <Input
                    placeholder="Order Description"
                    value={orderDescription}
                    onChange={(e) => setOrderDescription(e.target.value)}
                    required
                />
            </div>
            <div className="mb-4 max-h-96 overflow-auto min-h-40">
                {productList?.length > 0 ? productList?.map((item) => (
                    <div
                        key={item.id}
                        className={`p-3 border border-slate-300 rounded-lg mb-2 flex items-center gap-2 ${selectedItems?.includes(item.id) ? "bg-blue-200" : ""}`}
                    >
                        <Checkbox
                            checked={selectedItems?.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                        />
                        <div>
                            <p className="font-bold text-green-700">{item.productname}</p>
                            <p className="text-gray-600">{item.productdescription}</p>
                        </div>
                    </div>
                )) :
                    <div className="flex justify-center h-full w-full items-center">
                        {loading ? <Loading /> : <p className="text-sm text-gray-600">No products available to add</p>}
                    </div>
                }
            </div>
            <div className="flex gap-4">
                <Button type="primary" danger onClick={cancelButtonHandler}>
                    Cancel
                </Button>
                <Button type="primary" onClick={handleSubmit} disabled={isSubmitting} >
                    {!isSubmitting ? <span>Book Order</span> : <span><AiOutlineLoading3Quarters className="mx-6 animate-spin text-amber-500" /></span>}
                </Button>

            </div>
        </div>
    );
};

export default NewOrder;
