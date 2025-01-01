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
export const handleCreateProductTypeAction = async (data: any) => {
  try{
  const respon = await fetch(`http://localhost:3002/api/product-types`, {
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
  revalidateTag("list-product-type")
  return res;
  } catch (error) { 
      console.log("error", error)
  }
  
}

export const handleUpdateProductTypeAction = async (data: any) => {
  const respon = await fetch(`http://localhost:3002/api/product-types/${data.id}`, {
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
  revalidateTag("list-product-type")
  return res;
}

export const handleDeleteProductTypeAction = async (id: any) => {
  const respon = await fetch(`http://localhost:3002/api/product-types/${id}`, {
      method: "DELETE", // Thay đổi method thành POST
      headers: {
        "Content-Type": "application/json"// Xác định loại dữ liệu được gửi
  }});
    
  revalidateTag("list-product-type")
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