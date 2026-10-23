import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";

const PropertyContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/properties";

const initialState = { properties: [], loading: true, error: "" };

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true, error: "" };
    case "loaded":
      return { properties: action.payload, loading: false, error: "" };
    case "error":
      return { ...state, loading: false, error: action.payload };
    case "added":
      return { ...state, properties: [action.payload, ...state.properties] };
    case "updated":
      return {
        ...state,
        properties: state.properties.map((item) =>
          String(item.id) === String(action.payload.id) ? action.payload : item
        ),
      };
    case "deleted":
      return {
        ...state,
        properties: state.properties.filter((item) => String(item.id) !== String(action.payload)),
      };
    default:
      return state;
  }
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export function PropertyProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const refreshProperties = useCallback(async () => {
    dispatch({ type: "loading" });
    try {
      const data = await request(API_URL);
      dispatch({ type: "loaded", payload: Array.isArray(data) ? data : [] });
    } catch (error) {
      dispatch({
        type: "error",
        payload: "Could not load properties. Make sure JSON Server is running on port 3001, then refresh.",
      });
    }
  }, []);

  useEffect(() => {
    refreshProperties();
  }, [refreshProperties]);

  const addProperty = useCallback(async (values) => {
    const created = await request(API_URL, {
      method: "POST",
      body: JSON.stringify({
        ...values,
        ownerId: values.ownerId || "owner-1",
        rating: Number(values.rating || 0),
        reviews: Number(values.reviews || 0),
        price: Number(values.price),
        amenities: Array.isArray(values.amenities)
          ? values.amenities
          : String(values.amenities || "").split(",").map((item) => item.trim()).filter(Boolean),
      }),
    });
    dispatch({ type: "added", payload: created });
    return created;
  }, []);

  const updateProperty = useCallback(async (id, values) => {
    const updated = await request(`${API_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...values,
        price: Number(values.price),
        amenities: Array.isArray(values.amenities)
          ? values.amenities
          : String(values.amenities || "").split(",").map((item) => item.trim()).filter(Boolean),
      }),
    });
    dispatch({ type: "updated", payload: updated });
    return updated;
  }, []);

  const deleteProperty = useCallback(async (id) => {
    await request(`${API_URL}/${id}`, { method: "DELETE" });
    dispatch({ type: "deleted", payload: id });
  }, []);

  const value = useMemo(() => ({
    ...state,
    refreshProperties,
    addProperty,
    updateProperty,
    deleteProperty,
  }), [state, refreshProperties, addProperty, updateProperty, deleteProperty]);

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (!context) throw new Error("useProperties must be used inside PropertyProvider");
  return context;
}
