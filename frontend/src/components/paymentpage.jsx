import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaUser } from "react-icons/fa";
const PaymentPage = () => {
  const [showPopup, setShowPopup] = React.useState(false);

  const [userAddress, setUserAddress] = React.useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const ITEM_PRICES = {
    waterTins: 30,
    coolingWaterTins: 35,
    waterBottles: 20,
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
  const full = [address, area, mandal, district]
    .filter(Boolean)
    .join(", ");
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
          "http://localhost:5000/api/orders/create",
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
      <div className="mb-6">
  <label
    htmlFor="district"
    className="block text-lg font-semibold text-blue-600 mb-2"
  >
    District:
  </label>
  <select
    id="district"
    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    value={district}
    onChange={(e) => setDistrict(e.target.value)}
  >
    <option value="">Select District</option>
    <option>Anakapalli</option>
    <option>Ananthapuramu</option>
    <option>Bapatla</option>
    <option>Chittoor</option>
    <option>Dr. B. R. Ambedkar Konaseema</option>
    <option>East Godavari</option>
    <option>Eluru</option>
    <option>Guntur</option>
    <option>Kakinada</option>
    <option>Krishna</option>
    <option>Kurnool</option>
    <option>Nandyal</option>
    <option>Sri Potti Sriramulu Nellore</option>
    <option>NTR</option>
    <option>Palnadu</option>
    <option>Parvathipuram Manyam</option>
    <option>Prakasam</option>
    <option>Srikakulam</option>
    <option>Tirupati</option>
    <option>Visakhapatnam</option>
    <option>Vizianagaram</option>
    <option>West Godavari</option>
    <option>YSR Kadapa</option>
    <option>Alluri Sitharama Raju</option>
    <option>Annamayya</option>
    <option>Sri Sathya Sai</option>
  </select>
</div>

<div className="mb-6">
  <label
    htmlFor="mandal"
    className="block text-lg font-semibold text-blue-600 mb-2"
  >
    Mandal:
  </label>
  <input
    type="text"
    id="mandal"
    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    placeholder="Enter Mandal..."
    value={mandal}
    onChange={(e) => setMandal(e.target.value)}
  />
</div>

<div className="mb-6">
  <label
    htmlFor="area"
    className="block text-lg font-semibold text-blue-600 mb-2"
  >
    Area:
  </label>
  <input
    type="text"
    id="area"
    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    placeholder="Enter Area..."
    value={area}
    onChange={(e) => setArea(e.target.value)}
  />
</div>

<div className="mb-6">
  <label
    htmlFor="address"
    className="block text-lg font-semibold text-blue-600 mb-2"
  >
    Full Address:
  </label>
  <textarea
    id="address"
    rows={3}
    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    placeholder="House number, street name, etc..."
    value={address}
    onChange={(e) => setAddress(e.target.value)}
  />
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

          <div
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
          </div>
        </div>
      </div>
      <button
        onClick={handleConfirm}
        disabled={!userAddress.trim()}
        className={`w-full mt-4 py-2 rounded-lg transition-all duration-200 ${
          userAddress.trim()
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
