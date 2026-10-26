import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

const BookingContext = createContext(null);
const BOOKINGS_KEY = "staymateBookings";
const MIGRATION_KEY = "staymateBookingsMigratedV1";
const MIGRATION_ERROR_KEY = "staymateBookingsMigrationError";
const BOOKING_EVENT = "staymate-bookings-updated";

function normalizeStudentId(value) {
  return String(value || "guest").trim().toLowerCase();
}

function readBookingSnapshot() {
  try {
    const stored = localStorage.getItem(BOOKINGS_KEY);
    if (!stored) return JSON.stringify({
      bookings: [],
      error: localStorage.getItem(MIGRATION_ERROR_KEY) || "",
    });
    const bookings = JSON.parse(stored);
    if (!Array.isArray(bookings)) throw new Error("Saved booking data must be a list.");
    return JSON.stringify({
      bookings: bookings
        .filter((booking) => (
          booking
          && typeof booking === "object"
          && !Array.isArray(booking)
          && typeof booking.id !== "undefined"
          && typeof booking.propertyId !== "undefined"
        ))
        .map((booking) => ({
          ...booking,
          studentId: normalizeStudentId(booking.studentId),
          studentName: typeof booking.studentName === "string" ? booking.studentName : "Student",
          status: ["pending", "accepted", "declined"].includes(booking.status) ? booking.status : "pending",
        })),
      error: localStorage.getItem(MIGRATION_ERROR_KEY) || "",
    });
  } catch (error) {
    console.error("Could not read shared booking data.", error);
    return JSON.stringify({ bookings: [], error: "Could not read saved booking requests from this browser." });
  }
}

function subscribeToBookingStore(onStoreChange) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(BOOKING_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(BOOKING_EVENT, onStoreChange);
  };
}

function notifyBookingStoreChanged() {
  window.dispatchEvent(new Event(BOOKING_EVENT));
}

function migrateLegacyBookings() {
  if (localStorage.getItem(MIGRATION_KEY) === "true") return 0;

  const allBookings = new Map();
  const storedBookings = localStorage.getItem(BOOKINGS_KEY);
  if (storedBookings) {
    const existing = JSON.parse(storedBookings);
    if (!Array.isArray(existing)) throw new Error("Saved booking data must be a list.");
    existing.forEach((booking) => {
      if (booking && typeof booking === "object" && typeof booking.id !== "undefined") {
        const studentId = normalizeStudentId(booking.studentId);
        allBookings.set(`${studentId}:${booking.id}`, { ...booking, studentId });
      }
    });
  }

  const legacyKeys = [];
  let skippedRecords = 0;
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith("staymate:") || !key.endsWith(":bookings")) continue;
    legacyKeys.push(key);
  }

  legacyKeys.forEach((key) => {
    const encodedStudentId = key.slice("staymate:".length, -":bookings".length);
    let studentId;
    try {
      studentId = normalizeStudentId(decodeURIComponent(encodedStudentId));
      const legacyBookings = JSON.parse(localStorage.getItem(key));
      if (!Array.isArray(legacyBookings)) throw new Error(`Booking data for "${key}" must be a list.`);
      legacyBookings.forEach((booking) => {
        if (booking && typeof booking === "object" && typeof booking.id !== "undefined") {
          const mapKey = `${studentId}:${booking.id}`;
          if (!allBookings.has(mapKey)) {
            allBookings.set(mapKey, {
              ...booking,
              studentId,
              studentName: typeof booking.studentName === "string" ? booking.studentName : "Student",
            });
          }
        }
      });
    } catch (error) {
      console.error(`Could not migrate booking data for "${key}".`, error);
      skippedRecords += 1;
    }
  });

  if (allBookings.size > 0) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify([...allBookings.values()]));
  }
  localStorage.setItem(MIGRATION_KEY, "true");
  notifyBookingStoreChanged();
  return skippedRecords;
}

function writeBookings(bookings) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  notifyBookingStoreChanged();
}

export function BookingProvider({ children }) {
  const snapshot = useSyncExternalStore(subscribeToBookingStore, readBookingSnapshot);
  const store = JSON.parse(snapshot);

  useEffect(() => {
    try {
      const skippedRecords = migrateLegacyBookings();
      if (skippedRecords) {
        localStorage.setItem(MIGRATION_ERROR_KEY, "Some older booking requests could not be read. Other requests are available.");
        notifyBookingStoreChanged();
      }
    } catch (error) {
      console.error("Could not migrate existing booking requests.", error);
      try {
        localStorage.setItem(MIGRATION_ERROR_KEY, "Could not migrate your older booking requests. Existing booking data has been preserved.");
        notifyBookingStoreChanged();
      } catch (storageError) {
        console.error("Could not save booking migration status.", storageError);
      }
    }
  }, []);

  const getStudentBookings = useCallback((studentId) => {
    const normalizedId = normalizeStudentId(studentId);
    return store.bookings.filter((booking) => normalizeStudentId(booking.studentId) === normalizedId);
  }, [store.bookings]);

  const getPropertyBookings = useCallback((properties) => {
    const propertyIds = new Set(properties.map((property) => String(property.id)));
    return store.bookings
      .filter((booking) => propertyIds.has(String(booking.propertyId)))
      .sort((first, second) => {
        const firstTime = Date.parse(first.requestedAt || "");
        const secondTime = Date.parse(second.requestedAt || "");
        return (Number.isFinite(secondTime) ? secondTime : 0) - (Number.isFinite(firstTime) ? firstTime : 0);
      });
  }, [store.bookings]);

  const createBooking = useCallback((studentId, studentName, property) => {
    if (!property || typeof property.id === "undefined") {
      throw new Error("Choose a valid property before requesting a booking.");
    }
    const normalizedId = normalizeStudentId(studentId);
    const currentSnapshot = JSON.parse(readBookingSnapshot());
    if (currentSnapshot.error) throw new Error(currentSnapshot.error);
    const currentBookings = currentSnapshot.bookings;
    const existing = currentBookings.find((booking) => (
      normalizeStudentId(booking.studentId) === normalizedId
      && String(booking.propertyId) === String(property.id)
      && booking.status === "pending"
    ));
    if (existing) return existing;

    const booking = {
      id: `${property.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      propertyId: property.id,
      name: property.name || "Property",
      location: property.location || "",
      image: property.image || "",
      price: Number(property.price) || 0,
      type: property.type || "",
      room: property.room || "",
      studentId: normalizedId,
      studentName: studentName || "Student",
      requestedAt: new Date().toISOString(),
      status: "pending",
    };
    writeBookings([booking, ...currentBookings]);
    return booking;
  }, []);

  const updateBookingStatus = useCallback((bookingId, status) => {
    if (!["pending", "accepted", "declined"].includes(status)) {
      throw new Error("Choose a valid booking status.");
    }
    const currentSnapshot = JSON.parse(readBookingSnapshot());
    if (currentSnapshot.error) throw new Error(currentSnapshot.error);
    const bookingExists = currentSnapshot.bookings.some((booking) => String(booking.id) === String(bookingId));
    if (!bookingExists) throw new Error("This booking request could not be found.");
    const updatedBookings = currentSnapshot.bookings.map((booking) => (
      String(booking.id) === String(bookingId) ? { ...booking, status } : booking
    ));
    writeBookings(updatedBookings);
  }, []);

  const value = useMemo(() => ({
    bookings: store.bookings,
    error: store.error,
    getStudentBookings,
    getPropertyBookings,
    createBooking,
    updateBookingStatus,
  }), [createBooking, getPropertyBookings, getStudentBookings, store.bookings, store.error, updateBookingStatus]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBookings must be used inside BookingProvider");
  return context;
}
