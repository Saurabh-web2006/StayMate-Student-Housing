export function readOwnerBookings(properties) {
  const propertyIds = new Set(properties.map((property) => String(property.id)));
  const bookings = [];
  let skippedRecords = 0;

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith("staymate:") || !key.endsWith(":bookings")) continue;

    try {
      const savedBookings = JSON.parse(localStorage.getItem(key));
      if (!Array.isArray(savedBookings)) {
        console.error(`Saved booking data for "${key}" is not a list.`);
        skippedRecords += 1;
        continue;
      }
      savedBookings.forEach((booking) => {
        if (
          !booking
          || typeof booking !== "object"
          || !propertyIds.has(String(booking.propertyId))
          || (typeof booking.id !== "string" && typeof booking.id !== "number")
        ) {
          return;
        }
        bookings.push({
          ...booking,
          id: String(booking.id),
          name: typeof booking.name === "string" ? booking.name : "Property",
          location: typeof booking.location === "string" ? booking.location : "",
          image: typeof booking.image === "string" ? booking.image : "",
          type: typeof booking.type === "string" ? booking.type : "",
          room: typeof booking.room === "string" ? booking.room : "",
          studentName: typeof booking.studentName === "string" ? booking.studentName : "Student",
          status: typeof booking.status === "string" ? booking.status : "pending",
          requestedAt: typeof booking.requestedAt === "string" ? booking.requestedAt : "",
          price: Number.isFinite(Number(booking.price)) ? Number(booking.price) : 0,
        });
      });
    } catch (error) {
      console.error(`Could not read saved booking data for "${key}".`, error);
      skippedRecords += 1;
    }
  }

  bookings.sort((first, second) => {
    const firstTime = Date.parse(first.requestedAt);
    const secondTime = Date.parse(second.requestedAt);
    return (Number.isFinite(secondTime) ? secondTime : 0) - (Number.isFinite(firstTime) ? firstTime : 0);
  });

  return { bookings, skippedRecords };
}
