import React from "react";
import "./ContactUs.css";
const ContactUs = () => {
  return (
    <div className="contact-wrapper">
      <h2 className="contact-heading">Contact Us</h2>
      <p className="contact-paragraph">
        Got a technical issue? Want to send feedback about a feature? Need
        details about our Business plan? Let us know.
      </p>
      <form className="contact-form">
        <div className="contact-form-group">
          <label className="contact-label">Email</label>
          <input
            type="email"
            className="contact-input"
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="contact-form-group">
          <label className="contact-label">Phone</label>
          <input
            type="tel"
            className="contact-input"
            placeholder="Phone number"
          />
        </div>

        <div className="contact-form-group">
          <label className="contact-label">Subject</label>
          <input
            type="text"
            className="contact-input"
            placeholder="What's this about?"
            required
          />
        </div>

        <div className="contact-form-group">
          <label className="contact-label">Message</label>
          <textarea
            className="contact-input contact-message"
            placeholder="Write your message here..."
            rows="4"
            required
          ></textarea>
        </div>

        <button type="submit" className="contact-submit">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
