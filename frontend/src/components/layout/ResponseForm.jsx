import React, { useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner"; // Notification library
import api from "../../lib/axios";
import { formCategories } from "@/lib/data";

// Receives handleDataChanged prop from HomePage to automatically refresh the list
const ResponseForm = ({ handleDataChanged }) => {
  // State Management
  const [formData, setFormData] = useState({
    issueCode: "",
    responseText: "",
    category: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle sending data to the Database
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if the user has entered all required data
    if (
      !formData.issueCode.trim() ||
      !formData.responseText.trim() ||
      !formData.category
    ) {
      toast.error("Please fill in all information!");
      return;
    }

    try {
      // Call POST API to save to database
      await api.post("/responses", formData);

      // Success notification
      toast.success(`Successfully added issue code ${formData.issueCode}!`);

      // Reset form for next input
      setFormData({
        issueCode: "",
        responseText: "",
        category: "",
      });

      // Call this to trigger HomePage to reload the latest list
      if (handleDataChanged) {
        handleDataChanged();
      }
    } catch (error) {
      console.error("Error adding response:", error);

      // Catch error from Backend (e.g., Duplicate Issue Code)
      const errorMsg =
        error.response?.data?.message || "An error occurred while adding new data.";
      toast.error(errorMsg);
    }
  };

  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Row 1: Issue Code and Category */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="text"
            name="issueCode"
            placeholder="Issue Code (e.g., PWD_RESET)"
            value={formData.issueCode}
            onChange={handleChange}
            className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
            required
          />

          {/* Category Select */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="h-12 px-3 rounded-md border border-border/50 bg-slate-50 text-base focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-48 text-slate-600"
            required
          >
            <option value="" disabled>
              -- Select Category --
            </option>
            {/* <option value="Account">Account</option>
            <option value="Payment">Payment</option>
            <option value="Technical">Technical</option>
            <option value="Service">Service</option>
            <option value="General">General</option> */}
            {formCategories.map(cat => (
  <option key={cat} value={cat}>{cat}</option>
))}
          </select>
        </div>

        {/* Row 2: Response Text and Submit Button */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="text"
            name="responseText"
            placeholder="Instructional response content for customers..."
            value={formData.responseText}
            onChange={handleChange}
            className="h-12 text-base bg-slate-50 sm:flex-[3] border-border/50 focus:border-primary/50 focus:ring-primary/20"
            required
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="gradient"
            size="xl"
            className="px-6 flex items-center justify-center gap-2 sm:flex-1"
          >
            <Plus size={20} strokeWidth={2.5} />
            Add New
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ResponseForm;