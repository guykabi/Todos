

const setItemToLocal = (key,value)=>{
    localStorage.setItem([key],JSON.stringify(value))
 } 

 const getItemFromLocal = (value)=>{
    return JSON.parse(localStorage.getItem(value))
 } 

const clearLocal = () =>{
    localStorage.clear()
} 

const clearField = (fieldName) =>{
    localStorage.removeItem(fieldName)
}

 export  {setItemToLocal,getItemFromLocal,clearLocal,clearField} 