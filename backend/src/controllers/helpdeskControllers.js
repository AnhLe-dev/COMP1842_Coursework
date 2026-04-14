import HelpdeskResponse from "../models/helpdeskModel.js";

// ==========================================
// 1. READ: Get all responses
// ==========================================
export const getResponses = async (req, res) => {
  try {
    const responses = await HelpdeskResponse.find().sort({ createdAt: -1 });

    res.status(200).json(responses);
  } catch (error) {
    console.error("Error calling getResponses", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// 1.1 READ: Get a single response by ID (For EditPage.jsx)
// ==========================================
export const getResponseById = async (req, res) => {
  try {
    const response = await HelpdeskResponse.findById(req.params.id);

    if (!response) {
      return res.status(404).json({ message: "Response does not exist" });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error calling getResponseById", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// 2. CREATE: Add a new response
// ==========================================
export const createResponse = async (req, res) => {
  try {
    const { issueCode, responseText, category, priority } = req.body;

    const response = new HelpdeskResponse({
      issueCode,
      responseText,
      category,
      // priority,
    });

    const newResponse = await response.save();
    res.status(201).json(newResponse);
  } catch (error) {
    console.error("Error calling createResponse", error);
    // Catch duplicate Issue Code error (MongoDB error code 11000)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "This Issue Code already exists!" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// 3. UPDATE: Update response content
// ==========================================
export const updateResponse = async (req, res) => {
  try {
    const { issueCode, responseText, category, priority } = req.body;

    const updatedResponse = await HelpdeskResponse.findByIdAndUpdate(
      req.params.id,
      {
        issueCode,
        responseText,
        category,
        // priority,
      },
      { new: true }, // Returns the updated data
    );

    if (!updatedResponse) {
      return res.status(404).json({ message: "Response does not exist" });
    }

    res.status(200).json(updatedResponse);
  } catch (error) {
    console.error("Error calling updateResponse", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// 4. DELETE: Delete response (Hard Delete similar to Task)
// ==========================================
export const deleteResponse = async (req, res) => {
  try {
    // Uses findByIdAndDelete exactly like your deleteTask
    const deletedResponse = await HelpdeskResponse.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedResponse) {
      return res.status(404).json({ message: "Response does not exist" });
    }

    res.status(200).json(deletedResponse);
  } catch (error) {
    console.error("Error calling deleteResponse", error);
    res.status(500).json({ message: "Server error" });
  }
};