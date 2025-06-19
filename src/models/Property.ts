import { Schema, model, Document } from "mongoose";

// Interface for appliance details
interface IAppliance {
  name: string;
  model?: string;
  manual_text: string;
}

// Main property interface
interface IProperty extends Document {
  name: string;
  address: string;
  description: string;
  heroImage: string; // URL to a main image
  images: string[]; // Array of image URLs
  amenities: string[];
  wifi_ssid: string;
  wifi_password?: string;
  checkin_instructions: string;
  checkout_instructions: string;
  appliances: IAppliance[];
}

const PropertySchema = new Schema<IProperty>(
  {
    name: { type: String, required: true },
    // ... add all other fields here
    appliances: [
      {
        name: { type: String, required: true },
        model: { type: String },
        manual_text: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default model<IProperty>("Property", PropertySchema);
