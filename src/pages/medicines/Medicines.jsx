import { useEffect } from "react";

import { Link } from "react-router-dom";


import { useMedicineContext } from "../../hooks/useMedicineContext";
import { useAuthContext } from "../../hooks/useAuthContext";


const Medicines = () => {
    const {medicines,dispatch} = useMedicineContext()
   const {user} = useAuthContext();
 


    useEffect(() => {
    

        const fetchMedicinesForAll = async ()=>{
          const response = await fetch('https://vitalincbackend.vercel.app/api/medicines/public', {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          })
          
          const json = await response.json()
          if(response.ok){
             
              dispatch({type:'SET_ALL_MEDICINES',payload:json})
            
          }else {
            console.error('Failed to fetch shop data:', response.status, response.statusText);
          }
           
        }
        if(user){
          fetchMedicinesForAll()
        }
      }, [dispatch,user])

    return ( 
        <div className="card-container">
            {medicines && medicines.length >0 &&
             medicines.map((medicine)=> (
                <Link to={`/medicines/${medicine._id}`} className="Public_Medicine_Card"  key={medicine._id}>
                   <div className="card-img"></div>
                    {/* <h4>{medicine.available ? 'available' : 'unavailable' }</h4> */}
                    <div className="card-info">
               <h4 className="text-title"> {medicine.medicinename}</h4>
             <p className="text-body">{medicine.medicinedetails}</p>
            </div>
              <div className="card-footer">
            <span className="text-title">₹{medicine.price}</span>
            </div>
                </Link>
             ) )
            
            }
            {!user && <div>
              User must be loginned to see the content <br />
              <Link to='/login'>Login here</Link>
            </div> }
        </div>
     );
}
 
export default Medicines;