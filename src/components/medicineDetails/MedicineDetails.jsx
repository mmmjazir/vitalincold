import { useState, useEffect } from 'react'
import { useMedicineContext } from '../../hooks/useMedicineContext'
import { useAuthContext } from '../../hooks/useAuthContext'

const MedicineDetails = ({medicine,setLoading,loading}) => {
    const {user, userRole} = useAuthContext()
    const {dispatch} = useMedicineContext()
  
    const [shopName, setShopName] = useState("");
    
    const [editedMedicinename, setEditedMedicinename] = useState(medicine.medicinename);
    const [editedMedicineDetails, setEditedMedicineDetails] = useState(medicine.medicinedetails);
    const[available, setAvailable] = useState(medicine.available);
    const [editedPrice, setEditedPrice] = useState(medicine.price)
    const [isEditing, setIsEditing] = useState(false);
   

    const handleChange = (e) => {
      setAvailable(e.target.value);
    };

    const handleEdit = () => {
      setIsEditing(true);
    };
  
    const handleSaveEdit = async () => {
      if (!user) {
        return;
      }
      if (userRole !== 'seller') {
        return;
      }
  
      const updatedMedicineData = {
        medicinename: editedMedicinename,
        medicinedetails: editedMedicineDetails,
        available : available
      };
  
      const response = await fetch(`https://vitalincbackend.vercel.app/api/medicines/${medicine._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(updatedMedicineData)
      });
    
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'UPDATE_MEDICINE', payload: json });
        setIsEditing(false);
      }
    };
  
    const handleCancelEdit = () => {
      setIsEditing(false);
      setEditedMedicinename(medicine.medicinename);
      setEditedMedicineDetails(medicine.medicinedetails);
      setAvailable(medicine.available)
      // Reset other edited fields here
    };
  




    useEffect(() => {
        async function fetchShopDetails() {
        try {
            
            const response = await fetch(
              `https://vitalincbackend.vercel.app/api/shops/${medicine.shop_id}`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );
            const json = await response.json();
            setLoading(true)

            if (response.ok) {
              setShopName(json.shopname);
              setLoading(false)
            }
          } catch (error) {
            console.error("Error fetching shop details:", error);
          }
        }
    
        if (medicine.shop_id) {
          fetchShopDetails();
        }
      }, [user.token,medicine.shop_id,setLoading]);


    const handleDelete = async ()=>{
       
        if(!user){
            return
        }
        if(userRole !=='seller'){
            return
        }

        const response = await fetch('https://vitalincbackend.vercel.app/api/medicines/' +medicine._id, {
            method: 'DELETE',
            headers:{
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

      if(response.ok){
          dispatch({type:'DELETE_MEDICINE', payload:json})
      }

    }
    return ( 
         
        <div className="medicine-details">

{loading == false && (
            <> 
             {isEditing ? (
          <>
          <label>Medicine Name:</label>
            <input
              type="text"
              value={editedMedicinename}
              onChange={(e) => setEditedMedicinename(e.target.value)}
            />
             <label>Additional details:</label>
            <input
              type="text"
              value={editedMedicineDetails}
              onChange={(e) => setEditedMedicineDetails(e.target.value)}
            />
             <label>Medicine Availability:</label>
              <select value={available} onChange={handleChange}  >
                <option value={true}>Available</option>
                <option value={false}>UnAvailable</option>
             </select>
             <label>Medicine Price in(₹):</label>
            <input
              type="Number"
              value={editedPrice}
              onChange={(e) => setEditedPrice(e.target.value)}
            />
          </>
        ) : (
          <>
             <h3><strong>Medicine name :</strong> {medicine.medicinename}</h3>
            <p><strong>Additional details :</strong> {medicine.medicinedetails}</p>
            <h5 className={available ? 'success': 'error'}>{available ? 'Available' : 'Unavailable' }</h5>
            <p><strong>Price :</strong> {medicine.price}₹</p>
            <h4><strong>Shop name : </strong> {shopName}</h4>
           
          </>
        )}
        {isEditing ? (
          <>
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <button className="material-symbols-outlined" onClick={handleEdit}>
              edit
            </button>
            <button className="material-symbols-outlined" onClick={handleDelete}>
              delete
            </button>
          </>
        )}
           </> )}

    {loading == true && <div>loading...</div> }
    
        </div>
      
     );
}
 
export default MedicineDetails;