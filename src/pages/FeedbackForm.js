import React, { useState } from "react";
import questions from "../data/questions";
import StarRating from "../components/StarRating";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

function FeedbackForm() {

const [ratings,setRatings] = useState({});
const [name,setName] = useState("");
const [enrollment,setEnrollment] = useState("");
const [branch,setBranch] = useState("");
const [year,setYear] = useState("");
const [semester,setSemester] = useState("");
const [suggestion,setSuggestion] = useState("");

const semesters = {
"First Year": ["Semester 1","Semester 2"],
"Second Year": ["Semester 3","Semester 4"],
"Third Year": ["Semester 5","Semester 6"]
};

const calculateMarks = () => {

const totalStars = Object.values(ratings).reduce((a,b)=>a+b,0);
const maxStars = questions.length * 5;

return ((totalStars/maxStars)*25).toFixed(2);

};

const submitFeedback = async () => {

if(!name || !enrollment || !branch || !year || !semester){
alert("Please fill all fields");
return;
}

const q = query(
collection(db,"feedbacks"),
where("enrollment","==",enrollment)
);

const snapshot = await getDocs(q);

if(!snapshot.empty){
alert("You have already submitted feedback");
return;
}

const marks = calculateMarks();

await addDoc(collection(db,"feedbacks"),{

name,
enrollment,
branch,
year,
semester,
ratings,
marks,
suggestion,
date:new Date()

});

alert("Feedback Submitted Successfully");

setName("");
setEnrollment("");
setBranch("");
setYear("");
setSemester("");
setRatings({});
setSuggestion("");

};

return(

<div className="max-w-3xl mx-auto mt-10 px-4">

<div className="bg-white shadow-lg rounded-xl p-6">

<h2 className="text-2xl font-bold text-center mb-6">
Student Feedback Form
</h2>

<input
placeholder="Name"
value={name}
onChange={(e)=>setName(e.target.value)}
className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-400"
/>

<input
placeholder="Enrollment Number"
value={enrollment}
onChange={(e)=>setEnrollment(e.target.value)}
className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-400"
/>

<input
placeholder="Branch"
value={branch}
onChange={(e)=>setBranch(e.target.value)}
className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-400"
/>

<select
value={year}
onChange={(e)=>{
setYear(e.target.value);
setSemester("");
}}
className="w-full border rounded-lg p-2 mb-4"
>

<option value="">Select Year</option>
<option value="First Year">First Year</option>
<option value="Second Year">Second Year</option>
<option value="Third Year">Third Year</option>

</select>

<select
value={semester}
onChange={(e)=>setSemester(e.target.value)}
className="w-full border rounded-lg p-2 mb-6"
>

<option value="">Select Semester</option>

{year && semesters[year].map((sem,i)=>(
<option key={i} value={sem}>{sem}</option>
))}

</select>

<h3 className="text-xl font-semibold mb-4">
Feedback Questions
</h3>

{questions.map((q,index)=>(

<div
key={index}
className="border rounded-lg p-4 mb-4 bg-gray-50"
>

<p className="font-medium mb-2">
Q{index+1}. {q}
</p>

<StarRating
rating={ratings[index] || 0}
setRating={(value)=>
setRatings({...ratings,[index]:value})
}
/>

</div>

))}

<h3 className="text-xl font-semibold mt-6 mb-3">
Suggestions / Improvements / Problems
</h3>

<textarea
placeholder="Write your suggestions or problems here..."
value={suggestion}
onChange={(e)=>setSuggestion(e.target.value)}
rows="4"
className="w-full border rounded-lg p-2 mb-6 focus:ring-2 focus:ring-blue-400"
/>

<button
onClick={submitFeedback}
className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
>

Submit Feedback

</button>

</div>

</div>

)

}

export default FeedbackForm;