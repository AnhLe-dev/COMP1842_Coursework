import React from "react";
import Logout from "@/components/auth/Logout";
import { useAuthStore } from "@/stores/useAuthStore";
import Header from "@/components/layout/Header";
import ResponseForm from "@/components/layout/ResponseForm";
import SearchAndFilter from "@/components/layout/SearchAndFilter";
import ResponseTable from "@/components/layout/ResponseTable";
import ResponseDetailModal from "@/components/layout/ResponseDetailModal";
import ResponsePagination from "@/components/layout/ResponsePagination";
import Footer from "@/components/layout/Footer";

// Import custom hook
import { useResponses } from "@/hooks/useResponses";

const AdminPage = () => {
  const user = useAuthStore((s) => s.user);

  // Sử dụng logic từ custom hook
  const {
    responsesBuffer,
    visibleResponses,
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
    page,
    totalPages,
    isModalOpen,
    selectedId,
    handleDataChanged,
    handleOpenModal,
    handleCloseModal,
    handleNext,
    handlePrev,
    handlePageChange,
  } = useResponses();

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      {/* Soft Blue Radial Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage: `
            radial-gradient(circle at top center, rgba(59, 130, 246, 0.5),transparent 70%)
          `,
        }}
      />
      
      <div className="container relative z-10 pt-8 mx-auto">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          {/* Admin Header: User info + logout */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">
              {user?.username}
            </span>
            <Logout />
          </div>

          {/* Page Header (Helpdesk Title) */}
          <Header />

          {/* Create New Response Form (Admin only) */}
          <ResponseForm handleDataChanged={handleDataChanged} />

          {/* Search & Category Filter Toolbar */}
          <SearchAndFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentCategory={category}
            setCategory={setCategory}
          />

          {/* Response List Table */}
          <ResponseTable
            responses={visibleResponses}
            handleDataChanged={handleDataChanged}
            handleOpenModal={handleOpenModal}
          />

          {/* Detail Modal */}
          <ResponseDetailModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            responseId={selectedId}
          />

          {/* Footer (Statistics) */}
          <Footer totalResponses={responsesBuffer.length} />

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row mt-4">
            {totalPages > 1 && (
              <ResponsePagination
                handleNext={handleNext}
                handlePrev={handlePrev}
                handlePageChange={handlePageChange}
                page={page}
                totalPages={totalPages}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;