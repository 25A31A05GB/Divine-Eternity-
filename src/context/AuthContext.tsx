import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, CustomerAddress, Order } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, name?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateAddress: (address: CustomerAddress) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], trackingNumber?: string) => void;
  loginAsAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'divines_user_v1';
const ORDERS_STORAGE_KEY = 'divines_orders_v1';

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'DE-882104',
    createdAt: '2026-10-04T14:32:00Z',
    customer: {
      fullName: 'Ananya Sharma',
      phone: '9876543210',
      email: 'ananya@example.com',
      streetAddress: 'Flat 402, Rosewood Heights, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
    },
    items: [
      {
        id: 'demo-1',
        productId: 'jewel-2',
        name: 'Dainty Cursive Name Chain Bracelet',
        slug: 'dainty-cursive-name-chain-bracelet',
        price: 799,
        mrp: 1599,
        caseType: '18k Gold Plated Chain',
        customText: 'Ananya',
        quantity: 1,
        themeColor: '#FEF9EF',
        secondaryColor: '#D4AF37',
        designPattern: 'jewelry_necklace',
        category: 'Customize Your Gift',
      },
    ],
    subtotal: 649,
    discountTotal: 0,
    shippingFee: 0,
    totalAmount: 649,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    paymentId: 'pay_UPI_994821',
    status: 'Shipped',
    trackingNumber: 'BLUEDART-8829104',
    timeline: [
      {
        status: 'Placed',
        timestamp: '2026-10-04 14:32',
        location: 'Mumbai Studio',
        description: 'Order confirmed with personalization details',
      },
      {
        status: 'Packed',
        timestamp: '2026-10-05 10:15',
        location: 'Destiny Fulfillment Hub',
        description: 'Quality checked, engraved & gift boxed',
      },
      {
        status: 'Shipped',
        timestamp: '2026-10-05 18:40',
        location: 'BlueDart Express Center',
        description: 'In transit to delivery hub',
      },
    ],
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        id: 'cust-guest',
        name: 'Guest Customer',
        email: 'customer@divine.com',
        phone: '9876543210',
        isAdmin: false,
        addresses: [
          {
            fullName: 'Aarav Patel',
            phone: '9876543210',
            email: 'customer@divine.com',
            streetAddress: '104, Lotus Avenue, Indiranagar',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560038',
          }
        ],
        wishlistProductIds: [],
      };
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_ORDERS;
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const login = async (email: string, name?: string) => {
    const isAdminUser = email.toLowerCase().includes('admin');
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || (isAdminUser ? 'Store Administrator' : email.split('@')[0]),
      email: email.trim(),
      phone: '9876543210',
      isAdmin: isAdminUser,
      addresses: [],
      wishlistProductIds: [],
    };
    setUser(newUser);
    return { success: true, message: isAdminUser ? 'Logged in as Admin' : 'Welcome back!' };
  };

  const loginAsAdmin = () => {
    setUser({
      id: 'admin-1',
      name: 'Divine’s Eternity Store Admin',
      email: 'admin@divineseternity.com',
      phone: '9900112233',
      isAdmin: true,
      addresses: [],
      wishlistProductIds: [],
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateAddress = (newAddress: CustomerAddress) => {
    if (!user) return;
    setUser({
      ...user,
      addresses: [newAddress, ...user.addresses.filter((a) => a.streetAddress !== newAddress.streetAddress)],
    });
  };

  const addOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const updatedTimeline = [
          ...order.timeline,
          {
            status,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            location: 'Destiny Fulfillment Hub',
            description: `Status updated to ${status}`,
          },
        ];
        return {
          ...order,
          status,
          trackingNumber: trackingNumber || order.trackingNumber,
          timeline: updatedTimeline,
        };
      })
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin,
        login,
        logout,
        updateAddress,
        orders,
        addOrder,
        updateOrderStatus,
        loginAsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
