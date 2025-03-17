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

export const handleDeleteProductTypeAction = async (id: any) => {
    const respon = await fetch(`http://localhost:3002/api/product-types/${id}`, {
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // DON'T stringify FormData
    });

    if (!respon.ok) {
      const errorData = await respon.json();
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
  revalidateTag("list-coll");
  return { success: true, data: res };
  } catch (error) { 
      console.log("error", error)
  }
  
}

// onstore/src/utils/actions.ts
export const handleUpdateProductTypeAction = async (data: any) => {
    try {
        const respon = await fetch(`http://localhost:3002/api/product-types/${data.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...data,
            images: data.images || null // Ensure images is included, can be null
        }),
    });

    if (!respon) {
        return;
    }

    const res = await respon.json();
        revalidateTag("list-product-type");
        return {success: true, data: res};
    } catch (error: any) {
        console.error("Update error", error);
        return {success: false, message: error.message || "An unexpected error occurred"};
    }
};

export const handleUploadProductTypeImageAction = async (formData: FormData) => {
  try {
    const respon = await fetch(`http://localhost:3002/api/images/upload`, {
      method: "POST",
      body: formData, // Send FormData
    });

    if (!respon.ok) {
      const errorData = await respon.json();
      console.error("Upload Product Type Image Error:", errorData);
      return { success: false, message: errorData.message || "Failed to upload image" };
    }

    const res = await respon.json();
    revalidateTag("list-product-type");
    return { success: true, data: res };
  } catch (error: any) {
    console.error("Upload image error", error);
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
};

export const handleUploadCollectionImageAction = async (formData: FormData) => {
  try {
    const respon = await fetch(`http://localhost:3002/api/images/upload`, {
      method: "POST",
      body: formData, // Send FormData
    });

    if (!respon.ok) {
      const errorData = await respon.json();
      console.error("Upload Product Type Image Error:", errorData);
      return { success: false, message: errorData.message || "Failed to upload image" };
    }

    const res = await respon.json();
    revalidateTag("list-coll");
    return { success: true, data: res };
  } catch (error: any) {
    console.error("Upload image error", error);
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
};



export const handleUpdateCollAction = async (data: any) => {
    const respon = await fetch(`http://localhost:3002/api/collections/${data.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...data,
            images: data.images || null // Ensure images is included, can be null
        }),
    });

    if (!respon) {
        return;
    }

    const res = await respon.json();
    revalidateTag("list-coll");
    return res;
};

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

// actions.ts
export const handleDeleteProductTypeImageAction = async (imageName: string) => {
    try {
        const respon = await fetch(`http://localhost:3002/api/images/delete/${imageName}`, {
            method: "POST", // Important: Use DELETE method!
        });

        if (!respon.ok) {
            const errorData = await respon.json();
            console.error("Delete Product Type Image Error:", errorData);
            return { success: false, message: errorData.message || "Failed to delete image" };
        }

        revalidateTag("list-product-type");
        return { success: true };
    } catch (error: any) {
        console.error("Delete image error", error);
        return { success: false, message: error.message || "An unexpected error occurred" };
    }
};

