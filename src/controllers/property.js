import Property from "../models/property.js";

export const createProperty = async (req, res) => {
    res.send("Create Property Endpoint");
};

export const getLandlordProperties = async (req, res) => {
    res.send("Get Landlord Properties Endpoint");
}

export const updatePropertyAvailability = async (req, res) => {
    res.send("Update Property Availability Endpoint");
}

export const getAllProperties = async (req, res) => {
    const { page = 1, location} = req.query;
    const limit = 12; // Number of properties per page
    const skip = (page - 1) * limit; // Calculate the number of properties to skip
    try {
        const filter = {
            availability: "available"
        };
        if (location) {
            filter.location = { $regex: location, $options: "i" }; // Case-insensitive search
        }
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
    res.send("Get Property by ID Endpoint");
}