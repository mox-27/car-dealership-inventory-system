const ORDER_STORAGE_KEY_PREFIX = 'autoverse_orders_';

export const saveOrder = (userEmail, vehicle) => {
  if (!userEmail) return;
  const key = `${ORDER_STORAGE_KEY_PREFIX}${userEmail}`;
  const existingOrders = getOrders(userEmail);
  
  const newOrder = {
    ...vehicle,
    orderDate: new Date().toISOString(),
    orderId: `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`
  };
  
  existingOrders.unshift(newOrder); // Add to beginning
  localStorage.setItem(key, JSON.stringify(existingOrders));
};

export const getOrders = (userEmail) => {
  if (!userEmail) return [];
  const key = `${ORDER_STORAGE_KEY_PREFIX}${userEmail}`;
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to parse orders from localStorage', err);
    return [];
  }
};

export const clearOrders = (userEmail) => {
  if (!userEmail) return;
  const key = `${ORDER_STORAGE_KEY_PREFIX}${userEmail}`;
  localStorage.removeItem(key);
};
