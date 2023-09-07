import { useState } from 'react'

import { useShopContext } from '../../hooks/useShopContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useMedicineContext } from '../../hooks/useMedicineContext'

const ShopDetails = ({shop, setShowForm, setSelectedShopId}) => {
    const {user, userRole} = useAuthContext()
    const {dispatch} = useShopContext()
    const { medicines, dispatch: medicineDispatch } = useMedicineContext()

    const [editedShopname, setEditedShopname] = useState(shop.shopname);
    const [editedAddress, setEditedAddress] = useState(shop.address);
    const [isEditing, setIsEditing] = useState(false);
  

    const handleAddMedicine = () => {
        setSelectedShopId(shop._id); 
        setShowForm("medicine"); 
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
    
        const updatedShopData = {
          shopname: editedShopname,
          address: editedAddress,
        };
    
        const response = await fetch(`https://vitalincbackend.vercel.app/api/shops/${shop._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(updatedShopData)
        });
    
        const json = await response.json();
    
        if (response.ok) {
          dispatch({ type: 'UPDATE_SHOP', payload: json });
          setIsEditing(false);
        }
      };
    
      const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedShopname(shop.shopname);
        setEditedAddress(shop.address);
        // Reset other edited fields here
      };
    


    const handleDelete = async ()=>{
       
        if(!user){
            return
        }
        if(userRole !=='seller'){
            return
        }


        const response = await fetch('https://vitalincbackend.vercel.app/api/shops/' +shop._id, {
            method: 'DELETE',
            headers:{
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

      if(response.ok){
          dispatch({type:'DELETE_SHOP', payload:json})
          
      }

     
         const deleteMedicine = async (medicineId) => {
            const response = await fetch('https://vitalincbackend.vercel.app/api/medicines/' + medicineId, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
           
            const json = await response.json();
            
            if (response.ok) {
                
                medicineDispatch({ type: 'DELETE_MEDICINE', payload: json });
            }

        }
         // Delete medicines associated with the shop
         if(medicines && medicines.length > 0){
         const medicinesToDelete = medicines.filter(medicine => medicine.shop_id === shop._id);
         for (const medicineToDelete of medicinesToDelete) {
             await deleteMedicine(medicineToDelete._id);
         }
        }
    }
    return ( 

        <div className="shop-details">
        {isEditing ? (
          <>
          <label>Shop Name:</label>
            <input
              type="text"
              value={editedShopname}
              onChange={(e) => setEditedShopname(e.target.value)}
            />
             <label>Shop Address:</label>
            <input
              type="text"
              value={editedAddress}
              onChange={(e) => setEditedAddress(e.target.value)}
            />
          </>
        ) : (
          <>
            <h4>{shop.shopname}</h4>
            <p><strong>Address:</strong> {shop.address}</p>
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
            <button onClick={handleAddMedicine}>Add Medicine</button>
          </>
        )}
        {!shop && <p>There are no shops added in your account.</p>}
      </div>
        
        
     );
     
}
 
export default ShopDetails;