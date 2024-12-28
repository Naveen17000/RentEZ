import React, { useEffect, useState } from 'react';
import '../styles/saveaddress.css';
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from '../api';

const AddressForm = ({ currentAddress, handleChange, handleSave, editing }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="form-title">{editing ? 'Edit Address' : 'Add Address'}</h2>
            <input type="text" name="name" placeholder="Name" value={currentAddress.name} onChange={handleChange} className="input" required />
            <input type="text" name="line1" placeholder="Address Line 1" value={currentAddress.line1} onChange={handleChange} className="input" required />
            <input type="text" name="city" placeholder="City" value={currentAddress.city} onChange={handleChange} className="input" required />
            <input type="text" name="state" placeholder="State" value={currentAddress.state} onChange={handleChange} className="input" required />
            <input type="text" name="zip" placeholder="Zip Code" value={currentAddress.zip} onChange={handleChange} className="input" required />
            <input type="text" name="country" placeholder="Country" value={currentAddress.country} onChange={handleChange} className="input" required />
            <button type="submit" className="button save-button">{editing ? 'Update Address' : 'Save Address'}</button>
        </form>
    );
};

const AddressList = ({ addresses, handleEdit, handleDelete, selectedAddress, setSelectedAddress }) => {
    return (
        <div className="address-list">
            {addresses.map((addr, index) => (
                <div key={addr._id || index} className={`address-block ${selectedAddress === index ? 'selected' : ''}`} onClick={() => setSelectedAddress(index)}>
                    <input type="radio" name="selectedAddress" checked={selectedAddress === index} onChange={() => setSelectedAddress(index)} className="radio-button" />
                    <div className="address-info">
                        <h3 className="address-title">{addr.name}</h3>
                        <p className="address-text">{addr.line1},<br />{addr.city}, {addr.state} {addr.zip},<br />{addr.country}</p>
                    </div>
                    <button className="button edit-button" onClick={(e) => { e.stopPropagation(); handleEdit(index); }}>Edit</button>
                    <button className="button delete-button" onClick={(e) => { e.stopPropagation(); handleDelete(index); }}>Delete</button>
                </div>
            ))}
        </div>
    );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete this address?</p>
                <button className="button" onClick={onConfirm}>Yes, Delete</button>
                <button className="button" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

const SavedAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [currentAddress, setCurrentAddress] = useState({ name: '', line1: '', city: '', state: '', zip: '', country: '' });
    const [editingIndex, setEditingIndex] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadAddresses = async () => {
            setLoading(true);
            try {
                const data = await fetchAddresses();
                setAddresses(data);
            } catch (error) {
                console.error("Failed to load addresses:", error);
                setError("Failed to load addresses.");
            } finally {
                setLoading(false);
            }
        };
        loadAddresses();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentAddress({ ...currentAddress, [name]: value });
    };

    const handleSaveAddress = async () => {
        setLoading(true);
        setError(null);
        
        try {
            if (editingIndex !== null) {
                const updatedAddress = await updateAddress(addresses[editingIndex]._id, currentAddress);
                const updatedAddresses = addresses.map((addr, index) => 
                    index === editingIndex ? { ...updatedAddress, _id: addresses[editingIndex]._id } : addr
                );
                setAddresses(updatedAddresses);
                setEditingIndex(null);
            } else {
                const newAddress = await addAddress(currentAddress);
                setAddresses([...addresses, newAddress]);
            }
            
            // Reset form
            setCurrentAddress({ name: '', line1: '', city: '', state: '', zip: '', country: '' });
        } catch (error) {
            setError(editingIndex !== null ? "Error updating address." : "Error adding address.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditAddress = (index) => {
        setCurrentAddress({ ...addresses[index] });
        setEditingIndex(index);
    };

    const requestDeleteAddress = (index) => {
        setDeleteIndex(index);
        setModalOpen(true);
    };

    const confirmDeleteAddress = async () => {
        setLoading(true);
        try {
            await deleteAddress(addresses[deleteIndex]._id);
            const updatedAddresses = addresses.filter((_, i) => i !== deleteIndex);
            setAddresses(updatedAddresses);
            if (selectedAddress === deleteIndex) {
                setSelectedAddress(null);
            }
        } catch (error) {
            setError("Error deleting address.");
        } finally {
            setLoading(false);
            setModalOpen(false);
            setDeleteIndex(null);
        }
    };

    const cancelDeleteAddress = () => {
        setModalOpen(false);
        setDeleteIndex(null);
    };

    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);

    return (
        <div className="container">
            <div className="header">
                <h2 className="welcomeText">Welcome, Amanda</h2>
                <p className="dateText">{formattedDate}</p>
                <h3 className="saved-title">Saved Addresses</h3>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {loading && <p>Loading...</p>}
                <div className="address-section">
                    {addresses.length === 0 ? (
                        <p>No saved addresses.</p>
                    ) : (
                        <AddressList
                            addresses={addresses}
                            handleEdit={handleEditAddress}
                            handleDelete={requestDeleteAddress}
                            selectedAddress={selectedAddress}
                            setSelectedAddress={setSelectedAddress}
                        />
                    )}
                </div>
            </div>

            <div className="form-container-add">
                <AddressForm
                    currentAddress={currentAddress}
                    handleChange={handleChange}
                    handleSave={handleSaveAddress}
                    editing={editingIndex !== null}
                />
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={cancelDeleteAddress}
                onConfirm={confirmDeleteAddress}
            />
        </div>
    );
};

export default SavedAddresses;