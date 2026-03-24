import React, { useState, useRef } from "react";
import questions from "../data/questions";
import StarRating from "../components/StarRating";
import teachersData from "../data/teachers";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

function FeedbackForm() {

const [branch,setBranch] = useState("");
const [year,setYear] = useState("");
const [semester,setSemester] = useState("");

const [currentTeacherIndex,setCurrentTeacherIndex] = useState(0);
const [ratings,setRatings] = useState({});
const [allTeacherRatings,setAllTeacherRatings] = useState({});
const [suggestion,setSuggestion] = useState("");

const navigate = useNavigate();
const formTopRef = useRef(null);

// DEVICE ID
const getDeviceId = () => {
let id = localStorage.getItem("deviceId");
if(!id){
id = Date.now().toString();
localStorage.setItem("deviceId", id);
}
return id;
};

const semesters = {
"Second Year": ["Semester 4"],
"Third Year": ["Semester 6"]
};

const teachers =
branch && year && semester
? teachersData[branch]?.[year]?.[semester] || []
: [];

const currentTeacher = teachers[currentTeacherIndex];

// progress %
const progress = teachers.length
? ((currentTeacherIndex + 1) / teachers.length) * 100
: 0;

// next teacher
const handleNextTeacher = () => {

if(Object.keys(ratings).length !== questions.length){
alert("Please rate all questions");
return;
}

setAllTeacherRatings({
...allTeacherRatings,
[currentTeacher]: ratings
});

setRatings({});
setCurrentTeacherIndex(currentTeacherIndex + 1);

setTimeout(()=>{
formTopRef.current?.scrollIntoView({ behavior: "smooth" });
},100);

};

// submit
const submitFeedback = async () => {

if(Object.keys(ratings).length !== questions.length){
alert("Please rate all questions");
return;
}

const deviceId = getDeviceId();

const q = query(
collection(db,"feedbacks"),
where("deviceId","==",deviceId)
);

const snapshot = await getDocs(q);

if(!snapshot.empty){
alert("You have already submitted feedback from this device");
return;
}

const finalData = {
...allTeacherRatings,
[currentTeacher]: ratings
};

await addDoc(collection(db,"feedbacks"),{
branch,
year,
semester,
teachers: finalData,
suggestion,
deviceId,
date:new Date()
});

// reset
setBranch("");
setYear("");
setSemester("");
setRatings({});
setAllTeacherRatings({});
setCurrentTeacherIndex(0);
setSuggestion("");

navigate("/success");

setTimeout(()=>{
formTopRef.current?.scrollIntoView({ behavior: "smooth" });
},100);

};

return(

<div className="max-w-3xl mx-auto mt-10 px-4">

<div ref={formTopRef} className="bg-white shadow-lg rounded-xl p-6">

<h2 className="text-2xl font-bold text-center mb-6">
Teacher Feedback System
</h2>

{/* Branch */}
<select
value={branch}
onChange={(e)=>{
setBranch(e.target.value);
setYear("");
setSemester("");
setCurrentTeacherIndex(0);
}}
className="w-full border rounded-lg p-2 mb-4"
>
<option value="">Select Branch</option>
<option value="Computer Engineering">Computer Engineering</option>
<option value="Information Technology">Information Technology</option>
</select>

{/* Year */}
<select
value={year}
onChange={(e)=>{
setYear(e.target.value);
setSemester("");
setCurrentTeacherIndex(0);
}}
className="w-full border rounded-lg p-2 mb-4"
>
<option value="">Select Year</option>
<option value="Second Year">Second Year</option>
<option value="Third Year">Third Year</option>
</select>

{/* Semester */}
<select
value={semester}
onChange={(e)=>{
setSemester(e.target.value);
setCurrentTeacherIndex(0);
}}
className="w-full border rounded-lg p-2 mb-6"
>
<option value="">Select Semester</option>

{year && semesters[year].map((sem,i)=>(
<option key={i} value={sem}>{sem}</option>
))}

</select>

{/* ⭐ PROGRESS INDICATOR */}
{currentTeacher && (
<div className="mb-6">

<p className="text-sm font-semibold mb-1">
Teacher {currentTeacherIndex + 1} of {teachers.length}
</p>

<div className="w-full bg-gray-200 rounded-full h-3">
<div
className="bg-blue-600 h-3 rounded-full transition-all"
style={{ width: `${progress}%` }}
></div>
</div>

</div>
)}

{/* Teacher Feedback */}
{currentTeacher && (

<div>

<h3 className="text-xl font-semibold mb-4 text-blue-700">
Feedback for {currentTeacher}
</h3>

{questions.map((q,index)=>(

<div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">

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

<h3 className="text-lg font-semibold mt-6 mb-2">
Any Improvements / Suggestions
</h3>

<textarea
placeholder="Write your suggestions here..."
value={suggestion}
onChange={(e)=>setSuggestion(e.target.value)}
className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-400"
/>

{currentTeacherIndex < teachers.length - 1 ? (

<button
onClick={handleNextTeacher}
className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
>
Next Teacher
</button>

) : (

<button
onClick={submitFeedback}
className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
>
Submit Feedback
</button>

)}

</div>

)}

</div>

</div>

)

}

export default FeedbackForm;
