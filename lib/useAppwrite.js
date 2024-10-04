import { Alert } from "react-native";
import { useEffect, useState } from "react";

const useAppwrite = (fn) => {
  const [data, setData] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fn();
      setData(res);
    } catch (error) {
      console.error("Error fetching data:", error); // Log the error for debugging
      Alert.alert("Error", error.message || "An error occurred"); // Provide a fallback message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true; // Track whether the component is mounted
    fetchData();
    
    return () => {
      isMounted = false; // Cleanup function to prevent state updates on unmounted component
    };
  }, []);

  const refetch = () => fetchData();

  return { data, loading, refetch };
};

export default useAppwrite;
