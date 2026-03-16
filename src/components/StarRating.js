import React from "react";

function StarRating({ rating, setRating }) {

return (

<div className="flex gap-2">

{[1,2,3,4,5].map((star)=>(
  
<button
key={star}
onClick={()=>setRating(star)}
className={`text-2xl md:text-3xl transition ${
star <= rating ? "text-yellow-400" : "text-gray-300"
} hover:text-yellow-500`}
>

★

</button>

))}

</div>

)

}

export default StarRating;