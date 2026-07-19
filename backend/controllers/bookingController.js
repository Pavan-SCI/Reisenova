import { db } from "../config/firebase.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { sendBookingConfirmationEmail } from "../services/emailService.js";

// Helper to resolve and ensure user phone number is set in Firestore
const getAndEnsureUserPhone = async (userId, userPhoneInput) => {
  if (!db || !userId) return userPhoneInput || "";
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    let dbPhone = "";
    if (userSnap.exists()) {
      dbPhone = userSnap.data().phone || "";
    }
    
    // If the input phone is provided and is different from DB, update DB
    if (userPhoneInput && userPhoneInput !== dbPhone) {
      await setDoc(userRef, { phone: userPhoneInput }, { merge: true });
      return userPhoneInput;
    }
    return dbPhone || userPhoneInput || "";
  } catch (error) {
    console.error("Error resolving/ensuring user phone number:", error);
    return userPhoneInput || "";
  }
};

export const bookPackage = async (req, res) => {
  try {
    const { userId, packageId, packageDetails, userEmail, userPhone } = req.body;
    if (!userId || !packageId) {
      return res
        .status(400)
        .json({ error: "User ID and Package ID are required" });
    }

    if (!db) {
      return res.status(503).json({ error: "Database service unavailable." });
    }

    const resolvedPhone = await getAndEnsureUserPhone(userId, userPhone);

    const bookingData = {
      userId,
      userEmail,
      userPhone: resolvedPhone,
      packageId,
      packageDetails,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(
      collection(db, "package_bookings"),
      bookingData,
    );

    // Send email asynchronously so it doesn't block response
    if (userEmail && userEmail !== "unknown_user") {
      sendBookingConfirmationEmail(userEmail, "package", bookingData).catch(
        (err) => console.error("Email send failed", err),
      );
    }

    res
      .status(201)
      .json({ success: true, booking: { id: docRef.id, ...bookingData } });
  } catch (error) {
    console.error("Error booking package:", error);
    res.status(500).json({ error: "Server error booking package" });
  }
};

export const bookHotel = async (req, res) => {
  try {
    const {
      userId,
      hotelId,
      hotelDetails,
      userEmail,
      checkIn,
      checkOut,
      guests,
      userPhone,
    } = req.body;

    if (!userId || !hotelId) {
      return res
        .status(400)
        .json({ error: "User ID and Hotel ID are required" });
    }

    if (!db) {
      return res.status(503).json({ error: "Database service unavailable." });
    }

    const resolvedPhone = await getAndEnsureUserPhone(userId, userPhone);

    const bookingData = {
      userId,
      userEmail,
      userPhone: resolvedPhone,
      hotelId,
      hotelDetails,
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      guests: guests || 1,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "hotel_bookings"), bookingData);

    // Send email asynchronously so it doesn't block response
    if (userEmail && userEmail !== "unknown_user") {
      sendBookingConfirmationEmail(userEmail, "hotel", bookingData).catch(
        (err) => console.error("Email send failed", err),
      );
    }

    res
      .status(201)
      .json({ success: true, booking: { id: docRef.id, ...bookingData } });
  } catch (error) {
    console.error("Error booking hotel:", error);
    res.status(500).json({ error: "Server error booking hotel" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email } = req.query;

    if (!db) {
      return res.status(503).json({ error: "Database service unavailable." });
    }

    let packagesSnapshot, hotelsSnapshot, vehiclesSnapshot;

    let isAdmin = false;
    try {
      // First check if the user is in admins collection
      const adminDoc = await getDoc(doc(db, "admins", userId));
      isAdmin = adminDoc.exists();
      
      // Check query email
      if (!isAdmin && email) {
        if (email === 'admin@reisenova.com' || email === 'nuwanjskr@gmail.com') {
          isAdmin = true;
        }
      }

      // If not, check if they are the hardcoded admin email in the users collection
      if (!isAdmin) {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userEmail = userDoc.data().email;
          if (userEmail === 'admin@reisenova.com' || userEmail === 'nuwanjskr@gmail.com') {
            isAdmin = true;
          }
        }
      }
      console.log(`Checking admin status for userId: ${userId}, isAdmin: ${isAdmin}`);
    } catch (err) {
      console.error("Error checking admin status in bookings:", err);
    }

    if (isAdmin) {
      packagesSnapshot = await getDocs(query(collection(db, "package_bookings")));
      hotelsSnapshot = await getDocs(query(collection(db, "hotel_bookings")));
      vehiclesSnapshot = await getDocs(query(collection(db, "vehicle_bookings")));
    } else {
      packagesSnapshot = await getDocs(
        query(collection(db, "package_bookings"), where("userId", "==", userId)),
      );
      hotelsSnapshot = await getDocs(
        query(collection(db, "hotel_bookings"), where("userId", "==", userId)),
      );

      vehiclesSnapshot = await getDocs(
        query(collection(db, "vehicle_bookings"), where("userId", "==", userId)),
      );
    }
    const packageBookings = [];
    packagesSnapshot.forEach((docSnap) => {
      packageBookings.push({
        id: docSnap.id,
        type: "package",
        ...docSnap.data(),
      });
    });

    const hotelBookings = [];
    hotelsSnapshot.forEach((docSnap) => {
      hotelBookings.push({ id: docSnap.id, type: "hotel", ...docSnap.data() });
    });

    const vehicleBookings = [];
    vehiclesSnapshot.forEach((docSnap) => {
      vehicleBookings.push({
        id: docSnap.id,
        type: "vehicle",
        ...docSnap.data(),
      });
    });
    res.status(200).json({
      packages: packageBookings,
      hotels: hotelBookings,
      vehicles: vehicleBookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Server error fetching bookings" });
  }
};

export const bookVehicle = async (req, res) => {
  try {
    const {
      userId,
      vehicleId,
      vehicleDetails,
      userEmail,
      pickupDate,
      dropoffDate,
      pickupLocation,
      userPhone,
    } = req.body;
    if (!userId || !vehicleId) {
      return res
        .status(400)
        .json({ error: "User ID and Vehicle ID are required" });
    }
    if (!db) {
      return res.status(503).json({ error: "Database service unavailable." });
    }

    const resolvedPhone = await getAndEnsureUserPhone(userId, userPhone);

    const bookingData = {
      userId,
      userEmail,
      userPhone: resolvedPhone,
      vehicleId,
      vehicleDetails,
      pickupDate: pickupDate || null,
      dropoffDate: dropoffDate || null,
      pickupLocation: pickupLocation || "",
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(
      collection(db, "vehicle_bookings"),
      bookingData,
    );
    if (userEmail && userEmail !== "unknown_user") {
      sendBookingConfirmationEmail(userEmail, "vehicle", bookingData).catch(
        (err) => console.error("Email send failed", err),
      );
    }
    res
      .status(201)
      .json({ success: true, booking: { id: docRef.id, ...bookingData } });
  } catch (error) {
    console.error("Error booking vehicle:", error);
    res.status(500).json({ error: "Server error booking vehicle" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId, type } = req.params;
    if (!db) {
      return res.status(503).json({ error: "Database service unavailable." });
    }

    let collectionName = "";
    if (type === "package") collectionName = "package_bookings";
    else if (type === "hotel") collectionName = "hotel_bookings";
    else if (type === "vehicle") collectionName = "vehicle_bookings";
    else return res.status(400).json({ error: "Invalid booking type" });

    const bookingRef = doc(db, collectionName, bookingId);
    await deleteDoc(bookingRef);

    res
      .status(200)
      .json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Server error cancelling booking" });
  }
};
