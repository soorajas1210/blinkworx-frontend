import { useEffect, useState } from "react";
import { Input, Button, Checkbox } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById, getProducts, updateOrderById } from "../api/api";
import toast from 'react-hot-toast';
import { useStore } from "../store/useStore";
import { formatDate } from "../utils/functions.js";
import Loading from "../components/common/Loading.jsx";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


const EditOrder = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const [orderDescription, setOrderDescription] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [productList, setProductList] = useState([])
    const [orederData, setOrderData] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
    const { setCartCount } = useStore()

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const data = await getProducts();
            setProductList(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false)
        }
    };

    const fetchOrderById = async () => {
        try {
            const data = await getOrderById(id);
            setOrderData(data);
            setOrderDescription(data?.orderDescription)
            const productIds = data?.products?.map(product => product.productid)
            setSelectedItems(productIds)
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchOrderById()
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
            const response = await updateOrderById(id, orderDescription, selectedItems)
            if (response.status == 200) {
                setCartCount(0)
                navigate('/')
            }
        } catch (error) {
            console.log(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-slate-50 border border-slate-100 shadow-lg rounded-xl">
            <div className="flex md:flex-row flex-col  justify-between md:items-center mb-4">

                <h2 className="md:text-2xl text-xl text-gray-700 font-bold mb-1 ">Edit Order</h2>
                <div>
                    <p className="font-semibold text-gray-600">Ordered Date : <span className="font-normal">{orederData?.createdAt && formatDate(orederData?.createdAt)}</span>
                    </p>
                </div>
            </div>
            <div className="mb-4">
                <Input
                    placeholder="Order Description"
                    value={orderDescription}
                    onChange={(e) => setOrderDescription(e.target.value)}
                    required
                />
            </div>
            <div className="mb-4 max-h-96 overflow-x-auto">
                {productList.length > 0 ? productList?.map((item) => (
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
                    </div>}
            </div>
            <div className="flex gap-4">
                <Button type="primary" danger onClick={cancelButtonHandler} >
                    Cancel
                </Button>

                <Button type="primary" onClick={handleSubmit} disabled={isSubmitting} >
                    {!isSubmitting ? <span>Edit Order</span> : <span><AiOutlineLoading3Quarters className="mx-6 animate-spin text-amber-500" /></span>}
                </Button>

            </div>
        </div>
    );
};

export default EditOrder;
