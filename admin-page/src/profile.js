import React, { useState } from 'react';
import './profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="profile-container">
      <div className="breadcrumb">
        <p>
          Home / Users / <span>Profile</span>
        </p>
      </div>
      <div className="profile-content">
        <div className="profile-card">
          <img
            src="profile-11.png"
            alt="Profile"
            className="profile-image"
          />
          <h2>Tony Stark</h2>
          <p>Web Designer</p>
          <div className="social-icons">
            <i className="fab fa-twitter"></i>
            <i className="fab fa-facebook"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-linkedin"></i>
          </div>
        </div>
        <div className="profile-details">
          <div className="tabs">
            <span
              className={activeTab === 'Overview' ? 'active' : ''}
              onClick={() => setActiveTab('Overview')}
            >
              Overview
            </span>
            <span
              className={activeTab === 'Edit Profile' ? 'active' : ''}
              onClick={() => setActiveTab('Edit Profile')}
            >
              Edit Profile
            </span>
            <span
              className={activeTab === 'Settings' ? 'active' : ''}
              onClick={() => setActiveTab('Settings')}
            >
              Settings
            </span>
            <span
              className={activeTab === 'Change Password' ? 'active' : ''}
              onClick={() => setActiveTab('Change Password')}
            >
              Change Password
            </span>
          </div>

          {activeTab === 'Overview' && (
            <div className="about-section">
              <h3>About</h3>
              <p>
                Sunt est soluta temporibus accusantium neque nam maiores cumque
                temporibus. Tempora libero non est unde veniam est qui dolor.
                Ut sunt iure rerum quae quisquam autem eveniet perspiciatis
                odit. Fuga sequi sed ea saepe at unde.
              </p>
              <p>
                <strong>Full Name:</strong> Kevin Anderson
              </p>
              <p>
                <strong>Company:</strong> Lueilwitz, Wisoky and Leuschke
              </p>
              <p>
                <strong>Job:</strong> Web Designer
              </p>
              <p>
                <strong>Country:</strong> USA
              </p>
              <p>
                <strong>Address:</strong> A108 Adam Street, New York, NY 535022
              </p>
              <p>
                <strong>Phone:</strong> (436) 486-3538 x29071
              </p>
              <p>
                <strong>Email:</strong> k.anderson@example.com
              </p>
            </div>
          )}

          {activeTab === 'Edit Profile' && (
            <form className="edit-profile-form">
              <div className="form-group">
                <label>Profile Image</label>
                <div className="profile-image-container">
                  <img
                    src="image.png"
                    alt="Profile"
                    className="profile-image"
                  />
                  <button className="upload-btn">📤</button>
                  <button className="delete-btn">🗑️</button>
                </div>
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" defaultValue="Kevin Anderson" />
              </div>
              <div className="form-group">
                <label>About</label>
                <textarea defaultValue="Sunt est soluta temporibus accusantium neque nam maiores cumque temporibus. Tempora libero non est unde veniam est qui dolor. Ut sunt iure rerum quae quisquam autem eveniet perspiciatis odit. Fuga sequi sed ea saepe at unde." />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input type="text" defaultValue="Lueilwitz, Wisoky and Leuschke" />
              </div>
              <div className="form-group">
                <label>Job</label>
                <input type="text" defaultValue="Web Designer" />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input type="text" defaultValue="USA" />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" defaultValue="A108 Adam Street, New York, NY 535022" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" defaultValue="(436) 486-3538 x29071" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue="k.anderson@example.com" />
              </div>
              <div className="form-group">
                <label>Twitter Profile</label>
                <input type="text" defaultValue="https://twitter.com/#" />
              </div>
              <div className="form-group">
                <label>Facebook Profile</label>
                <input type="text" defaultValue="https://facebook.com/#" />
              </div>
              <div className="form-group">
                <label>Instagram Profile</label>
                <input type="text" defaultValue="https://instagram.com/#" />
              </div>
              <div className="form-group">
                <label>Linkedin Profile</label>
                <input type="text" defaultValue="https://linkedin.com/#" />
              </div>
              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </form>
          )}
          {activeTab === 'Settings' && (
  <form className="settings-form">
    <h3>Settings</h3>
    <div className="form-group">
      <label>Enable Notifications</label>
      <input type="checkbox" defaultChecked />
    </div>
    <div className="form-group">
      <label>Private Profile</label>
      <input type="checkbox" />
    </div>
    <div className="form-group">
      <label>Show Online Status</label>
      <input type="checkbox" defaultChecked />
    </div>
    <div className="form-group">
      <label>Language</label>
      <select defaultValue="English">
        <option value="English">English</option>
        <option value="Spanish">Spanish</option>
        <option value="French">French</option>
        <option value="German">German</option>
      </select>
    </div>
    <div className="form-group">
      <label>Timezone</label>
      <select defaultValue="UTC">
        <option value="UTC">UTC</option>
        <option value="PST">PST</option>
        <option value="EST">EST</option>
        <option value="CST">CST</option>
      </select>
    </div>
    <button type="submit" className="save-btn">
      Save Settings
    </button>
  </form>
)}

{activeTab === 'Change Password' && (
  <form className="change-password-form">
    <h3>Change Password</h3>
    <div className="form-group">
      <label>Current Password</label>
      <input type="password" placeholder="Enter Current Password" />
    </div>
    <div className="form-group">
      <label>New Password</label>
      <input type="password" placeholder="Enter New Password" />
    </div>
    <div className="form-group">
      <label>Re-enter New Password</label>
      <input type="password" placeholder="Re-enter New Password" />
    </div>
    <button type="submit" className="save-btn">
      Change Password
    </button>
  </form>
)}
        </div>
      </div>
    </div>
  );
};


export default Profile;
