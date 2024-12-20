import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../CMNav/navbar";
import { ManagerContext } from "./ManagerContext";
import "../dashboard/dashboard.css";
import Ihome from "../dashboard/home.png";
import Idriver from "../dashboard/driver.png";
import Irequest from "../dashboard/request.png";
import Isetting from "../dashboard/setting.png";
import Ivehicle from "../dashboard/vehicle.png";
import IPayment from "../dashboard/payment.png";
import axios from "axios";
import PumpFuelChart from "./PumpFuelChart";
import SessionChartp from "./SessionChartpetrol";
import SessionChartd from "./SessionChartdiesel";
import Modal from "../dashboard/payment";

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const { userDetails } = location.state || {};
  const { setManagerDetails, managerDetails } = useContext(ManagerContext);
  const [activeComponent, setActiveComponent] = useState("Home");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [fuelRequests, setFuelRequests] = useState([]);
  const [vehicleCount, setVehicleCount] = useState(0); // For vehicle count
  const [driverCount, setDriverCount] = useState(0); // For driver count
  const [pumpData, setPumpData] = useState([]);
  const [fuelPrices, setFuelPrices] = useState([]); // State to store fuel prices
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ totalPayment: 0, company: '' });


  useEffect(() => {
    if (vehicles.length > 0) {
      setVehicleCount(vehicles.length); // Set vehicle count from vehicles state
    }
  }, [vehicles]);

  useEffect(() => {
    if (drivers.length > 0) {
      setDriverCount(drivers.length); // Set driver count from drivers state
    }
  }, [drivers]);

  useEffect(() => {
    if (userDetails) {
      console.log("Setting manager details:", userDetails);
      setManagerDetails(userDetails);
    }
  }, [userDetails, setManagerDetails]);

  // Function to create the query parameters for the manager details
  const getQueryParams = () => {
    if (managerDetails) {
      const params = new URLSearchParams();
      params.append("company", managerDetails.company);
      // Add more fields if needed
      return params.toString();
    }
    return "";
  };

  const handleAddVehicle = () => {
    const queryParams = getQueryParams();
    navigate(`/vehicle?${queryParams}`);
  };

  const handleAddDriver = () => {
    const queryParams = getQueryParams();
    navigate(`/drivers?${queryParams}`);
  };

  // Define the breadcrumb component
  const Breadcrumb = () => (
    <div className="breadcrumb">
      <span>Dashboard</span> &gt; <span>{activeComponent}</span>
    </div>
  );

  useEffect(() => {
    if (managerDetails?.company) {
      const fetchVehicles = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/vehicles?company=${managerDetails.company}`
          );
          const companyVehicles =
            response.data[managerDetails.company]?.vehicles || [];
          setVehicles(companyVehicles);
        } catch (error) {
          console.error("Error fetching vehicles:", error);
        }
      };

      fetchVehicles();
    }
  }, [managerDetails]);

  
  // Component to render the vehicle list table
  const VehicleList = () => (
    <div className="vehicle-list">
      <table>
        <thead>
          <tr>
            <th>Registration Number</th>
            <th>Vehicle Type</th>
            <th>Fuel Type</th>
            <th>Fuel Volume (L)</th>
            <th>Pumped Volume (L)</th>
            <th>Requested Volume (L)</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle, index) => (
            <tr key={index} onClick={() => setSelectedVehicle(vehicle)}>
              <td>{vehicle.registrationNumber}</td>
              <td>{vehicle.vehicleType}</td>
              <td>{vehicle.fuelType}</td>
              <td>{vehicle.fuelVolume}</td>
              <td>{vehicle.pumpedVolume}</td>
              <td>{vehicle.requestedVolume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Component to render selected vehicle details
  const VehicleDetails = () => (
    <div className="vehicle-details">
      {selectedVehicle ? (
        <div>
          <h3>
            <strong>{selectedVehicle.registrationNumber}</strong>
          </h3>
          <p>
            <strong>Vehicle Type:</strong> {selectedVehicle.vehicleType}
          </p>
          <p>
            <strong>Fuel Type:</strong> {selectedVehicle.fuelType}
          </p>
          <p>
            <strong>Fuel Volume (L):</strong> {selectedVehicle.fuelVolume}
          </p>
          <p>
            <strong>Pumped Volume (L):</strong> {selectedVehicle.pumpedVolume}
          </p>
          <p>
            <strong>Requested Volume (L):</strong>{" "}
            {selectedVehicle.requestedVolume}
          </p>
          <button
            onClick={() => setSelectedVehicle(null)}
            className="vremovebutton"
          >
            Remove Vehicle
          </button>
        </div>
      ) : (
        <p>Select a vehicle to view details</p>
      )}
    </div>
  );

  useEffect(() => {
    if (managerDetails?.company) {
      const fetchDrivers = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/drivers?company=${managerDetails.company}`
          );
          // Filter the drivers based on the logged-in company
          const filteredDrivers = response.data.filter(
            (driver) => driver.company === managerDetails.company
          );
          setDrivers(filteredDrivers);
        } catch (error) {
          console.error("Error fetching drivers:", error);
        }
      };

      fetchDrivers();
    }
  }, [managerDetails]);

  // Component to render driver list table
  const DriverList = () => (
    <div className="driver-list">
      <table>
        <thead>
          <tr>
            <th>Driver</th>
            <th>Email</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.name} onClick={() => setSelectedDriver(driver)}>
              <td>{driver.name}</td>
              <td>{driver.email}</td>
              <td>{driver.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Component to render selected driver details
  const DriverDetails = () => (
    <div className="driver-details">
      {selectedDriver ? (
        <div>
          <h3>
            <strong>{selectedDriver.name}</strong>
          </h3>
          <p>
            <strong></strong> {selectedDriver.email}
          </p>
          <p>
            <strong></strong> {selectedDriver.contact}
          </p>
          <button
            onClick={() => setSelectedDriver(null)}
            className="dremovebutton"
          >
            Remove Driver
          </button>
        </div>
      ) : (
        <p>Select a driver to view details</p>
      )}
    </div>
  );

  // API endpoint to get pending fuel requests
  useEffect(() => {
    if (managerDetails?.company) {
      const fetchFuelRequests = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/fuel-requests?company=${managerDetails.company}`
          );
          setFuelRequests(response.data);
        } catch (error) {
          console.error("Error fetching fuel requests:", error);
        }
      };

      fetchFuelRequests();
    }
  }, [managerDetails]);

  // Component to render the request list table
  const RequestList = () => (
    <div className="request-list">
      <table>
        <thead>
          <tr>
            <th>Vehicle Number</th>
            <th>Request Volume (L)</th>
            <th>Email</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {fuelRequests.map((request) => (
            <tr key={request.id} onClick={() => setSelectedRequest(request)}>
              <td>{request.registrationNumber}</td>
              <td>{request.requestVolume}</td>
              <td>{request.email}</td>
              <td>{request.reason}</td>
              <td>{request.approvedStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Component to render selected request details
  const RequestDetails = () => (
    <div className="request-details">
      {selectedRequest ? (
        <div>
          <h3>
            <strong>Fuel Request Details</strong>
          </h3>
          <p>
            <strong>Request Volume (L):</strong> {selectedRequest.requestVolume}
          </p>
          <p>
            <strong>Vehicle Number:</strong>{" "}
            {selectedRequest.registrationNumber}
          </p>
          <p>
            <strong>Email:</strong> {selectedRequest.email}
          </p>
          <p>
            <strong>Reason:</strong> {selectedRequest.reason}
          </p>
          <p>
            <strong>Requested At:</strong>{" "}
            {new Date(selectedRequest.requestedAt).toLocaleString()}
          </p>
          <div className="request-buttons">
            <button
              className="approvebtn"
              onClick={() => handleApproveRequest(selectedRequest)}
            >
              Approve
            </button>
            <button
              className="rejectbtn"
              onClick={() => handleCancelRequest(selectedRequest)}
            >
              Reject
            </button>
          </div>
        </div>
      ) : (
        <p>Select a request to Approve or Reject</p>
      )}
    </div>
  );

  const PaymentDetails = () => {
    const [pumpData, setPumpData] = useState([]);
    const [fuelPrices, setFuelPrices] = useState([]);
    const [calculatedPayments, setCalculatedPayments] = useState([]);
  
    useEffect(() => {
      const fetchPumpData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/pump-collection?company=${managerDetails.company}`
          );
          setPumpData(response.data);
        } catch (error) {
          console.error("Error fetching pump collection data:", error);
        }
      };
  
      const fetchFuelPrices = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/fuel-prices");
          setFuelPrices(response.data);
        } catch (error) {
          console.error("Error fetching fuel prices:", error);
        }
      };
  
      if (managerDetails?.company) {
        fetchPumpData();
        fetchFuelPrices();
      }
    }, [managerDetails]);
  
    useEffect(() => {
      const calculatePayments = () => {
        const payments = pumpData.map((pump) => {
          const matchingPrice = fuelPrices.find(
            (price) =>
              price.fuelType === pump.fuelType && price.shedType === pump.shedType
          );
  
          if (matchingPrice) {
            const payment = matchingPrice.price * pump.fuelPumped;
            return { ...pump, payment };
          } else {
            return { ...pump, payment: "Price not found" };
          }
        });
        setCalculatedPayments(payments);
      };
  
      if (pumpData.length > 0 && fuelPrices.length > 0) {
        calculatePayments();
      }
    }, [pumpData, fuelPrices]);
  
    // Calculate the total payment
    const totalPayment = calculatedPayments.reduce((total, pump) => {
      return total + (typeof pump.payment === "number" ? pump.payment : 0);
    }, 0);

    const handlePayNow = () => {
      // Pass the total payment and company name to the modal
      setModalData({
        totalPayment,
        company: managerDetails?.company || 'Unknown Company'
      });
      setShowModal(true);  // Show the modal when "Pay Now" is clicked
    };
  
    const handleCloseModal = () => {
      setShowModal(false);  // Close the modal
    };
  
    const handleConfirmPayment = () => {
      alert('Payment Confirmed');
      setShowModal(false);  // Close the modal after confirming
    };
  
    return (
      <div className="pump-collection">
        <button className="paybut" onClick={handlePayNow}>Pay Now</button>
        <h2>Total Payment: LKR {totalPayment}.00</h2> {/* Display total payment */}

        <table>
          <thead>
            <tr>
              <th>Vehicle Number</th>
              <th>Driver</th>
              <th>Shed Type</th>
              <th>Fuel Type</th>
              <th>Pumped Volume</th>
              <th>Unit Price (LKR)</th>
              <th>Payment (LKR)</th>
            </tr>
          </thead>
          <tbody>
            {calculatedPayments.map((pump, index) => {
              const matchingPrice = fuelPrices.find(
                (price) =>
                  price.fuelType === pump.fuelType && price.shedType === pump.shedType
              );
  
              return (
                <tr key={index}>
                  <td>{pump.vehicleCode}</td>
                  <td>{pump.assistantFirstName} {pump.assistantLastName}</td>
                  <td>{pump.shedType}</td>
                  <td>{pump.fuelType}</td>
                  <td>{pump.fuelPumped}</td>
                  <td>{matchingPrice ? matchingPrice.price : "N/A"}.00</td>
                  <td>{pump.payment}.00</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Modal 
         show={showModal} 
         onClose={handleCloseModal} 
         onConfirm={handleConfirmPayment}
         totalPayment={modalData.totalPayment}
         company={modalData.company} 
      /> 
      </div>
    );
  };
  

  useEffect(() => {
    if (activeComponent === "Settings") {
      const fetchFuelPrices = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/fuel-prices"); // Fetch all fuel prices
          setFuelPrices(response.data); // Update state with fetched data
        } catch (error) {
          console.error("Error fetching fuel prices:", error);
        }
      };
  
      fetchFuelPrices();
    }
  }, [activeComponent]); // Fetch data when activeComponent is "Settings"

  const handleApproveRequest = async (request) => {
    if (!request) {
      alert("Please select a request to approve.");
      return;
    }

    try {
      // Add the requested volume to the vehicle's existing value
      const dynamicRequestedVolume = parseFloat(request.requestVolume);

      const volumeResponse = await axios.post(
        "http://localhost:5000/api/update-vehicle-requested-volume",
        {
          registrationNumber: request.registrationNumber,
          requestedVolume: dynamicRequestedVolume,
          company: managerDetails.company,
        }
      );

      if (volumeResponse.status === 200) {
        console.log("Requested volume updated successfully!");
      } else {
        console.warn("Requested volume update failed.");
      }

      // Approve the request in the database
      const approveResponse = await axios.post(
        "http://localhost:5000/api/fuel-requests/update-status",
        {
          id: request.id,
          status: "approved",
          company: managerDetails.company,
        }
      );

      if (approveResponse.status === 200) {
        alert("Request approved successfully!");
        setFuelRequests(approveResponse.data); // Update the list of requests
      } else {
        alert("Failed to approve request.");
      }

      // Optionally, refetch data to update the UI
      fetchFuelRequests();
    } catch (error) {
      console.error("Error during approve request process:", error);
      alert("Failed to process the approval.");
    }
  };

  const handleCancelRequest = async (request) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/fuel-requests/update-status",
        {
          id: request.id,
          status: "rejected",
          company: managerDetails.company,
        }
      );
      alert("Request rejected successfully!");
      setFuelRequests(response.data); // Update requests list
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request.");
    }
  };

  const fetchFuelRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/fuel-requests?company=${managerDetails.company}`
      );
      setFuelRequests(response.data);
    } catch (error) {
      console.error("Error fetching fuel requests:", error);
    }
  };

  // Grouping Petrol Vehicles
  const groupedPetrolData = vehicles.reduce((acc, vehicle) => {
    if (vehicle.fuelType === "petrol") {
      const vehicleType = vehicle.vehicleType;
      const pumpedVolume = parseFloat(vehicle.pumpedVolume);

      if (!acc[vehicleType]) {
        acc[vehicleType] = 0;
      }

      acc[vehicleType] += pumpedVolume; // Sum the pumped volume by vehicle type
    }
    return acc;
  }, {});

  // Grouping Diesel Vehicles
  const groupedDieselData = vehicles.reduce((acc, vehicle) => {
    if (vehicle.fuelType === "diesel") {
      const vehicleType = vehicle.vehicleType;
      const pumpedVolume = parseFloat(vehicle.pumpedVolume);

      if (!acc[vehicleType]) {
        acc[vehicleType] = 0;
      }

      acc[vehicleType] += pumpedVolume; // Sum the pumped volume by vehicle type
    }
    return acc;
  }, {});

  useEffect(() => {
    const fetchPumpData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/pump-collection?company=${managerDetails.company}`
        );
        setPumpData(response.data);
      } catch (error) {
        console.error("Error fetching pump collection data:", error);
      }
    };
  
    if (managerDetails?.company) {
      fetchPumpData();
    }
  }, [managerDetails]);
  

  // Render the appropriate component based on activeComponent
  const renderComponent = () => {
    switch (activeComponent) {
      case "Home":
        return (
          <div className="contenthome">
            <SessionChartp groupedFuelData={groupedPetrolData} />
            <SessionChartd groupedFuelData={groupedDieselData} />
            <div className="info-boxes">
              <div className="info-box">
                <h3>Vehicle</h3>
                <h1>Total Registered Vehicles</h1>
                <p>{vehicleCount}</p>
              </div>
              <div className="info-box">
                <h3>Driver</h3>
                <h1>Total Registered Drivers</h1>
                <p>{driverCount}</p>
              </div>
            </div>
          </div>
        );

      case "Vehicles":
        return (
          <div className="contentvehi">
            <div className="vehilesft">
              <VehicleList />
            </div>
            <div className="vehiright">
              <button className="addvehi" onClick={handleAddVehicle}>
                Add Vehicle
              </button>
              <VehicleDetails />
            </div>
          </div>
        );
      case "Drivers":
        return (
          <div className="contentdriv">
            <div className="driverleft">
              <DriverList />
            </div>
            <div className="driverright">
              <button className="adddri" onClick={handleAddDriver}>
                Add Driver
              </button>
              <DriverDetails />
            </div>
          </div>
        );
      case "Requests":
        return (
          <div className="contentreq">
            <div className="requestleft">
              <p className="reqtopic">Fuel Reqest</p>
              <RequestList />
            </div>
            <div className="requestright">
              <RequestDetails />
            </div>
          </div>
        );
        case "Payment":
          return (
            <div className="content-container">
              <PaymentDetails/>
            </div>
          );        
      case "Settings":
        return (
          <div className="contentset">
          </div>
        );
      default:
        return <div className="content-container"></div>;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <div className="dshleft">
          <div className="sideitems">
            <p className="dhome" onClick={() => setActiveComponent("Home")}>
              <img src={Ihome} alt="Home Icon" className="icon" />
              Home
            </p>
            <p
              className="dvehicle"
              onClick={() => setActiveComponent("Vehicles")}
            >
              <img src={Ivehicle} alt="Vehicle Icon" className="icon" />
              Vehicles
            </p>
            <p
              className="ddriver"
              onClick={() => setActiveComponent("Drivers")}
            >
              <img src={Idriver} alt="Driver Icon" className="icon" />
              Drivers
            </p>
            <p
              className="drequest"
              onClick={() => setActiveComponent("Requests")}
            >
              <img src={Irequest} alt="Request Icon" className="icon" />
              Requests
            </p>
            <p
              className="dpayment"
              onClick={() => setActiveComponent("Payment")}
            >
              <img src={IPayment} alt="Payment Icon" className="icon" />
              Payment
            </p>
            <p
              className="dsetting"
              onClick={() => setActiveComponent("Settings")}
            >
              <img src={Isetting} alt="Setting Icon" className="icon" />
            </p>
          </div>
        </div>
        <div className="dshright">
          <Breadcrumb />
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 