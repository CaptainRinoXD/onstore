'use server'

import { revalidateTag } from "next/cache";


//product
export const handleCreateProductAction = async (data: any) => {
    try{
    const respon = await fetch(`http://localhost:3002/api/products`, {
        method: "POST", // Thay đổi method thành POST
        headers: {
          "Content-Type": "application/json", // Xác định loại dữ liệu được gửi
        },
        body: JSON.stringify({
            ...data 
        }),
      });

      
    if (!respon) {
       return
    }
      
    const res = await respon.json();
    revalidateTag("list-product")
    return res;
    } catch (error) { 
        console.log("error", error)
    }
    
}

export const handleUpdateProductAction = async (data: any) => {
    const respon = await fetch(`http://localhost:3002/api/products/${data.id}`, {
        method: "PUT", // Thay đổi method thành POST
        headers: {
          "Content-Type": "application/json", // Xác định loại dữ liệu được gửi
        },
        body: JSON.stringify({
            ...data 
        }),
      });
      
    if (!respon) {
        return}
      
    const res = await respon.json();
    revalidateTag("list-product")
    return res;
}

export const handleDeleteProductAction = async (id: any) => {
    const respon = await fetch(`http://localhost:3002/api/products/${id}`, {
        method: "DELETE", // Thay đổi method thành POST
        headers: {
          "Content-Type": "application/json"// Xác định loại dữ liệu được gửi
    }});
      
    revalidateTag("list-product")
}

//product type
export const handleCreateProductTypeAction = async (formData: FormData) => {
  try{
    const respon = await fetch(`http://localhost:3002/api/product-types`, {
      method: "POST",
      body: formData, // Pass FormData directly, DON'T stringify
      // NO Content-Type header here! Let the browser set it.
    });

    if (!respon.ok) { // Use .ok to check for successful status (200-299)
      const errorData = await respon.json(); // Get error details
      console.error("Create Product Type Error:", errorData);
      return { success: false, message: errorData.message || "Failed to create product type" };
    }
    
    const res = await respon.json();
    revalidateTag("list-product-type")
    return { success: true, data: res };
  } catch (error:any) {
      console.log("error", error)
      return { success: false, message: error.message || "An unexpected error occurred" };
  }
}

export const handleUpdateProductTypeAction = async (formData: FormData) => {
    try {
        const id = formData.get('id'); // Get the ID from FormData
        formData.delete('id'); // Remove the ID so it's not duplicated in the body.
        const respon = await fetch(`http://localhost:3002/api/product-types/${id}`, {
            method: "PUT",
            body: formData, // Pass FormData directly
            // NO Content-Type header!
        });

        if (!respon.ok) {
            const errorData = await respon.json();
            console.error("Update Product Type Error:", errorData);
            return { success: false, message: errorData.message || "Failed to update product type" };
        }
        
        const res = await respon.json();
        revalidateTag("list-product-type")
        return { success: true, data: res };
    } catch(error:any) {
        console.error("Update error", error);
        return { success: false, message: error.message || "An unexpected error occurred" };
    }
}

//collection
export const handleCreateCollAction = async (data: any) => {
  try{
  const respon = await fetch(`http://localhost:3002/api/collections`, {
      method: "POST", // Thay đổi method thành POST
      headers: {
        "Content-Type": "application/json", // Xác định loại dữ liệu được gửi
      },
      body: JSON.stringify({
          ...data 
      }),
    });

    
  if (!respon) {
     return
  }
    
  const res = await respon.json();
  revalidateTag("list-coll")
  return res;
  } catch (error) { 
      console.log("error", error)
  }
  
}

export const handleUpdateCollAction = async (data: any) => {
  const respon = await fetch(`http://localhost:3002/api/collections/${data.id}`, {
      method: "PUT", // Thay đổi method thành POST
      headers: {
        "Content-Type": "application/json", // Xác định loại dữ liệu được gửi
      },
      body: JSON.stringify({
          ...data 
      }),
    });
    
  if (!respon) {
      return}
    
  const res = await respon.json();
  revalidateTag("list-coll")
  return res;
}

export const handleDeleteCollAction = async (id: any) => {
  const respon = await fetch(`http://localhost:3002/api/collections/${id}`, {
      method: "DELETE", // Thay đổi method thành POST
      headers: {
        "Content-Type": "application/json"// Xác định loại dữ liệu được gửi
  }});
    
  revalidateTag("list-coll")
}

//user

export const handleUpdateUserAction = async (data: any) => {
  const respon = await fetch(`http://localhost:3002/api/users/${data.id}`, {
      method: "PUT", // Thay đổi method thành POST
      headers: {
        "Content-Type": "application/json", // Xác định loại dữ liệu được gửi
      },
      body: JSON.stringify({
          ...data 
      }),
    });
    
  if (!respon) {
      return}
    
  const res = await respon.json();
  revalidateTag("list-users")
  return res;
}

export const handleDeleteUserAction = async (id: any) => {
  const respon = await fetch(`http://localhost:3002/api/users/${id}`, {
      method: "DELETE", // Thay đổi method thành POST
      headers: {
        "Content-Type": "application/json"// Xác định loại dữ liệu được gửi
  }});
    
  revalidateTag("list-users")
}


// orrder 
export const handleAddOrderAction = async () => { 
  try {
    const respon = await fetch(`http://localhost:3002/api/orders`, { 
      method: "POST",
      credentials: 'include',
      headers: {
          "Content-Type": "application/json", // Xác định loại dữ liệu được gửi
        }
    });
    
  if (!respon) {
      return}
  
  const res = await respon.json();
  // revalidateTag("list-users")
  return res;
  } catch (error) {
    throw error // Rethrow the error to be handled by the caller
  }  
}

export const handleGetOrderById = async () => {

  const respon = await fetch('http://localhost:3002/api/orders/currentUser', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!respon) {
    return}

const res = await respon.json();
console.log("res",res)
// revalidateTag("list-users")
  return res;
}

export const handleUpdateOrderAction = async (data: any) => {
  console.log('data',data)
  const respon = await fetch(`http://localhost:3002/api/orders/${data.id}`, {
      method: "PUT", // Thay đổi method thành POST
      headers: {
        "Content-Type": "application/json", // Xác định loại dữ liệu được gửi
      },
      body: JSON.stringify({
          ...data 
      }),
    });
    
  if (!respon) {
      return}
    
  const res = await respon.json();
  console.log('res',res)

  revalidateTag("list-order")
  return res;
}