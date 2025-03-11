import { API_URL } from "@/config";

export const fetchApi = async ({
  endpoint = "",
  data = {},
  method = "POST",
  headers = {
    "Content-Type": "application/json",
    accept: "application/json",
  },
}) => {
  const url = API_URL + endpoint;
  const options = {
    method,
    headers,
    body: method !== "GET" ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      let errorMessage = "An error occurred. Please try again later.";
      try {
        const res = await response.json();
        errorMessage = res.message || errorMessage;
      } catch (error) {
        console.log(error);
      }
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(error);
  }
};
