export const authMe = async (req, res) => {
  try {
    const user = req.user; // retrieved from authMiddleware

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Error calling authMe", error);
    return res.status(500).json({ message: "Server error" });
  }
};