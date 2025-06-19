// backend/src/controllers/propertyController.ts
import { Request, Response } from 'express';
import Property from '../models/Property';

// ... (keep getAllProperties and getPropertyById)

/**
 * @desc    Create a new property
 * @route   POST /api/properties
 *a @access  Private/Admin
 */
export const createProperty = async (req: Request, res: Response) => {
  try {
    const property = new Property({
      ...req.body,
      // You might want to link to the user who created it, e.g.,
      // user: req.user._id 
    });
    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    res.status(400).json({ message: 'Error creating property', error });
  }
};

/**
 * @desc    Update a property
 * @route   PUT /api/properties/:id
 * @access  Private/Admin
 */
export const updateProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      // Update all fields provided in the request body
      Object.assign(property, req.body);
      
      const updatedProperty = await property.save();
      res.json(updatedProperty);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating property', error });
  }
};

/**
 * @desc    Delete a property
 * @route   DELETE /api/properties/:id
 * @access  Private/Admin
 */
export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      await property.deleteOne(); // Use deleteOne() on the document
      res.json({ message: 'Property removed' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property', error });
  }
};
// import { Request, Response } from 'express';
// import Property from '../models/Property'; // Your Mongoose Property model

// /**
//  * @desc    Fetch all properties
//  * @route   GET /api/properties
//  * @access  Public
//  */
export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const properties = await Property.find({});
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties', error });
  }
};

/**
 * @desc    Fetch a single property by ID
 * @route   GET /api/properties/:id
 * @access  Public
 */
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Property not found', error });
  }
};