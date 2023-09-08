import { useState } from "react";
import { useShopContext } from "../../hooks/useShopContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const ShopSubmitForm = ({setIsLoading}) => {
   const {dispatch} = useShopContext()
   const {user,userRole} = useAuthContext()

   const[shopname, setShopName] = useState('')
   const[address, setAddress] = useState('')
   const[error, setError] = useState(null)
   const [successMessage, setSuccessMessage] = useState(null)
   const [emptyFields, setEmptyFields] = useState([])

   const showSuccessMessage = (message) => {
      setSuccessMessage(message);
      setIsLoading(true)
      setTimeout(() => {
        setSuccessMessage('');
        setIsLoading(false)
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
  
       const shop = {shopname,address}

       const response = await fetch('https://vitalincbackend.vercel.app/api/shops',{
         method:'POST',
         headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
         },
         body: JSON.stringify(shop)
     })
     const json = await response.json()

     if(!response.ok){
        setError(json.error) 
        setEmptyFields(json.emptyFields || [] )
     }
     if(response.ok){
      setShopName('')
      setAddress('')
      setEmptyFields([])
      setError(null)
      showSuccessMessage('Shop Added successfully')
      dispatch({type:'CREATE_SHOP',payload:json})
     }

      }
     

    return ( 
        <form className="create" onSubmit={handleSubmit} >
            <h3>Add a New Shop</h3>

            <label>Shop Name:</label>
            <input 
               type="text"
               onChange={(e)=>{
                  setShopName(e.target.value)
               }}
               value={shopname}   
               className={emptyFields.includes('shopname') ? 'error' : ''}
            />
             <label>Located State:</label>
            <select className={emptyFields.includes('address') ? 'error' : ''} value={address} onChange={(e)=>{
                   setAddress(e.target.value)   
            }
            }>
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

            <button>Add Shop</button>
            {successMessage &&  <div className="success">{successMessage}</div> }
            {error && <div className="error">{error}</div> }
         </form>
     );
}
 
export default ShopSubmitForm;
