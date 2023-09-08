
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMedicineContext } from "../../hooks/useMedicineContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const Medicines = () => {
  const { medicines, dispatch } = useMedicineContext();
  const { user } = useAuthContext();

  // State to store the selected state from the dropdown
  const [selectedState, setSelectedState] = useState("");

  // State to store the search query
  const [searchQuery, setSearchQuery] = useState("");

  // State to toggle search mode
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    const fetchMedicinesForAll = async () => {
      const response = await fetch("https://vitalincbackend.vercel.app/api/medicines/public", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_ALL_MEDICINES", payload: json });
      } else {
        console.error("Failed to fetch shop data:", response.status, response.statusText);
      }
    };
    if (user) {
      fetchMedicinesForAll();
    }
  }, [dispatch, user]);

  useEffect(() => {
    const fetchShopDetailsForMedicines = async () => {
      if (medicines && medicines.length > 0) {
        const medicinesWithShopDetails = await Promise.all(
          medicines.map(async (medicine) => {
            const shopResponse = await fetch(
              `https://vitalincbackend.vercel.app/api/shops/${medicine.shop_id}`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );
            const shopJson = await shopResponse.json();

            return {
              ...medicine,
              shop_address: shopJson.address,
            };
          })
        );

        dispatch({ type: "SET_ALL_MEDICINES", payload: medicinesWithShopDetails });
      }
    };
    fetchShopDetailsForMedicines();
  }, [dispatch, medicines, user]);

  // Function to handle search button click
  const handleSearchClick = () => {
    setSearchMode(true);
  };

  // Function to handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchMode(false);
  };

  // Function to handle state selection from the dropdown

  // Filter medicines based on the selected state and search query
  const filteredMedicines = medicines && searchMode === true && medicines.length > 0
    ? medicines.filter((medicine) => {
        const includesSearchQuery = medicine.medicinename.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSelectedState = medicine.shop_address.toLowerCase().includes(selectedState.toLowerCase());
        return includesSearchQuery && matchesSelectedState;
      })
    : [];

  return (
    <div>
      {user &&
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search medicines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearchClick}>Search</button>
        {searchMode && (
          <button onClick={handleClearSearch}>Clear Search</button>
        )}
      </div>
       }
      {/* State selection dropdown */}
     {user &&
      <div>
        <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
          <option value="">All States</option>
          <option value="andhrapradesh">Andhra Pradesh</option>
          <option value="arunachalpradesh">Arunachal Pradesh</option>
          <option value="assam">Assam</option>
          <option value="bihar">Bihar</option>
          <option value="chhattisgarh">Chhattisgarh</option>
          <option value="goa">Goa</option>
          <option value="gujarat">Gujarat</option>
          <option value="haryana">Haryana</option>
          <option value="himachalpradesh">Himachal Pradesh</option>
          <option value="jammu&kashmir">Jammu & Kashmir</option>
          <option value="jharkhand">Jharkhand</option>
          <option value="karnataka">Karnataka</option>
          <option value="kerala">Kerala</option>
          <option value="madhyapradesh">Madhya Pradesh</option>
          <option value="maharashtra">Maharashtra</option>
          <option value="manipur">Manipur</option>
          <option value="meghalaya">Meghalaya</option>
          <option value="mizoram">Mizoram</option>
          <option value="nagaland">Nagaland</option>
          <option value="odisha">Odisha</option>
          <option value="punjab">Punjab</option>
          <option value="rajasthan">Rajasthan</option>
          <option value="sikkim">Sikkim</option>
          <option value="tamilnadu">Tamil Nadu	</option>
          <option value="telangana">Telangana</option>
          <option value="tripura">Tripura</option>
        </select>
      </div>
     }

      {/* Medicines list */}
      <div className="card-container">
        {searchMode ? (
          // Display filtered medicines
          filteredMedicines.length > 0 ? (
            filteredMedicines.map((medicine) => (
              <Link
                to={`/medicines/${medicine._id}`}
                className="Public_Medicine_Card"
                key={medicine._id}
              >
                <div className="card-img"></div>
                <div className="card-info">
                  <h4 className="text-title">{medicine.medicinename}</h4>
                  <p className="text-body">{medicine.medicinedetails}</p>
                </div>
                <div className="card-footer">
                  <span className="text-title">₹{medicine.price}</span>
                </div>
              </Link>
            ))
          ) : (
            // No matching medicines found
            <p>No matching medicines found.</p>
          )
        ) : (
          // Display all medicines
          medicines && medicines.length > 0 ? (
            medicines.map((medicine) => (
              <Link
                to={`/medicines/${medicine._id}`}
                className="Public_Medicine_Card"
                key={medicine._id}
              >
                <div className="card-img"></div>
                <div className="card-info">
                  <h4 className="text-title">{medicine.medicinename}</h4>
                  <p className="text-body">{medicine.medicinedetails}</p>
                </div>
                <div className="card-footer">
                  <span className="text-title">₹{medicine.price}</span>
                </div>
              </Link>
            ))
          ) : (
            // No medicines available
           user && <p>No medicines available.</p>
          )
        )}
      </div>

      {!user && (
        <div>
          User must be logged in to see the content <br />
          <Link to="/login">Login here</Link>
        </div>
      )}
    </div>
  );
};

export default Medicines;
