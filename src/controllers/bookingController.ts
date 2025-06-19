// src/controllers/bookingController.ts
import { Request, Response } from "express";
import Booking, { IBooking } from "../models/Booking";
import { sendEmail } from "../utils/emailService"; // Import our email service

// export const createBooking = async (req: Request, res: Response) => {
//   try {
//       const userId = req.user?._id;
//     const bookingData = { ...req.body, user: userId };

//     const newBooking = new Booking(bookingData);
//     const savedBooking = await newBooking.save();
//     res.status(201).json(savedBooking);
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating booking', error });
//   }
// };

// export const getAllBookings = async (req: Request, res: Response) => {
//   try {
//     const bookings = await Booking.find({ user: req.user?._id }).sort({ createdAt: -1 });
//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching bookings', error });
//   }
// };
export const getAllBookings = async (req: Request, res: Response) => {
  // try {
  const isAdmin = req.user?.role === "admin";

  const query = isAdmin ? {} : { user: req.user?._id };

  const bookings = await Booking.find(query).sort({ createdAt: -1 });

  res.json(bookings);
  // } catch (error) {
  //   res.status(500).json({ message: 'Error fetching bookings', error });
  // }
};

// export const updateBookingStatus = async (req: Request, res: Response) => {
//   try {
//     const { status }: { status: IBooking['status'] } = req.body;
//     const booking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }
//     res.status(200).json(booking);
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating status', error });
//   }
// };
// src/controllers/bookingController.ts
// ... (imports)

// export const updateBookingStatus:any = async (req: Request, res: Response) => {
//   try {
//     const { status }: { status: IBooking['status'] } = req.body;
//     let updateData: { status: IBooking['status']; accessCode?: string } = { status };

//     // --- NEW LOGIC ---
//     // If the booking is being confirmed, generate an access code.
//     if (status === 'Confirmed') {
//       // Generate a simple 6-digit code for the demo
//       const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
//       updateData.accessCode = accessCode;
//     }
//     // --- END NEW LOGIC ---

//     const booking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       updateData, // Use the new updateData object
//       { new: true }
//     );
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }
//     res.status(200).json(booking);
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating status', error });
//   }
// };

// We also need a way to get a single booking's details
export const getBookingById: any = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error });
  }
};

// --- When a NEW Booking is Created ---
export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const bookingData = { ...req.body, user: userId };
    const newBooking = new Booking(bookingData);
    const savedBooking = await newBooking.save();

    // --- SEND EMAIL TO ADMIN ---
    try {
      await sendEmail({
        to: "prajwal.singh.226@gmail.com", // Your admin email
        subject: "New Booking Received!",
        text: `A new booking has been made for ${savedBooking.propertyName}. Please log in to your dashboard to review and confirm. Booking ID: ${savedBooking._id}`,
        html: `<p>A new booking has been made for <strong>${savedBooking.propertyName}</strong>.</p><p>Please log in to your dashboard to review and confirm.</p><p>Booking ID: ${savedBooking._id}</p>`,
      });
      console.log("New booking notification sent to admin.");
    } catch (emailError) {
      console.error("Email Error (Admin Notification):", emailError);
      // Don't fail the whole request if email fails
    }
    // --- END EMAIL LOGIC ---

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: "Error creating booking", error });
  }
};

export const getMyBookings: any = async (req: Request, res: Response) => {
  console.log("getMyBookings", req.user);
  try {
    // req.user is attached by the 'protect' middleware
    console.log("inside the try block");
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    console.log("inside the after user in try block");

    // Find bookings where the 'user' field matches the logged-in user's ID
    const bookings = await Booking.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    console.log("booking", bookings);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bookings", error });
  }
};
// --- When a Booking is CONFIRMED ---
export const updateBookingStatus: any = async (req: Request, res: Response) => {
  try {
    const { status }: { status: IBooking["status"] } = req.body;
    let updateData: { status: IBooking["status"]; accessCode?: string } = {
      status,
    };
    // console.log("updateDat",updateData)
    const bookingToUpdate: any = await Booking.findById(req.params.id);
    // console.log("bookingToUpdate",bookingToUpdate)
    if (!bookingToUpdate) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (status === "Confirmed" && bookingToUpdate.status !== "Confirmed") {
      const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
      updateData.accessCode = accessCode;

      // --- SEND EMAIL TO GUEST ---
      try {
        if (bookingToUpdate.user && "email" in bookingToUpdate.user) {
          await sendEmail({
            to: (bookingToUpdate.user as any).email,
            subject: "Your Digital Guidebook Booking is Confirmed!",
            text: `Hi ${
              (bookingToUpdate.user as any).name
            },\n\nYour booking for ${
              bookingToUpdate.propertyName
            } is confirmed!\n\nCheck-in: ${new Date(
              bookingToUpdate.checkInDate
            ).toLocaleDateString()}\nYour secure access code is: ${accessCode}\n\nEnjoy your stay!`,
            html: `
                    <h2>Your Booking is Confirmed!</h2>
                    <p>Hi <strong>${
                      (bookingToUpdate.user as any).name
                    }</strong>,</p>
                    <p>Your booking for <strong>${
                      bookingToUpdate.propertyName
                    }</strong> is confirmed and we can't wait to host you.</p>
                    <h3>Trip Details:</h3>
                    <ul>
                        <li><strong>Check-in:</strong> ${new Date(
                          bookingToUpdate.checkInDate
                        ).toLocaleDateString()}</li>
                        <li><strong>Check-out:</strong> ${new Date(
                          bookingToUpdate.checkOutDate
                        ).toLocaleDateString()}</li>
                    </ul>
                    <h3>Your Secure Access Code:</h3>
                    <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px; background-color: #f4f4f4; padding: 10px; border-radius: 5px;">${accessCode}</p>
                    <p>You can view all your trip details by logging into your account.</p>
                    <p>Enjoy your stay!<br/>The Digital Guidebook Team</p>
                `,
          });
          console.log(
            `Confirmation email sent to ${(bookingToUpdate.user as any).email}.`
          );
        }
      } catch (emailError) {
        console.error("Email Error (Guest Confirmation):", emailError);
      }
      // --- END EMAIL LOGIC ---
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: "Error updating status", error });
  }
};
