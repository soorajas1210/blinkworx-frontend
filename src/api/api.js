import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

export const getOrders = async () => {
  try {
    const response = await axiosInstance.get("/order");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching orders:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to fetch orders" };
  }
};

export const getOrderById = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching order ${orderId}:`,
      error.response?.data || error.message
    );
    throw (
      error.response?.data || { message: `Failed to fetch order ${orderId}` }
    );
  }
};

export const addNewOrder = async (orderDescription, pIds) => {
  try {
    const response = await axiosInstance.post("/orders", {
      orderDescription,
      pIds,
    });
    if (response.status == 201) {
      toast.success(response.data.message);
    } else {
      toast.error("Unknown Error, Please try again");
    }
    return response;
  } catch (error) {
    console.error("Error adding order:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to add order" };
  }
};

export const updateOrderById = async (orderId, orderDescription, pIds) => {
  try {
    const response = await axiosInstance.put(`/orders/${orderId}`, {
      orderDescription,
      pIds,
    });
    if (response.status == 200) {
      toast.success(response.data.message);
    } else {
      toast.error("Unknown Error, Please try again");
    }
    return response;
  } catch (error) {
    console.error(
      `Error updating order ${orderId}:`,
      error.response?.data || error.message
    );
    throw (
      error.response?.data || { message: `Failed to update order ${orderId}` }
    );
  }
};

export const deleteOrderById = async (orderId) => {
  try {
    const response = await axiosInstance.delete(`/orders/${orderId}`);
    return response;
  } catch (error) {
    console.error(
      `Error deleting order ${orderId}:`,
      error.response?.data || error.message
    );
    throw (
      error.response?.data || { message: `Failed to delete order ${orderId}` }
    );
  }
};

export const getProducts = async () => {
  try {
    const response = await axiosInstance.get("/products");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching products:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Failed to fetch orders" };
  }
};
