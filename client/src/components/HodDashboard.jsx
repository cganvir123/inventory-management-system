import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const HodDashboard = () => {
  const [pendingEntries, setPendingEntries] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchPendingData = async () => {
    try {
      const response = await axiosInstance.get("/inward/pending");
      setPendingEntries(response.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      } else {
        setError("Failed to load pending approvals.");
      }
    }
  };

  useEffect(() => {
    fetchPendingData();
  }, [navigate]);

  const handleAction = async (id, status) => {
    // Optional: Prompt for remarks if rejected
    let remarks = "";
    if (status === "Rejected") {
      remarks = window.prompt("Please provide a reason for rejection:");
      if (remarks === null) return; // User cancelled the prompt
    }

    try {
      await axiosInstance.put(`/inward/${id}/status`, { status, remarks });
      fetchPendingData(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || `Failed to mark as ${status}.`);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4 pb-3 border-bottom border-secondary-subtle">
        <h2 className="text-dark fw-semibold mb-0">HOD Approval Queue</h2>
        <p className="text-muted small mb-0 mt-1">
          Review and authorize flagged inward entries
        </p>
      </div>

      {error && <div className="alert alert-danger shadow-sm">{error}</div>}

      <div className="card shadow-sm border-0">
        <div className="card-header bg-warning text-dark py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold">Action Required</h5>
          <span className="badge bg-dark text-white rounded-pill">
            {pendingEntries.length} Pending
          </span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-borderless align-middle mb-0">
              <thead className="table-light border-bottom">
                <tr>
                  <th className="py-3 ps-4 text-secondary">ID</th>
                  <th className="py-3 text-secondary">Item Name</th>
                  <th className="py-3 text-secondary">Batch</th>
                  <th className="py-3 text-secondary">Qty</th>
                  <th className="py-3 pe-4 text-end text-secondary">
                    Decision
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingEntries.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-5 text-muted bg-white"
                    >
                      <i className="bi bi-check-circle text-success fs-2 d-block mb-2"></i>
                      All caught up! No pending approvals.
                    </td>
                  </tr>
                ) : (
                  pendingEntries.map((entry) => (
                    <tr key={entry.id} className="border-bottom">
                      <td className="ps-4 fw-medium text-dark">#{entry.id}</td>
                      <td className="fw-medium">{entry.itemName}</td>
                      <td>
                        <span className="badge bg-secondary-subtle text-secondary">
                          {entry.batchNumber}
                        </span>
                      </td>
                      <td>{entry.quantityReceived || entry.quantity}</td>
                      <td className="pe-4 text-end">
                        <div className="btn-group shadow-sm">
                          <button
                            onClick={() => handleAction(entry.id, "Approved")}
                            className="btn btn-sm btn-success fw-medium px-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(entry.id, "Rejected")}
                            className="btn btn-sm btn-danger fw-medium px-3"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HodDashboard;
