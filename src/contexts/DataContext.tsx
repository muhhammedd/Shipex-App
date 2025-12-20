import React, { createContext, useContext, useState } from 'react';
import { Order, User, OrderStatus, DataContextType } from '../lib/types';
import { MOCK_ORDERS, MOCK_USERS } from '../lib/mockData';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [users] = useState<User[]>(MOCK_USERS);

  const createOrder = (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
      status: 'pending' as OrderStatus,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [...prev, newOrder]);
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, ...updates } : order
      )
    );
  };

  const assignCourier = (orderId: string, courierId: string) => {
    updateOrder(orderId, { courierId });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    updateOrder(orderId, { status });
  };

  const value: DataContextType = {
    orders,
    users,
    createOrder,
    updateOrder,
    assignCourier,
    updateOrderStatus,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
