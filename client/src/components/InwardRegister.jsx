import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const InwardRegister = () => {
  const [entries, setEntries] = useState([]);
  const [sppItems, setSppItems] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Wire up the form to state
  const [formData, setFormData] = useState({
    sppMasterId: "",
    batchNumber: "",
    quantityReceived: "",
    isHod: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both the table entries and the master dropdown list simultaneously
        const [inwardRes, sppRes] = await Promise.all([
          axiosInstance.get("/inward"),
          axiosInstance.get("/spp"),
        ]);

        setEntries(inwardRes.data);
        // Only populate the dropdown with active items
        setSppItems(sppRes.data.filter((item) => item.isActive));
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        } else {
          setError("Failed to load data. Please try again.");
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const handleSaveEntry = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.sppMasterId || !formData.quantityReceived) {
      setError("Please select an item and enter a quantity.");
      return;
    }

    try {
      // Find the name of the selected item to save alongside the ID
      const selectedItem = sppItems.find(
        (item) => item.id === parseInt(formData.sppMasterId),
      );

      const payload = {
        sppMasterId: selectedItem.id,
        itemName: selectedItem.itemName,
        batchNumber: formData.batchNumber,
        quantityReceived: formData.quantityReceived,
        isHod: formData.isHod,
      };

      await axiosInstance.post("/inward", payload);

      // Refresh the table and reset the form on success
      const updatedEntries = await axiosInstance.get("/inward");
      setEntries(updatedEntries.data);
      setFormData({
        sppMasterId: "",
        batchNumber: "",
        quantityReceived: "",
        isHod: false,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save entry.");
    }
  };

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="mb-4 pb-3 border-bottom border-secondary-subtle">
        <h2 className="text-dark fw-semibold mb-0">Inward Register</h2>
        <p className="text-muted small mb-0 mt-1">
          Log and track incoming samples
        </p>
      </div>

      {error && <div className="alert alert-danger shadow-sm">{error}</div>}

      <div className="row g-4">
        {/* Form Column */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white py-3">
              <h5 className="mb-0 fw-semibold">New Entry</h5>
            </div>
            <div className="card-body bg-white p-4">
              <form onSubmit={handleSaveEntry}>
                <div className="mb-3">
                  <label className="form-label fw-medium text-secondary">
                    Select Item
                  </label>
                  <select
                    id="sppMasterId"
                    className="form-select focus-ring"
                    value={formData.sppMasterId}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      -- Choose from Master List --
                    </option>
                    {sppItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.itemCode} - {item.itemName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium text-secondary">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    id="batchNumber"
                    className="form-control focus-ring"
                    placeholder="Enter batch no."
                    value={formData.batchNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium text-secondary">
                    Quantity Received
                  </label>
                  <input
                    type="number"
                    id="quantityReceived"
                    className="form-control focus-ring"
                    placeholder="0"
                    value={formData.quantityReceived}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-check form-switch mb-4 mt-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isHod"
                    checked={formData.isHod}
                    onChange={handleInputChange}
                  />
                  <label
                    className="form-check-label fw-medium text-secondary"
                    htmlFor="isHod"
                  >
                    Requires HOD Approval
                  </label>
                </div>
                <button
                  type="submit"
                  className="btn btn-success w-100 fw-bold shadow-sm"
                >
                  Save Entry
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Table Column */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-borderless align-middle mb-0">
                  <thead className="table-light border-bottom">
                    <tr>
                      <th className="py-3 ps-4 text-secondary">ID</th>
                      <th className="py-3 text-secondary">Item Name</th>
                      <th className="py-3 text-secondary">Batch</th>
                      <th className="py-3 text-secondary">Qty</th>
                      <th className="py-3 text-secondary">HOD Status</th>
                      <th className="py-3 pe-4 text-secondary">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-5 text-muted bg-white"
                        >
                          No inward entries found.
                        </td>
                      </tr>
                    ) : (
                      entries.map((entry) => (
                        <tr key={entry.id} className="border-bottom">
                          <td className="ps-4 fw-medium text-dark">
                            #{entry.id}
                          </td>
                          <td className="fw-medium">{entry.itemName}</td>
                          <td>
                            <span className="badge bg-secondary-subtle text-secondary">
                              {entry.batchNumber}
                            </span>
                          </td>
                          <td>{entry.quantityReceived || entry.quantity}</td>
                          <td>
                            {entry.status === "Approved" ? (
                              <span className="badge bg-success">Approved</span>
                            ) : entry.status === "Rejected" ? (
                              <span className="badge bg-danger">Rejected</span>
                            ) : entry.isHod ? (
                              <span className="badge bg-warning text-dark">
                                Pending
                              </span>
                            ) : (
                              <span className="badge bg-success">Approved</span>
                            )}
                          </td>
                          <td className="pe-4 text-muted small">
                            {entry.remarks || "-"}
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
      </div>
    </div>
  );
};

export default InwardRegister;
