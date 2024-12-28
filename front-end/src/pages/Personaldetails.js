import React, { useState, useEffect } from "react";
import { fetchBankDetails, addBankDetails, updateBankDetails, deleteBankDetails } from "../api";
import { fetchPersonalDetails, updatePersonalDetails, createPersonalDetails } from "../api";
import DashboardLayout from '../components/Dashboardlayout';
import "../styles/PersonalDetails.css";

const BankDetailsPage = () => {
  const [currentPage, setCurrentPage] = useState("bank"); // Track which page to show
  const [bankDetails, setBankDetails] = useState([]);
  const [personalDetails, setPersonalDetails] = useState(null);
  const [formData, setFormData] = useState({
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
    branch: "",
  });
  const [personalFormData, setPersonalFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    companyName: "",
    country: "",
  });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const loadBankDetails = async () => {
      setIsLoading(true);
      try {
        const data = await fetchBankDetails();
        setBankDetails(data);
      } catch (error) {
        console.error("Failed to fetch bank details:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const loadPersonalDetails = async () => {
      setIsLoading(true);
      try {
        const pdata = await fetchPersonalDetails();
        if (!pdata || !pdata._id) {
          throw new Error("Invalid personal details returned from API");
        }
        setPersonalDetails(pdata);
        setPersonalFormData({
          firstName: pdata.firstName,
          lastName: pdata.lastName,
          email: pdata.email,
          phoneNumber: pdata.phoneNumber,
          gender: pdata.gender,
          companyName: pdata.companyName,
          country: pdata.country,
        });
      } catch (error) {
        if (error.message === 'No personal details found for this user.') {
          // Show Add Personal Details form if none exist
          console.log('No personal details exist. Prompting user to add details.');
          setPersonalFormData({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            gender: '',
            companyNameName: '',
            country: '',
          });
        } else {
          console.error('Error loading personal details:', error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadBankDetails();
    loadPersonalDetails();
  }, []);

  // Handle form data changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePersonalChange = (e) => {
    setPersonalFormData({ ...personalFormData, [e.target.name]: e.target.value });
  };

  // Handle bank details form submission
  const handleBankSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const updatedDetails = await updateBankDetails(editId, formData);
        setBankDetails(bankDetails.map((detail) =>
          detail._id === editId ? updatedDetails : detail
        ));
        setEditId(null); // Exit edit mode
      } else {
        const newDetails = await addBankDetails(formData);
        setBankDetails([...bankDetails, newDetails]);
      }
      setFormData({
        accountHolder: "",
        accountNumber: "",
        ifsc: "",
        bankName: "",
        branch: "",
      });
    } catch (error) {
      console.error("Error saving bank details:", error.message);
    }
  };
  

  // Handle personal details form submission
  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if personalDetails exists before accessing _id
      const personalId = personalDetails?._id;
      
      if (!personalId) {
        // If no existing personal details, you might want to create new details instead of updating
        const newDetails = await createPersonalDetails(personalFormData);
        setPersonalDetails(newDetails);
        return;
      }
  
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("firstName", personalFormData.firstName);
      formDataToSubmit.append("lastName", personalFormData.lastName);
      formDataToSubmit.append("email", personalFormData.email);
      formDataToSubmit.append("phoneNumber", personalFormData.phoneNumber);
      formDataToSubmit.append("gender", personalFormData.gender);
      formDataToSubmit.append("companyName", personalFormData.companyName);
      formDataToSubmit.append("country", personalFormData.country);
      let result;
    if (personalDetails?._id) {
      // Update existing details
      result = await updatePersonalDetails(personalDetails._id, personalFormData);
    } else {
      // Create new details
      result = await createPersonalDetails(personalFormData);
    }
    setPersonalDetails(result);
    } catch (error) {
      console.error("Error saving personal details:", error.message);
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteBankDetails(id);
      setBankDetails(bankDetails.filter((detail) => detail._id !== id));
    } catch (error) {
      console.error("Error deleting bank details:", error.message);
    }
  };

  const handleEdit = (detail) => {
    setEditId(detail._id);
    setFormData({
      accountHolder: detail.accountHolder,
      accountNumber: detail.accountNumber,
      ifsc: detail.ifsc,
      bankName: detail.bankName,
      branch: detail.branch,
    });
  };

  return (
    <DashboardLayout>
    <div className="personal-details-page">
    <div className="tabs">
      <button
        className={currentPage === "personal" ? "active" : ""}
        onClick={() => setCurrentPage("personal")}
      >
        My Details
      </button>
      <button
        className={currentPage === "bank" ? "active" : ""}
        onClick={() => setCurrentPage("bank")}
      >
        Bank Details
      </button>
    </div>
    <br/>
        {currentPage === "personal" ? (
          <form onSubmit={handlePersonalSubmit} className="personal-details-form">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={personalFormData.firstName}
            onChange={handlePersonalChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={personalFormData.lastName}
            onChange={handlePersonalChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={personalFormData.email}
            onChange={handlePersonalChange}
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={personalFormData.phoneNumber}
            onChange={handlePersonalChange}
            required
          />
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={personalFormData.gender}
            onChange={handlePersonalChange}
            required
          />
          <input
            type="text"
            name="companyName"
            placeholder="Company"
            value={personalFormData.companyName}
            onChange={handlePersonalChange}
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={personalFormData.country}
            onChange={handlePersonalChange}
          />
          <button type="submit" className="btn-submit">Update Personal Details</button>
        </form>
        ) : (
          <>
            <form onSubmit={handleBankSubmit} className="bank-details-form">
              <input
                type="text"
                name="accountHolder"
                placeholder="Account Holder Name"
                value={formData.accountHolder}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                value={formData.accountNumber}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="ifsc"
                placeholder="IFSC Code"
                value={formData.ifsc}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="bankName"
                placeholder="Bank Name"
                value={formData.bankName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="branch"
                placeholder="Branch"
                value={formData.branch}
                onChange={handleChange}
                required
              />
              <button type="submit" className="btn-submit">
                {editId ? "Update" : "Add"}
              </button>
            </form>

            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="bank-details-list">
                {bankDetails.length > 0 ? (
                  bankDetails.map((detail) => (
                    <div key={detail._id} className="bank-details-card">
                      <p>
                        <strong>Account Holder:</strong> {detail.accountHolder}
                      </p>
                      <p>
                        <strong>Account Number:</strong> {detail.accountNumber}
                      </p>
                      <p>
                        <strong>IFSC:</strong> {detail.ifsc}
                      </p>
                      <p>
                        <strong>Bank Name:</strong> {detail.bankName}
                      </p>
                      <p>
                        <strong>Branch:</strong> {detail.branch}
                      </p>
                      <div className="actions">
                        <button onClick={() => handleEdit(detail)} className="btn-edit">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(detail._id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No bank details found.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BankDetailsPage;
