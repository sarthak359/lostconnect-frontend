import axios from "axios";

const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY; // Replace with your actual key

const getLocationName = async (lat: number, lng: number): Promise<string> => {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}`;

  try {
    const response = await axios.get(url);
    return response.data.results[0]?.formatted || "Unknown location";
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Unknown location";
  }
};
export default getLocationName;
