import { Request, Response } from "express";
import SupportRequest from "../models/SupportRequest";
import TechnicianVisit from "../models/TechnicianVisit";
import Booking from "../models/Booking";
import { sendEmail } from "../utils/emailService";
export const createSupportRequest = async (req: Request, res: Response) => {
  console.log("inside support")
  // try {
    console.log(req.body)

    const newRequest = new SupportRequest({
      bookingId: req.body.bookingId,
      propertyId: req.body.propertyId,
      issue: req.body.issue,
      status: req.body.status ? req.body.status : "Open",
      ticketReference: `TICKET-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    });
    await newRequest.save();
    res.status(201).json(newRequest);
  // } catch (error) {
  //   res.status(400).json({ message: "Error creating support request", error });
  // }
};
export const getAllSupportRequests = async (req: Request, res: Response) => {
  try {
    const requests = await SupportRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
};
export const updateSupportRequestStatus: any = async (
  req: Request,
  res: Response
) => {
  try {
    const { status } = req.body;
    const request = await SupportRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ message: "Error updating status", error });
  }
};
export const scheduleTechnicianVisit: any = async (
  req: Request,
  res: Response
) => {
  const { technicianName, scheduledAt, notes } = req.body;
  const supportRequestId = req.params.id;

  try {
    // 1. Find the original support request
    const supportRequest = await SupportRequest.findById(supportRequestId);
    if (!supportRequest) {
      return res.status(404).json({ message: "Support request not found" });
    }

    // 2. Create the new technician visit
    const visit = new TechnicianVisit({
      supportRequestId,
      technicianName,
      scheduledAt,
      notes,
    });
    await visit.save();

    // 3. Update the support request's status
    supportRequest.status = "Technician Scheduled";
    await supportRequest.save();

    // 4. Notify the guest via email
    const booking: any = await Booking.findById(
      supportRequest.bookingId
    ).populate("user");
    if (booking && booking.user) {
      await sendEmail({
        to: booking.user.email,
        subject: `Technician Visit Scheduled for Your Stay at ${booking.propertyName}`,
        text: `Hi ${
          booking.user.name
        },\n\nA technician has been scheduled to address the issue you reported.
               \nVisit Details:
               \nDate & Time: ${new Date(scheduledAt).toLocaleString()}
               \nTechnician: ${technicianName}
               \nReason: ${supportRequest.issue}
               \nWe apologize for the inconvenience and aim to resolve this for you promptly.
               \n\nThe Digital Guidebook Team`,
        html: `<p>Hi <strong>${booking.user.name}</strong>,</p>
               <p>A technician has been scheduled to address the issue you reported (<em>${
                 supportRequest.issue
               }</em>).</p>
               <h3>Visit Details:</h3>
               <ul>
                 <li><strong>Date & Time:</strong> ${new Date(
                   scheduledAt
                 ).toLocaleString()}</li>
                 <li><strong>Technician:</strong> ${technicianName}</li>
               </ul>
               <p>We apologize for the inconvenience and aim to resolve this for you promptly.</p>
               <p>The Digital Guidebook Team</p>`,
      });
    }

    res.status(201).json(visit);
  } catch (error) {
    res.status(400).json({ message: "Error scheduling technician", error });
  }
};
