import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const InwardRegister = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    itemName: "",
    batchNumber: "",
    quantityReceived: "",
    isHod: false,
    remarks: "",
  });

  // Fetch entries when the component loads
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axiosInstance.get("/inward");
      setEntries(response.data);
    } catch (error) {
      console.error("Failed to fetch entries", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/inward", formData);
      // Reset form and refresh table
      setFormData({
        itemName: "",
        batchNumber: "",
        quantityReceived: "",
        isHod: false,
        remarks: "",
      });
      fetchEntries();
    } catch (error) {
      console.error("Failed to submit entry", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h2>Sample Management: Inward Register</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="row">
        {/* Form Section */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">New Entry</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Item Name</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Batch Number</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Quantity Received
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    name="quantityReceived"
                    value={formData.quantityReceived}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isHodCheck"
                    name="isHod"
                    checked={formData.isHod}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label fw-bold"
                    htmlFor="isHodCheck"
                  >
                    HOD Approval Required
                  </label>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Remarks</label>
                  <textarea
                    className="form-control form-control-sm"
                    name="remarks"
                    rows="2"
                    value={formData.remarks}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-success btn-sm w-100">
                  Save Entry
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <table className="table table-hover table-striped mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Batch</th>
                    <th>Qty</th>
                    <th>HOD</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length > 0 ? (
                    entries.map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.id}</td>
                        <td>{entry.itemName}</td>
                        <td>{entry.batchNumber}</td>
                        <td>{entry.quantityReceived}</td>
                        <td>
                          {entry.isHod ? (
                            <span className="badge bg-warning text-dark">
                              Yes
                            </span>
                          ) : (
                            <span className="badge bg-secondary">No</span>
                          )}
                        </td>
                        <td
                          className="text-truncate"
                          style={{ maxWidth: "150px" }}
                        >
                          {entry.remarks}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No inward entries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InwardRegister;
