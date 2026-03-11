import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logout from './Logout';


const OrderUpdates = (onLogout) => {
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState('Disconnected');







    // Fetch saved orders from localStorage
    useEffect(() => {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
            try {
                setOrders(JSON.parse(savedOrders));
            } catch (e) {
                console.error('Invalid data in localStorage:', savedOrders);
                localStorage.removeItem('orders');
            }
        }
    }, []);

    // WebSocket connection for real-time updates
    useEffect(() => {
        const socket = new WebSocket('ws:/ws/orders/');

        socket.onopen = () => {
            console.log('WebSocket connection established');
            setStatus('Connected');
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                let orderData;

                // Handle different message formats
                if (data.id) {
                    orderData = data;
                } else if (data.message && typeof data.message === 'string') {
                    const correctedMessage = data.message.replace(/'/g, '"').replace(/None/g, 'null');
                    orderData = JSON.parse(correctedMessage);
                }

                if (orderData && orderData.id) {
                    setOrders((prevOrders) => {
                        const updatedOrders = [...prevOrders, orderData];
                        localStorage.setItem('orders', JSON.stringify(updatedOrders));
                        return updatedOrders;
                    });

                    // Play sound for new order
                    const audio = new Audio('/sound/cow.mp3');
                    audio.play().catch((error) => console.error('Audio play failed:', error));
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error, event.data);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
            setStatus('Disconnected');
        };

        return () => {
            socket.close();
        };
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        // Convert status to lowercase to match backend expectations
        const normalizedStatus = newStatus.toLowerCase();

        console.log(`Sending update for order: ${orderId} with status: ${normalizedStatus}`);

        const validStatuses = ['pending', 'completed', 'cancelled']; // Backend valid statuses
        if (!validStatuses.includes(normalizedStatus)) {
            console.error(`Invalid status: ${normalizedStatus}`);
            return;
        }

        try {
            const response = await axios.post(`/order/${orderId}/update_status/`, {
                status: normalizedStatus,
            });

            if (response.status === 200) {
                console.log('Status updated successfully');
                // Update local orders state
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId ? { ...order, status: newStatus } : order
                    )
                );
            } else {
                console.error('Failed to update status:', response.data.error);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
            <h1 style={{ textAlign: 'center', color: '#4CAF50' }}>WebSocket Status: {status}</h1>
            <h2 style={{ textAlign: 'center' }}>New Orders:</h2>
            <Logout onLogout={() => console.log('User logged out')} />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {orders.map((order, index) => (
                    order && order.cart && order.cart.items ? (
                        <div
                            key={index}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '10px',
                                width: '300px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                backgroundColor: '#fff'
                            }}
                        >
                            <h3 style={{ margin: '0 0 10px', color: '#333' }}>Order ID: {order.id || 'Unknown'}</h3>
                            <p style={{ margin: '5px 0' }}><strong>Total Price:</strong> {order.total_price || 'N/A'}</p>

                            {/* Select for updating status */}
                            <select
                                value={order.status || 'Pending'}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                style={{
                                    padding: '5px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    marginTop: '10px',
                                }}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>

                            <div>
                                {order.cart.items.map((item, idx) => (
                                    <div key={idx} style={{ marginBottom: '10px', padding: '5px', borderBottom: '1px solid #eee' }}>
                                        <p style={{ margin: '5px 0' }}><strong>Dish:</strong> {item.custom_dish_type || (item.dish && item.dish.name) || 'Unknown Dish'}</p>
                                        <p style={{ margin: '5px 0' }}><strong>Quantity:</strong> {item.quantity || 0}</p>
                                        <p style={{ margin: '5px 0'}}><strong>Delivery Address:</strong>{order.delivery_address}</p>
                                        {item.ingredients && item.ingredients.length > 0 ? (
                                            <ul style={{ padding: '0 0 0 15px', margin: '5px 0' }}>
                                                {item.ingredients.map((ingredient, ingredientIdx) => (
                                                    <li key={ingredientIdx} style={{ fontSize: '14px', color: '#555' }}>
                                                        {ingredient.name} (Extra Cost: {ingredient.extra_cost})
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p style={{ fontSize: '14px', color: '#888' }}>No ingredients</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null
                ))}
            </div>
        </div>
    );
};

export default OrderUpdates;
