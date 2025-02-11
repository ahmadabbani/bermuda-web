import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AddToBalance.css"; // Import CSS for styling
import { useAuth } from "../../AuthContext";

const AddToBalance = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [value, setValue] = useState("");
  const [amountToSend, setAmountToSend] = useState("");
  const [subtractFee, setSubtractFee] = useState(false); // Flag for subtracting 1%

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;
  const username = user?.username;
  // Open modal and set the selected payment method
  const handleBoxClick = (payment) => {
    setSelectedPayment(payment);
    setSubtractFee(payment !== "Binance"); // Enable subtraction for non-binance methods
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setAmountToSend("");
    setSelectedPayment(null);
    setValue("");
    setImage(null);
  };

  // Handle value input change
  const handleValueChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    // Calculate subtracted value if subtractFee is true
    if (inputValue) {
      const calculatedValue = subtractFee
        ? (inputValue * 0.99).toFixed(2) // Subtract 1%
        : inputValue; // No subtraction
      setAmountToSend(calculatedValue);
    } else {
      setAmountToSend(""); // Clear if input is empty
    }
  };

  // Handle file input change
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type (optional)
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG/JPEG/PNG files are allowed");
      e.target.value = "";
      setImage(null);
      return;
    }

    // Validate file size (3MB example)
    const MAX_SIZE = 3 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("Image must be smaller than 3MB");
      e.target.value = "";
      setImage(null);
      return;
    }

    setImage(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (loading) return;

    // Validate required fields
    if (!userId || !username) {
      toast.warning("User ID is missing.");
      return;
    }
    if (!value) {
      // || image
      toast.warning("Set an amount, please.");
      return;
    }

    setLoading(true);

    // Prepare form data
    const formData = new FormData();
    formData.append("product_name", selectedPayment);
    formData.append("amount", amountToSend);
    formData.append("type", "IN");
    formData.append("user_id", userId);
    formData.append("username", username);
    formData.append("status", "waiting");
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.paymentStatus) {
        toast.success("Payment submitted successfully!");
        setTimeout(() => {
          handleCloseModal();
        }, 1000);
      } else {
        toast.error(response.data.error || "Failed to submit payment.");
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      if (error.response) {
        toast.error(error.response.data.error || "An error occurred.");
      } else if (error.request) {
        toast.error("Unable to reach the server. Please try again later.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-credit">
      <h1 className="add-credit__title">Add Credit</h1>
      <div className="add-credit__options">
        <div
          className="add-credit__option"
          onClick={() => handleBoxClick("Whish-Money")}
        >
          <img
            src="/images/whish logo.svg"
            alt="Whish Money"
            className="add-credit__option-icon"
          />
        </div>
        <div
          className="add-credit__option"
          onClick={() => handleBoxClick("Binance")}
        >
          <img
            src="/images/binance logo.jpg"
            alt="Binance"
            className="add-credit__option-icon"
          />
        </div>
      </div>

      {modalOpen && (
        <div className="add-credit__overlay">
          <div className="add-credit__modal">
            {selectedPayment === "Binance" && (
              <div className="add-credit__content">
                <h2 className="add-credit__modal-title">Binance Payment</h2>

                <div className="add-credit__form-group">
                  <label className="add-credit__label">Trc20:</label>
                  <input
                    type="text"
                    className="add-credit__input add-credit__input--readonly"
                    placeholder="TMTunWKFo3iHom3XAqrTDmKtjRm59o3RW9"
                    readOnly
                  />
                </div>

                <div className="add-credit__form-group">
                  <label className="add-credit__label">BEP20:</label>
                  <input
                    type="text"
                    className="add-credit__input add-credit__input--readonly"
                    placeholder="0xce024e0990baea823730e3ad6acce701a7ff5a46"
                    readOnly
                  />
                </div>

                <div className="add-credit__form-group">
                  <label className="add-credit__label">Binance ID:</label>
                  <input
                    type="text"
                    className="add-credit__input add-credit__input--readonly"
                    placeholder="58591793"
                    readOnly
                  />
                </div>

                <p className="add-credit__notice">
                  ليتم قبول الرصيد يرجى إرفاق صورة لعملية التحويل تتضمن المبلغ
                  والتوقيت
                </p>

                <div className="add-credit__form-group">
                  <label className="add-credit__label">Enter Amount:</label>
                  <input
                    type="text"
                    className="add-credit__input"
                    placeholder="The value"
                    value={value}
                    onChange={handleValueChange}
                  />
                </div>

                <div className="add-credit__form-group">
                  <input
                    type="text"
                    className="add-credit__input add-credit__input--readonly"
                    placeholder="Amount to be sent"
                    value={amountToSend}
                    readOnly
                  />
                </div>

                <div className="add-credit__form-group">
                  <input
                    type="file"
                    className="add-credit__file"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </div>
              </div>
            )}

            {selectedPayment === "Whish-Money" && (
              <div className="add-credit__content">
                <h2 className="add-credit__modal-title">Whish Money</h2>

                <div className="add-credit__form-group">
                  <label className="add-credit__label">Phone Number:</label>
                  <input
                    type="text"
                    className="add-credit__input add-credit__input--readonly"
                    placeholder="75844542"
                    readOnly
                  />
                </div>

                <p className="add-credit__notice">
                  يرجى الانتباه قبل التحويل:
                  <br />
                  ليتم قبول الرصيد
                  <br />
                  يرجى إرفاق صورة لعملية التحويل
                  <br />
                  تتضمن المبلغ والتوقيت
                  <br />
                  شاكرين تعاونكم ...
                </p>

                <div className="add-credit__form-group">
                  <label className="add-credit__label">Enter Amount:</label>
                  <input
                    type="text"
                    className="add-credit__input"
                    placeholder="The value"
                    value={value}
                    onChange={handleValueChange}
                  />
                </div>

                <div className="add-credit__form-group">
                  <input
                    type="text"
                    className="add-credit__input add-credit__input--readonly"
                    placeholder="Amount to be sent"
                    value={amountToSend}
                    readOnly
                  />
                </div>

                <div className="add-credit__form-group">
                  <input
                    type="file"
                    className="add-credit__file"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </div>
              </div>
            )}

            <div className="add-credit__actions">
              <button
                className="add-credit__btn add-credit__btn--cancel"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="add-credit__btn add-credit__btn--submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToBalance;
