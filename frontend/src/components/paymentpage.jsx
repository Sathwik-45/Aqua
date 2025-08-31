import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useLayoutEffect, useState } from "react";
import { Pencil } from "lucide-react";

import { Plus } from "lucide-react";

const PaymentPage = () => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [formData, setFormData] = useState({
    house: "",
    area: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [showPopup, setShowPopup] = React.useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [userAddress, setUserAddress] = React.useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const ITEM_PRICES = {
    waterTins: 20,
    coolingWaterTins: 35,
    waterBottles: 10,
    waterPackers: 15,
  };
  const [selectedMethod, setSelectedMethod] = React.useState("cod"); // cod or upi
  if (!state) {
    return (
      <div className="text-center text-red-600 mt-10">
        Invalid order. Please try again.
      </div>
    );
  }

  const { order, plant, totalAmount } = state;
  const [district, setDistrict] = React.useState("");
  const [mandal, setMandal] = React.useState("");
  const [area, setArea] = React.useState("");
  const [address, setAddress] = React.useState("");
  React.useEffect(() => {
    const full = [address, area, mandal, district].filter(Boolean).join(", ");
    setUserAddress(full);
  }, [address, area, mandal, district]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleConfirm = async () => {
    if (selectedMethod === "cod") {
      const customerName = localStorage.getItem("userName") || "N/A";
      const phoneNumber = localStorage.getItem("phone") || "N/A";

      try {
        const response = await fetch(
          "http://localhost:5173/api/orders/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              shopPhone: plant.phone,
              shopName: plant.shopName,
              shopOwner: plant.ownerName,
              shopAddress: plant.address,
              customerName,
              phoneNumber,
              userAddress,
              paymentMethod: "Cash on Delivery",
              paymentStatus: "Not Paid",
              paymentId: null,
              orderItems: {
                waterTins: order.waterTins || 0,
                coolingWaterTins: order.coolingWaterTins || 0,
                waterBottles: order.waterBottles || 0,
                waterPackers: order.waterPackers || 0,
              },
              amount: totalAmount,
            }),
          }
        );

        const result = await response.json();
        if (response.ok) {
          setShowPopup(true);

          console.log("Order stored successfully:", result);
        } else {
          console.error("Failed to store order:", result.error || result);
        }
      } catch (error) {
        console.error("Error while sending order to backend:", error);
      }

      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Failed to load Razorpay. Please try again.");
      return;
    }

    const options = {
      key: "rzp_test_hiavYs1kUhirDx", // your Razorpay public/test key
      amount: totalAmount * 100,
      currency: "INR",
      name: plant.shopName,
      description: "Water Order Payment",
      handler: function (response) {
        alert("Payment successful!\nThank you for your order.");
        console.log("Payment ID:", response.razorpay_payment_id);
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
      config: {
        display: {
          blocks: {
            upi: {
              name: "UPI",
              instruments: [
                {
                  method: "upi",
                  flows: ["intent"], // External UPI apps like GPay, PhonePe
                },
              ],
            },
            card: {
              name: "Cards",
              instruments: [
                {
                  method: "card",
                },
              ],
            },
            netbanking: {
              name: "Netbanking",
              instruments: [
                {
                  method: "netbanking",
                },
              ],
            },
          },
          sequence: ["block.upi", "block.card", "block.netbanking"],
          preferences: {
            show_default_blocks: false,
          },
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useLayoutEffect(() => {
    const fetchAddress = async () => {
      const phone = localStorage.getItem("phone");

      try {
        const res = await fetch(
          `http://localhost:5173/api/get-delivery-address?phone=${phone}`
        );
        const data = await res.json();
        console.log("Dtatataatat", data);

        setDeliveryAddress(data.delivery_address || "");
      } catch (err) {
        console.error("Failed to fetch address:", err);
      }
    };

    fetchAddress();
  }, []);

  const handleSaveAddress = async () => {
    const fullAddress = `${formData.house}, ${formData.area}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
    const phone = localStorage.getItem("phone");

    try {
      const res = await fetch(
        "http://localhost:5173/api/user/update-delivery-address",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, delivery_address: fullAddress }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setDeliveryAddress(fullAddress);
        setUserAddress(fullAddress);
        setShowAddressModal(false);
      } else {
        alert(data.message || "Failed to update address");
      }
    } catch (error) {
      alert("Something went wrong. Try again.");
      console.error(error);
    }
  };

  const handleEditAddress = () => {
    // Split and extract values from deliveryAddress string
    const [house, area, city, stateAndPin] = deliveryAddress
      .split(",")
      .map((part) => part.trim());
    const [state, pincode] = stateAndPin?.split(" - ") ?? ["", ""];

    setFormData({
      house: house || "",
      area: area || "",
      city: city || "",
      state: state || "",
      pincode: pincode || "",
    });

    setShowAddressModal(true); // open the modal
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold text-blue-700 mt-3 mb-4">
        Payment Details
      </h2>
      <div className="mb-4">
        <div className="flex items-center text-gray-600 mb-1">
          <FaMapMarkerAlt className="mr-2 text-blue-500" />
          {plant.address}
        </div>
        <div className="flex items-center text-gray-600">
          <FaUser className="mr-2" />
          Owner: {plant.ownerName}
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg animate-fade-in m-5">
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Add Delivery Address
            </h2>

            <div className="space-y-4">
              <input
                required
                type="text"
                placeholder="House No. / Building Name"
                value={formData.house}
                onChange={(e) =>
                  setFormData({ ...formData, house: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded"
              />

              <input
                type="text"
                required
                placeholder="Road Name / Area / Colony"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded"
              />

              <input
                type="text"
                required
                placeholder="Pincode"
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({ ...formData, pincode: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded"
              />

              <input
                type="text"
                required
                placeholder="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded"
              />

              <select
                required
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="w-full border border-gray-300 px-4 py-2 rounded-md bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
              >
                <option value="" disabled className="text-gray-400">
                  -- Select State --
                </option>
                {[
                  "Andhra Pradesh",
                  "Arunachal Pradesh",
                  "Assam",
                  "Bihar",
                  "Chhattisgarh",
                  "Goa",
                  "Gujarat",
                  "Haryana",
                  "Himachal Pradesh",
                  "Jharkhand",
                  "Karnataka",
                  "Kerala",
                  "Madhya Pradesh",
                  "Maharashtra",
                  "Manipur",
                  "Meghalaya",
                  "Mizoram",
                  "Nagaland",
                  "Odisha",
                  "Punjab",
                  "Rajasthan",
                  "Sikkim",
                  "Tamil Nadu",
                  "Telangana",
                  "Tripura",
                  "Uttar Pradesh",
                  "Uttarakhand",
                  "West Bengal",
                  "Delhi",
                  "Jammu and Kashmir",
                  "Ladakh",
                  "Puducherry",
                  "Chandigarh",
                  "Andaman and Nicobar Islands",
                ].map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveAddress}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Address and Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm text-center animate-fade-in-down">
            <div className="text-5xl mb-4 text-blue-500 animate-bounce">💧</div>
            <h2 className="text-xl font-bold text-blue-700 mb-2">
              Order Confirmed!
            </h2>
            <p className="text-gray-600 mb-4">
              Your order has been placed successfully. Thank you!
            </p>
            <button
              onClick={() => {
                setShowPopup(false);
                navigate("/my-orders"); // optional: redirect to home page
              }}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              THANK YOU
            </button>
          </div>
        </div>
      )}
      <div className="border rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2 text-blue-600">
          Order Summary:
        </h3>
        <ul className="space-y-1">
          {Object.entries(order)
            .filter(([_, qty]) => qty > 0)
            .map(([item, qty]) => (
              <li key={item} className="text-gray-700">
                {qty} × {item.replace(/([A-Z])/g, " $1")} = ₹
                {qty * (ITEM_PRICES[item] || 0)}
              </li>
            ))}
        </ul>

        <div className="mt-4 text-right font-bold text-blue-700">
          Total: ₹{totalAmount}
        </div>
      </div>

      <div>
        {deliveryAddress === "" ? (
          <div className="flex justify-start mb-4">
            <button
              onClick={() => setShowAddressModal(true)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Delivery Address</span>
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center w-full p-4 bg-gray-50 border rounded-lg shadow-sm mb-5">
            <p className="text-gray-800 text-sm sm:text-base font-medium">
              {deliveryAddress}
            </p>

            <button
              onClick={handleEditAddress}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-amber-500 text-white rounded-md hover:bg-amber-600 transition duration-200"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-blue-600 mb-3">
          Choose Payment Method:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => setSelectedMethod("cod")}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedMethod === "cod"
                ? "border-blue-600 shadow-md bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <h4 className="font-medium text-lg text-gray-800">
              Cash on Delivery
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              Pay when your order is delivered to your address.
            </p>
          </div>

          {/* <div
            onClick={() => setSelectedMethod("upi")}
            className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedMethod === "upi"
                ? "border-blue-600 shadow-md bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <h4 className="font-medium text-lg text-gray-800">Pay with UPI</h4>
            <p className="text-sm text-gray-500 mt-1">
              Complete payment instantly using your UPI ID.
            </p>
          </div> */}
        </div>
      </div>

      <button
        onClick={handleConfirm}
        disabled={!deliveryAddress.trim()}
        className={`w-full mt-4 py-2 rounded-lg transition-all duration-200 ${
          deliveryAddress.trim()
            ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Confirm Order
      </button>
    </div>
  );
};

export default PaymentPage;
