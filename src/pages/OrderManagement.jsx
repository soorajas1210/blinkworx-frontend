import { useEffect, useState } from "react";
import { Table, Input, Button } from "antd";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { deleteOrderById, getOrders } from "../api/api";
import { formatDate } from "../utils/functions";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const OrderManagement = () => {
    const navigate = useNavigate()
    const [searchText, setSearchText] = useState("");
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data)
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders?.filter(
        (order) =>
            order.orderdescription.toLowerCase().includes(searchText.toLowerCase()) ||
            order.orderid.toString().includes(searchText)
    );


    const deleteOrderHanndler = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, delete order ${id}!`
        })

        if (!result.isConfirmed) return;
        try {
            const response = await deleteOrderById(id)
            if (response.status === 200) {
                toast.success(response?.data?.message)
                fetchOrders()
            } else {
                toast.error("Error deleting order")
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }

    }

    const columns = [
        { title: "Order ID", dataIndex: "orderid", key: "orderid" },
        { title: "Order Description", dataIndex: "orderdescription", key: "orderdescription" },
        { title: "Products", dataIndex: "productcount", key: "productcount" },
        { title: "Created Date", dataIndex: "createdat", key: "createdat", render: (date) => formatDate(date) },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div className="flex gap-4">
                    <FiEdit
                        className="text-blue-500 cursor-pointer hover:text-blue-700"
                        onClick={() => navigate(`/edit-order/${record.orderid}`)}
                    />
                    <FiTrash2
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => deleteOrderHanndler(record.orderid)}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-slate-50  border border-slate-100 shadow-lg rounded-xl">
            <div className="flex justify-between flex-col md:flex-row">
                <h2 className="md:text-2xl text-xl text-gray-700 font-bold mb-4">Order Management</h2>
                <div className="mb-4">
                    <Input
                        placeholder="Search by order ID or description"
                        className=""
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-auto">

                <Table columns={columns} dataSource={filteredOrders} rowKey="orderid" pagination={{ pageSize: 5 }} />
            </div>
            <Button type="primary" className="mt-4 bg-blue-500 hover:bg-blue-700" onClick={() => navigate('/new-order')}>
                New Order
            </Button>
        </div>
    );
};

export default OrderManagement;
