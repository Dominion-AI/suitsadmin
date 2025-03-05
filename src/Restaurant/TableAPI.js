// const BASE_URL = 'https://suitsadmin.onrender.com/api';
// const ACCESS_TOKEN = 'access_token';


// // src/api/tableApi.js
// export const fetchTables = async (token) => {
//     const response = await fetch(`${BASE_URL}/table/tables/`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//         }
//     });
//     return response.json();
// };

// export const createTable = async (token, tableData) => {
//     const response = await fetch(`${BASE_URL}/table/tables/`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify(tableData)
//     });
//     return response.json();
// };

// // src/api/reservationApi.js
// export const fetchReservations = async (token) => {
//     const response = await fetch(`${BASE_URL}/table/reservations/`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//         }
//     });
//     return response.json();
// };

// export const createReservation = async (token, reservationData) => {
//     const response = await fetch(`${BASE_URL}/table/reservations/`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify(reservationData)
//     });
//     return response.json();
// };

// // src/api/orderApi.js
// export const splitBill = async (token, orderId, billData) => {
//     const response = await fetch(`${BASE_URL}/table/orders/${orderId}/split-bill/`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify(billData)
//     });
//     return response.json();
// };

// // src/api/kitchenApi.js
// export const fetchKitchenOrders = async (token) => {
//     const response = await fetch(`${BASE_URL}/table/kitchen-orders/`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//         }
//     });
//     return response.json();
// };

// // src/api/barApi.js
// export const fetchBarOrders = async (token) => {
//     const response = await fetch(`${BASE_URL}/table/bar-orders/`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//         }
//     });
//     return response.json();
// };



// const BASE_URL = 'https://suitsadmin.onrender.com/api';

// // Utility function to get token
// const getToken = () => localStorage.getItem("authToken");

// // Generic function to handle API requests with error handling
// const fetchData = async (url, method = "GET", body = null) => {
//     const token = getToken();  // Retrieve token from localStorage

//     if (!token) {
//         console.error("No authentication token found.");
//         throw new Error("Unauthorized: No token available.");
//     }

//     try {
//         const response = await fetch(`${BASE_URL}${url}`, {
//             method,
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             },
//             body: body ? JSON.stringify(body) : null
//         });

//         if (response.status === 401) {
//             console.warn("Unauthorized request. Token might be invalid or expired.");
//             throw new Error("Unauthorized: Please log in again.");
//         }

//         return response.json();
//     } catch (error) {
//         console.error("API error:", error);
//         throw error;
//     }
// };

// // ✅ Tables API
// export const fetchTables = () => fetchData("/table/tables/");
// export const createTable = (tableData) => fetchData("/table/tables/", "POST", tableData);

// // ✅ Reservations API
// export const fetchReservations = () => fetchData("/table/reservations/");
// export const createReservation = (reservationData) => fetchData("/table/reservations/", "POST", reservationData);

// // ✅ Orders API
// export const splitBill = (orderId, billData) => fetchData(`/table/orders/${orderId}/split-bill/`, "POST", billData);

// // ✅ Kitchen Orders API
// export const fetchKitchenOrders = () => fetchData("/table/kitchen-orders/");

// // ✅ Bar Orders API
// export const fetchBarOrders = () => fetchData("/table/bar-orders/");




const BASE_URL = 'https://suitsadmin.onrender.com/api';

// Utility function to get token
const getToken = () => localStorage.getItem("authToken");

// Function to refresh token (example implementation)
const refreshToken = async () => {
    // Perform token refresh logic here
    // This example assumes the refresh token endpoint is /auth/refresh-token
    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refreshToken: localStorage.getItem("refreshToken")
        })
    });
    const data = await response.json();
    if (data.accessToken) {
        localStorage.setItem("authToken", data.accessToken);
        localStorage.setItem("tokenExpiry", new Date().getTime() + data.expiresIn * 1000);
    } else {
        throw new Error("Failed to refresh token.");
    }
};

// Generic function to handle API requests with error handling
const fetchData = async (url, method = "GET", body = null) => {
    let token = getToken();  // Retrieve token from localStorage
    let tokenExpiry = localStorage.getItem("tokenExpiry");

    if (!token) {
        console.error("No authentication token found.");
        throw new Error("Unauthorized: No token available.");
    }

    if (tokenExpiry && new Date().getTime() >= tokenExpiry) {
        try {
            await refreshToken();
            token = getToken();
        } catch (error) {
            console.error("Failed to refresh token:", error);
            throw new Error("Unauthorized: Please log in again.");
        }
    }

    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: body ? JSON.stringify(body) : null
        });

        if (response.status === 401) {
            console.warn("Unauthorized request. Token might be invalid or expired.");
            throw new Error("Unauthorized: Please log in again.");
        }

        return response.json();
    } catch (error) {
        console.error("API error:", error);
        throw error;
    }
};

// ✅ Tables API
export const fetchTables = () => fetchData("/table/tables/");
export const createTable = (tableData) => fetchData("/table/tables/", "POST", tableData);

// ✅ Reservations API
export const fetchReservations = () => fetchData("/table/reservations/");
export const createReservation = (reservationData) => fetchData("/table/reservations/", "POST", reservationData);

// ✅ Orders API
export const splitBill = (orderId, billData) => fetchData(`/table/orders/${orderId}/split-bill/`, "POST", billData);

// ✅ Kitchen Orders API
export const fetchKitchenOrders = () => fetchData("/table/kitchen-orders/");

// ✅ Bar Orders API
export const fetchBarOrders = () => fetchData("/table/bar-orders/");

