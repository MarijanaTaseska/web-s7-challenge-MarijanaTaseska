import React, { useEffect, useState } from 'react'
import * as yup from "yup"
import axios from 'axios'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}
// 👇 Here you will create your schema.
const formSchema = yup.object().shape({
  fullName:yup
  .string()
  .trim()
  .min(3,validationErrors.fullNameTooShort)
  .max(20,validationErrors.fullNameTooLong)
  .required(),
  size:yup
  .string()
  .oneOf(["S","M","L"],validationErrors.sizeIncorrect)
  .required(),
  pepperoni:yup.boolean(),
  'Green Peppers':yup.boolean(),
  Pineapple:yup.boolean(),
  Mushrooms:yup.boolean(),
  Ham:yup.boolean(),

})

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]
const initialValue = ()=> ({
  fullName:'',
  size:'',
  toppings:[],
})
const initialErrors =()=>({
  fullName:'',
  size:'',
  toppings:[]
})

export default function Form() {
const [enabled,setEnabled] = useState(false)
const [values,setValues] = useState(initialValue())
const [success,setSuccess] = useState('')
const [errors,setErrors] = useState(initialErrors())
const [failure,setFailure] = useState('')

useEffect(()=>{
formSchema.isValid(values).then(isValid=>{
  setEnabled(isValid)
})
},[values])

const handleSubmit = evt =>{
  evt.preventDefault()
 axios.post("http://localhost:9009/api/order", values)
  .then(res =>{
    setSuccess(res.data.message)
    setFailure('')
  })
  .catch(res =>{
    setSuccess('')
    setFailure(res.response.data.message)
  })
  setValues(initialValue()) 
}

const onChange = evt =>{
  let {type, checked, name, value, } = evt.target
  setValues((prevValues) => {
    if (type === 'checkbox') {
      const updatedToppings = checked
        ? [...prevValues.toppings, name] 
        : prevValues.toppings.filter((topping) => topping !== name);
       return {
          ...prevValues,
          [name]: checked,
          toppings: updatedToppings,
        }
      }
      else{
        return {
          ...prevValues,
          [name]: value,
      }
    }
  })
  yup
  .reach(formSchema,name)
  .validate(value)
  .then(()=> { setErrors({...errors,[name]:''}) })
  .catch((error)=>{ setErrors({...errors,[name]:error.errors[0]}) })
}

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {success && <div className='success'>{success}</div>}
      {failure && <div className='failure'>{failure}</div>}  

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input 
           onChange={onChange}
           value={values.fullName}
           name='fullName'
           placeholder="Type full name" 
           id="fullName" 
           type="text" />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" onChange={onChange} name='size' value={values.size}>
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            {/* Fill out the missing options */}
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        { toppings.map((top,idx)=>{
          return <label key={idx}>
           <input
             name={top.topping_id}
             type="checkbox"
             onChange={onChange}
             checked={values.toppings.includes(top.topping_id)}
           />
           {top.text}<br />
         </label>
        })
      } 
     </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input disabled={!enabled} type="submit"/>
    </form>
  )
}
