import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";

const SppMaster = () => {
  const [sppList, setSppList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    itemCode: "",
    itemName: "",
    category: "",
    standardParameter: "",
  });

  const fetchSppData = async () => {
    try {
      const response = await axiosInstance.get("/spp");
      setSppList(response.data);
    } catch (err) {
      console.error("Failed to fetch SPP Master data", err);
    }
  };

  useEffect(() => {
    fetchSppData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axiosInstance.post("/spp", formData);
      fetchSppData(); // Refresh the table
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create SPP entry.");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axiosInstance.put(`/spp/${id}/toggle`);
      fetchSppData();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      itemCode: "",
      itemName: "",
      category: "",
      standardParameter: "",
    });
    setError("");
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary-subtle">
          <div>
            <h2 className="text-dark fw-semibold mb-0">SPP Master Directory</h2>
            <p className="text-muted small mb-0 mt-1">
              Manage standard products and parameters
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary shadow-sm px-4 fw-medium"
          >
            + Add New Item
          </button>
        </div>

        {/* Data Table Card */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-borderless align-middle mb-0">
                <thead className="table-light border-bottom">
                  <tr>
                    <th className="py-3 ps-4 text-secondary">Item Code</th>
                    <th className="py-3 text-secondary">Item Name</th>
                    <th className="py-3 text-secondary">Category</th>
                    <th className="py-3 text-secondary">Parameter</th>
                    <th className="py-3 text-secondary">Status</th>
                    <th className="py-3 pe-4 text-end text-secondary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sppList.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-5 text-muted bg-white"
                      >
                        No master items found. Click "Add New Item" to create
                        one.
                      </td>
                    </tr>
                  ) : (
                    sppList.map((item) => (
                      <tr key={item.id} className="border-bottom">
                        <td className="ps-4 fw-medium text-dark">
                          {item.itemCode}
                        </td>
                        <td className="fw-medium">{item.itemName}</td>
                        <td>
                          <span className="badge bg-secondary-subtle text-secondary">
                            {item.category}
                          </span>
                        </td>
                        <td className="text-muted small">
                          {item.standardParameter || "-"}
                        </td>
                        <td>
                          {item.isActive ? (
                            <span className="badge bg-success">Active</span>
                          ) : (
                            <span className="badge bg-danger">Inactive</span>
                          )}
                        </td>
                        <td className="pe-4 text-end">
                          <button
                            onClick={() => handleToggleStatus(item.id)}
                            className={`btn btn-sm fw-medium ${item.isActive ? "btn-outline-danger" : "btn-outline-success"}`}
                          >
                            {item.isActive ? "Deactivate" : "Activate"}
                          </button>
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

      {/* Bootstrap Modal (Controlled via React State instead of jQuery) */}
      {isModalOpen && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header bg-light border-bottom-0 pt-4 pb-3 px-4">
                  <h5 className="modal-title fw-bold text-dark">
                    Add Master Item
                  </h5>
                  <button
                    type="button"
                    className="btn-close focus-ring"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body px-4 py-3">
                  {error && (
                    <div className="alert alert-danger py-2 small">{error}</div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-medium text-secondary small">
                        Item Code
                      </label>
                      <input
                        type="text"
                        name="itemCode"
                        className="form-control focus-ring"
                        placeholder="e.g., RAW-001"
                        value={formData.itemCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-medium text-secondary small">
                        Item Name
                      </label>
                      <input
                        type="text"
                        name="itemName"
                        className="form-control focus-ring"
                        placeholder="e.g., Calcium Carbonate"
                        value={formData.itemName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-medium text-secondary small">
                          Category
                        </label>
                        <select
                          name="category"
                          className="form-select focus-ring"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="" disabled>
                            Select...
                          </option>
                          <option value="Raw Material">Raw Material</option>
                          <option value="Packaging">Packaging</option>
                          <option value="Finished Good">Finished Good</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-medium text-secondary small">
                          Standard Parameter
                        </label>
                        <input
                          type="text"
                          name="standardParameter"
                          className="form-control focus-ring"
                          placeholder="e.g., pH 7.0 - 7.5"
                          value={formData.standardParameter}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-2">
                      <button
                        type="button"
                        className="btn btn-light fw-medium border"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary fw-medium px-4"
                      >
                        Save Item
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* Modal Backdrop */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default SppMaster;
