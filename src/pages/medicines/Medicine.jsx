import { useState, useEffect } from "react";

import { useParams } from 'react-router-dom';
import { useMedicineContext } from "../../hooks/useMedicineContext"
import { useAuthContext } from "../../hooks/useAuthContext";
import { useShopContext } from "../../hooks/useShopContext";

const Medicine = () => {
    const {medicines,dispatch} = useMedicineContext()
    const{shops, dispatch:shopDispatch} = useShopContext()
   const {user} = useAuthContext()
   
   const { id } = useParams();

   const[isLoading,setIsLoading] = useState(null)
  const[isOneLoading, setOneIsLoading] = useState(null)

    useEffect(() => {
        const fetchMedicinesForAll = async ()=>{
          
          const response = await fetch(`http://localhost:4000/api/medicines/${id}`, {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          })
          setOneIsLoading(true)
          const json = await response.json()

          if(response.ok){
              dispatch({type:'SET_SINGLE_MEDICINE',payload:json})
              setOneIsLoading(false)
          }else {
    // Handle the error, e.g., display a message or take appropriate action.
    console.error('Failed to fetch shop data:', response.status, response.statusText);
  }
           
        }
        if(user){
          fetchMedicinesForAll()
        }
      }, [dispatch,user,id])

    
   useEffect(()=>{
    async function fetchShopsForAll() {
      if (medicines && medicines.shop_id) { // Check if medicines and shop_id are defined
        try {
          const response = await fetch(`http://localhost:4000/api/shops/${medicines.shop_id}`, {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          });
         setIsLoading(true)
         const json = await response.json();
          if (response.ok) {
            
            shopDispatch({ type: 'SET_SINGLE_SHOP', payload: json });
            setIsLoading(false)
          } else {
            // Handle the error when the fetch request returns a non-OK status
            console.error('Failed to fetch shop data:', response.status, response.statusText);
            // You can also set an error state or display an error message to the user
          }
        } catch (error) {
          // Handle any other errors that may occur during the fetch
          console.error('Error occurred while fetching shop data:', error);
          // You can also set an error state or display an error message to the user
        }
      }
    }
  if(user){
    fetchShopsForAll()
  }
}, [shopDispatch,user,shops,medicines])


    return ( 
        <div className="medicine_detail_page" >
            
            {medicines && shops &&
            <div>
            <h4>Medicine name: {medicines.medicinename}</h4>
            <p>Additional details: {medicines.medicinedetails}</p>
            <p>MEdicine availability: {medicines.available ? 'Available' : 'Unavailabe' }</p>
            <p>price: {medicines.price}₹</p>
            <p>Shop name: {shops.shopname} </p>
            </div>
            }

           {!medicines && <p>there is no medicines in that id.</p> }
            
        </div>
     );
} 
 
export default Medicine;