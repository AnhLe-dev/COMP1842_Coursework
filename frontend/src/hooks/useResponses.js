import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { visibleResponseLimit } from "@/lib/data";

export const useResponses = () => {
  // 1. State Management
  const [responsesBuffer, setResponsesBuffer] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2. API Logic
  const fetchResponses = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/responses");
      const data = res.data.data || res.data;
      setResponsesBuffer(data);
    } catch (error) {
      console.error("Error retrieving response data:", error);
      toast.error("An error occurred while loading the list from the server.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Lifecycle
  useEffect(() => {
    fetchResponses();
  }, []);

  // Reset về trang 1 khi tìm kiếm hoặc đổi category
  useEffect(() => {
    setPage(1);
  }, [searchQuery, category]);

  // 4. Filter Logic
  const filteredResponses = responsesBuffer.filter((item) => {
    const matchCategory = category === "All" || item.category === category;
    const searchLower = searchQuery.toLowerCase();
    const matchSearch =
      (item.issueCode && item.issueCode.toLowerCase().includes(searchLower)) ||
      (item.responseText &&
        item.responseText.toLowerCase().includes(searchLower));
    return matchCategory && matchSearch;
  });

  // 5. Pagination Logic
  const totalPages = Math.ceil(filteredResponses.length / visibleResponseLimit) || 1;

  const visibleResponses = filteredResponses.slice(
    (page - 1) * visibleResponseLimit,
    page * visibleResponseLimit
  );

  // Tự động lùi trang nếu trang hiện tại không còn dữ liệu (sau khi delete)
  useEffect(() => {
    if (visibleResponses.length === 0 && page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [visibleResponses, page]);

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // 6. Modal Logic
  const handleOpenModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

  // Callback khi dữ liệu thay đổi (thêm/xóa/sửa)
  const handleDataChanged = () => {
    fetchResponses();
  };

  return {
    // Data & State
    responsesBuffer,
    visibleResponses,
    searchQuery,
    category,
    page,
    totalPages,
    isModalOpen,
    selectedId,
    isLoading,

    // Setters
    setSearchQuery,
    setCategory,
    setPage,

    // Actions
    fetchResponses,
    handleDataChanged,
    handleOpenModal,
    handleCloseModal,
    handleNext,
    handlePrev,
    handlePageChange,
  };
};