import { useState } from "react";
import { useMedicineContext } from "../../hooks/useMedicineContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const MedicineSubmitForm = ({shop_id}) => {
    const {dispatch} = useMedicineContext()
   const {user,userRole} = useAuthContext()

   const[medicinename, setMedicineName] = useState('')
   const[medicinedetails, setMedicineDetails] = useState('')
   const[available, setAvailable] = useState(false)
   const[price,setPrice] = useState(0)
   const[error, setError] = useState(null)
   const [successMessage, setSuccessMessage] = useState(null)
   const [emptyFields, setEmptyFields] = useState([])


   const showSuccessMessage = (message) => {
      setSuccessMessage(message);
  
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    };

   const handleSubmit = async (e)=>{
      e.preventDefault()
       if(!user ){
         setError('You must be logged in')
         return
       }
       if(userRole !== 'seller'){
         setError('You must have to be a seller to do this action')
       }
  
       const medicine = {medicinename,medicinedetails,available,price,shop_id}

       const response = await fetch('https://vitalincbackend.vercel.app/api/medicines',{
         method:'POST',
         headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
         },
         body: JSON.stringify(medicine)
     })
     const json = await response.json()

     if(!response.ok){
        setError(json.error) 
        setEmptyFields(json.emptyFields || [] )
     }
     if(response.ok){
      setMedicineName('')
      setMedicineDetails('')
      setPrice(0)
      setEmptyFields([])
      setError(null)
      showSuccessMessage('Medicine Added Successfully')
      dispatch({type:'CREATE_MEDICINE',payload:json})
     }

      }
     
      const handleChange = (e) => {
         setAvailable(e.target.value);
       };

    return ( 
        <form className="create" onSubmit={handleSubmit} >
            <h3>Add a New Medicine for Your Shop</h3>

            <label>Medicine Name:</label>
            <input 
               type="text"
               onChange={(e)=>{
                  setMedicineName(e.target.value)
               }}
               value={medicinename}   
               className={emptyFields.includes('medicinename') ? 'error' : ''}
            />
            <label> Additional Details :</label>
            <input 
                type="text" 
                value={medicinedetails} 
                onChange={(e)=>{
                   setMedicineDetails(e.target.value)    
            }} 
            className={emptyFields.includes('medicinedetails') ? 'error' : ''}
            />
           <label>Medicine Availability:</label>
              <select value={available} onChange={handleChange} className={emptyFields.includes('available') ? 'error' : ''} >
                <option value={true}>Available</option>
                <option value={false}>UnAvailable</option>
            
             </select>
             <label> Medicine Price in (₹) :</label>
            <input 
                type="Number" 
                value={price} 
                onChange={(e)=>{
                   setPrice(e.target.value)    
            }} 
            className={emptyFields.includes('price') ? 'error' : ''}
            />
            <button>Add Medicine</button>
            {successMessage && <div className="success">{successMessage}</div> }
            {error && <div className="error">{error}</div> }
         </form>
     );
}
 
export default MedicineSubmitForm;