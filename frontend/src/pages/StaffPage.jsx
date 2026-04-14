import React, { useState } from "react";
import Logout from "@/components/auth/Logout";
import { useAuthStore } from "@/stores/useAuthStore";
import SearchAndFilter from "@/components/layout/SearchAndFilter";
import ResponseTable from "@/components/layout/ResponseTable";
import ResponseDetailModal from "@/components/layout/ResponseDetailModal";
import ResponsePagination from "@/components/layout/ResponsePagination";
import QuizTest from "@/components/layout/QuizTest";
import Header from "@/components/layout/Header";
import { BrainCircuit, LayoutList } from "lucide-react";

// Import custom hook
import { useResponses } from "@/hooks/useResponses";

const TAB_RESPONSES = "responses";
const TAB_QUIZ = "quiz";

const StaffPage = () => {
  const user = useAuthStore((s) => s.user);
  
  // State quản lý Tab (giữ lại vì đây là logic riêng của StaffPage)
  const [activeTab, setActiveTab] = useState(TAB_RESPONSES);

  // Sử dụng logic dùng chung từ custom hook
  const {
    visibleResponses,
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
    page,
    totalPages,
    isModalOpen,
    selectedId,
    handleOpenModal,
    handleCloseModal,
    handleNext,
    handlePrev,
    handlePageChange,
  } = useResponses();

  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative">
      {/* Background Gradient Dreamy Sky Pink Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
        }}
      />

      <div className="container relative z-10 pt-8 mx-auto">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          {/* Header: User info + Logout */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">
              {user?.username}
            </span>
            <Logout />
          </div>

          {/* Page Header (Helpdesk Title) */}
          <Header />

          {/* Tab Navigation */}
          <div className="flex gap-2 bg-slate-100/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab(TAB_RESPONSES)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === TAB_RESPONSES
                  ? "bg-white shadow-sm text-primary"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <LayoutList className="size-4" />
              Response List
            </button>
            <button
              onClick={() => setActiveTab(TAB_QUIZ)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === TAB_QUIZ
                  ? "bg-white shadow-sm text-primary"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <BrainCircuit className="size-4" />
              Knowledge Test
            </button>
          </div>

          {/* Tab 1: Response List */}
          {activeTab === TAB_RESPONSES && (
            <>
              <SearchAndFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                currentCategory={category}
                setCategory={setCategory}
              />

              <ResponseTable
                responses={visibleResponses}
                handleOpenModal={handleOpenModal}
              />

              <ResponseDetailModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                responseId={selectedId}
              />

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
            </>
          )}

          {/* Tab 2: True/False QuizTest */}
          {activeTab === TAB_QUIZ && <QuizTest />}

        </div>
      </div>
    </div>
  );
};

export default StaffPage;