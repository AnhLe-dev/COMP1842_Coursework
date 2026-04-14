import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  CircleAlert,
  Eye,
  SquarePen,
  Trash2,
  MessageSquare,
  Check,
  X,
} from "lucide-react";
import { Input } from "../ui/input";
import api from "../../lib/axios";
import { toast } from "sonner";
import { formCategories } from "@/lib/data";

// ==========================================
// Component 1: Empty State UI
// ==========================================
const EmptyState = () => (
  <Card className="p-8 text-center border-0 bg-gradient-card shadow-custom-md">
    <div className="space-y-3">
      <CircleAlert className="mx-auto size-12 text-muted-foreground opacity-50" />
      <div>
        <h3 className="font-medium text-foreground">
          No responses found.
        </h3>
        <p className="text-sm text-muted-foreground">
          Please add a new issue code or change the search filters.
        </p>
      </div>
    </div>
  </Card>
);

// ==========================================
// Component 2: Individual Card Item
// ==========================================
const ResponseCard = ({ item, index, handleDataChanged, handleOpenModal, readOnly = false }) => {
  const [isEditting, setIsEditting] = useState(false);

  const [editData, setEditData] = useState({
    issueCode: item.issueCode,
    responseText: item.responseText,
    category: item.category,
  });

  const deleteResponse = async () => {
    try {
      await api.delete(`/responses/${item._id}`);
      toast.success("Response deleted successfully.");
      handleDataChanged();
    } catch (error) {
      console.dir(error);
      toast.error("Error deleting data.");
    }
  };

  const updateResponse = async () => {
    try {
      await api.put(`/responses/${item._id}`, editData);
      toast.success("Response updated successfully.");
      setIsEditting(false);
      handleDataChanged();
    } catch (error) {
      console.dir(error);
      const errorMsg =
        error.response?.data?.message || "Error updating data.";
      toast.error(errorMsg);
    }
  };

  return (
    <Card
      className="p-4 bg-gradient-card border border-border/50 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* LEFT CLUSTER: Icon + Content */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Illustration Icon */}
        <div className="flex-shrink-0 flex items-center justify-center size-12 rounded-full bg-blue-50 text-blue-600">
          <MessageSquare className="size-6" />
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          {isEditting ? (
            // Edit Form
            <div className="space-y-3 w-full">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="text"
                  value={editData.issueCode}
                  onChange={(e) =>
                    setEditData({ ...editData, issueCode: e.target.value })
                  }
                  className="h-10 text-sm font-bold bg-white w-full sm:w-auto"
                  placeholder="Issue Code"
                />
                <select
                  value={editData.category}
                  onChange={(e) =>
                    setEditData({ ...editData, category: e.target.value })
                  }
                  className="h-10 px-3 text-sm rounded-md border border-border/50 bg-white"
                >
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

              <Input
                type="text"
                value={editData.responseText}
                onChange={(e) =>
                  setEditData({ ...editData, responseText: e.target.value })
                }
                className="h-10 text-sm bg-white"
                placeholder="Response content"
                onKeyPress={(e) => e.key === "Enter" && updateResponse()}
              />

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={updateResponse}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="size-4 mr-1" /> Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsEditting(false);
                    setEditData({
                      issueCode: item.issueCode,
                      responseText: item.responseText,
                      category: item.category,
                    });
                  }}
                >
                  <X className="size-4 mr-1" /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            // Normal Text View
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-800">
                  {item.issueCode}
                </h4>
                <Badge
                  variant="secondary"
                  className="text-xs bg-slate-200 text-slate-700 hover:bg-slate-300 border-transparent font-medium"
                >
                  {item.category}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 mt-0.5 truncate">
                {item.responseText}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT CLUSTER: Action Buttons */}
      {!isEditting && (
        <div className="flex items-center gap-2 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="outline"
            size="icon"
            className="size-9 text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200"
            onClick={() => handleOpenModal(item._id)}
            title="View Details"
          >
            <Eye className="size-4" />
          </Button>

          {!readOnly && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="size-9 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200"
                onClick={() => setIsEditting(true)}
                title="Edit"
              >
                <SquarePen className="size-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="size-9 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                onClick={deleteResponse}
                title="Delete"
              >
                <Trash2 className="size-4" />
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

// ==========================================
// Component 3: Main List/Table
// ==========================================
const ResponseTable = ({
  responses = [],
  handleDataChanged,
  handleOpenModal,
}) => {
  if (!responses || responses.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      {responses.map((item, index) => (
        <ResponseCard
          key={item._id}
          item={item}
          index={index}
          handleDataChanged={handleDataChanged}
          handleOpenModal={handleOpenModal}
          readOnly={!handleDataChanged}
        />
      ))}
    </div>
  );
};

export default ResponseTable;