// src/app/services.ts (or src/app/api.ts)

interface ProductType {
     _id: string;
     name: string;
     image: string;
     description?: string;
     createdAt?: Date;
}

export interface CollectionType {
  _id: string;
  name: string;
  images: string;
  description?: string;
  createdAt?: Date;
}

export const checkUserAuthStatus = async () => {
  try {
    const response = await fetch('http://localhost:3002/api/users/authStatus', {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking login status', error);
    throw error;
  }
};

export const logoutUser = async () => {
    try {
        const response = await fetch('http://localhost:3002/api/users/logout', {
            method: 'POST',
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error logging out', error);
        throw error;
    }
};

export const fetchProductTypes = async (): Promise<ProductType[]> => {
  try {
    const response = await fetch(`http://localhost:3002/api/product-types`, {
      method: 'GET',
      credentials: 'include',
    });
    
     if (!response.ok) {
         throw new Error(`HTTP error! Status: ${response.status}`);
     }
     
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product types', error);
     throw error;
  }
};


export const handleAddOrderServices = async () => {
  try {
      const response = await fetch('http://localhost:3002/api/orders', {
          method: 'POST',
          credentials: 'include',
      });
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error('Error logging out', error);
      throw error;
  }
};

export const fetchNewestCollections = async (): Promise<CollectionType[]> => {
  try {
    const response = await fetch(`http://localhost:3002/api/newest-collections`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching newest collections', error);
     throw error;
  }
};
