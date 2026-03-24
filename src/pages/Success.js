import React from "react";
import { useNavigate } from "react-router-dom";

function Success(){

const navigate = useNavigate();

return(

<div className="flex items-center justify-center min-h-[80vh] px-4">

<div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md w-full">

<h2 className="text-2xl font-bold text-green-600 mb-4">
✅ Feedback Submitted Successfully!
</h2>

<p className="text-gray-600 mb-6">
Thank you for your valuable feedback.
</p>

<button
onClick={()=>navigate("/")}
className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
>
Go to Home
</button>

</div>

</div>

)

}

export default Success;