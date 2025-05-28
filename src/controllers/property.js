import Property from "../models/property.js";

export const createProperty = async (req, res) => {
    res.send("Create Property Endpoint");
};

export const getLandlordProperties = async (req, res) => {
    const { userId } = req.user;
    const { page = 1 } = req.query;
    const limit = 5; // Number of properties per page
    const skip = (page - 1) * limit; // Calculate the number of properties to skip
    try {
        const properties = await Property.find({landlord: userId})
        .sort("-createdAt")
        .skip(skip)
        .limit(limit);
        const [total, availableProperties, rentedProperties] = await Promise.all([
            Property.countDocuments({landlord: userId}),   
            Property.countDocuments({landlord: userId, availability: "available"}),
            Property.countDocuments({landlord: userId, availability: "rented"})
        ]);
        // const total = await Property.countDocuments({landlord: userId});
        const totalPages = Math.ceil(total / limit);
        // const availableProperties = await Property.countDocuments({
        //     landlord: userId, 
        //     availability: "available"});
        // const rentedProperties = await Property.countDocuments({
        //     landlord: userId, 
        //     availability: "rented"});
        res.status(200).json({total, availableProperties, rentedProperties,totalPages, currentPage: parseInt(page), properties});
    } catch (error) {
        console.error("Error fetching landlord properties:", error);
        res.status(500).json({ message: error.message });
        
    }
}

export const updatePropertyAvailability = async (req, res) => {
    const { propertyId } = req.params;
    const { availability } = req.body; // Expecting availability to be passed in the request body
    if(!availability){
        return res.status(400).json({ message: "Availability status is required." });
    }
    try {
        const property = await Property.findById(propertyId);
        property.availability = availability; // Update the availability status
        await property.save(); // Save the updated property

        res.status(200).json({success:true, message: "Property availability updated successfully.", property });
    } catch (error) {
        console.error("Error updating property availability:", error);
        res.status(500).json({ message: error.message });
    }

}

export const getAllProperties = async (req, res) => {
    const { page = 1, location, budget, type} = req.query;
    const limit = 12; // Number of properties per page
    const skip = (page - 1) * limit; // Calculate the number of properties to skip
    try {
        const filter = {
            availability: "available"
        };
        if (location) {
            filter.location = { $regex: location, $options: "i" }; // Case-insensitive search
        }
        if(budget){
            filter.price = { $lte: parseInt(budget) }; // Filter by budget
        }
        if(type){
            filter.title = { $regex: type, $options: "i" }; // Filter by property type
        }
        // Fetch properties with pagination and filtering
        const properties = await Property.find(filter)
        .sort("-createdAt")
        .skip(skip)
        .limit(limit);

        const totalProperties = await Property.countDocuments(filter);
        const totalPages = Math.ceil(totalProperties / limit);
        res.status(200).json({totalPages,currentPage: parseInt(page), num:properties.length, properties});
    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({message: error.message});
    }
}
export const getPropertyById = async (req, res) => {
    const { propertyId } = req.params;
    try {
        const property = await Property.findById(propertyId).populate(
            "landlord", 
            "fullName email phoneNumber image");

        // more properties from the same landlord
        const moreProperties = await Property.find({
            _id: { $ne: propertyId }, // Exclude the current property
            landlord: property.landlord._id, // Ensure same landlord
            availability: "available" // Only available properties
        }).limit(3).sort("-createdAt"); // Fetch 3 more properties

        // similar properties based on location and price range of 20% of the property's price
        const priceRange = property.price * 0.2; // 20% of the property's price
        const similarProperties = await Property.find({
            _id: { $ne: propertyId }, // Exclude the current property
            availability: "available", // Only available properties
            // location: property.location, // Same location
            price: { 
                $gte: property.price - priceRange, 
                $lte: property.price + priceRange }, // Price range
        }).limit(3).sort("-createdAt"); // Fetch 3 similar properties

        res.status(200).json({success: true, property, moreProperties, similarProperties});
    } catch (error) {
        console.error("Error fetching property by ID:", error);
        res.status(500).json({success: false, message: error.message});
    }
}