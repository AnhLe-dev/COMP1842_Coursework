import React, { useEffect, useState } from "react";
import api from "../../lib/axios";

const ResponseDetailModal = ({ isOpen, onClose, responseId }) => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !responseId) {
      return;
    }

    let isCanceled = false;
    setLoading(true);
    setError(null);
    setResponseData(null);

    api
      .get(`/responses/${responseId}`)
      .then((result) => {
        if (!isCanceled) {
          setResponseData(result.data);
        }
      })
      .catch(() => {
        if (!isCanceled) {
          setError("Unable to load data from API.");
        }
      })
      .finally(() => {
        if (!isCanceled) {
          setLoading(false);
        }
      });

    return () => {
      isCanceled = true;
    };
  }, [isOpen, responseId]);

  if (!isOpen) {
    return null;
  }

  const formattedDate = responseData?.createdAt
    ? new Date(responseData.createdAt).toLocaleString("en-US")
    : "Not available";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold">Response Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            X
          </button>
        </div>

        {loading && (
          <div className="py-10 text-center text-slate-600">
            Loading data...
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && !responseData && (
          <div className="py-10 text-center text-slate-600">
            No data available to display.
          </div>
        )}

        {!loading && !error && responseData && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Key</div>
              <div className="mt-2 text-base font-medium text-slate-900">
                {responseData.issueCode ||
                  responseData.key ||
                  "No data"}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Value</div>
              <div className="mt-2 text-base font-medium text-slate-900">
                {responseData.responseText ||
                  responseData.value ||
                  "No data"}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Created Date</div>
              <div className="mt-2 text-base font-medium text-slate-900">
                {formattedDate}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseDetailModal;