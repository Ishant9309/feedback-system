import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import questions from "../data/questions";
import { useNavigate } from "react-router-dom";

import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
);

function AdminDashboard(){

const [feedbacks,setFeedbacks] = useState([]);
const [selected,setSelected] = useState(null);
const [search,setSearch] = useState("");

const navigate = useNavigate();

useEffect(()=>{

onAuthStateChanged(auth,(user)=>{

if(!user){
navigate("/admin-login");
}

});

fetchFeedbacks();

},[navigate]);

const fetchFeedbacks = async () => {

const snapshot = await getDocs(collection(db,"feedbacks"));

let list=[];

snapshot.forEach((doc)=>{
list.push(doc.data());
});

setFeedbacks(list);

};


// logout
const logout = async ()=>{

await signOut(auth);
navigate("/admin-login");

};


// CSV download
const downloadCSV = () => {

let csv = "Name,Enrollment,Branch,Year,Semester,Marks\n";

feedbacks.forEach((fb)=>{

csv += `${fb.name},${fb.enrollment},${fb.branch},${fb.year},${fb.semester},${fb.marks}\n`;

});

const blob = new Blob([csv],{type:"text/csv"});

const url = window.URL.createObjectURL(blob);

const a = document.createElement("a");

a.href = url;
a.download = "feedback_report.csv";

a.click();

};


// search filter
const filteredFeedback = feedbacks.filter((fb)=>
fb.name.toLowerCase().includes(search.toLowerCase()) ||
fb.enrollment.includes(search)
);


// calculate average ratings
const calculateAverageRatings = () => {

let totals = new Array(questions.length).fill(0);

feedbacks.forEach((fb)=>{

Object.entries(fb.ratings).forEach(([q,r])=>{

totals[q]+=r;

});

});

return totals.map(total =>
feedbacks.length ? (total/feedbacks.length).toFixed(2) : 0
);

};

const avgRatings = calculateAverageRatings();


// chart data
const data = {
labels: questions,
datasets: [
{
label: "Average Rating",
data: avgRatings,
backgroundColor: "rgba(59,130,246,0.7)"
}
]
};

return(

<div className="max-w-7xl mx-auto mt-8 px-4">

{/* Top Section */}

<div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">

<h2 className="text-2xl font-bold text-gray-800">
Admin Dashboard
</h2>

<div className="flex gap-3">

<button
onClick={downloadCSV}
className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
>
Download CSV
</button>

<button
onClick={logout}
className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
>
Logout
</button>

</div>

</div>


{/* Stats Card */}

<div className="bg-white shadow rounded-lg p-4 mb-6 text-center">

<h3 className="text-gray-500">
Total Feedback
</h3>

<p className="text-3xl font-bold text-blue-600">
{feedbacks.length}
</p>

</div>


{/* Search */}

<div className="mb-6">

<input
placeholder="Search by Name or Enrollment"
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="w-full md:w-96 border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
/>

</div>


{/* Table */}

<div className="bg-white shadow rounded-lg overflow-x-auto mb-6">

<table className="w-full">

<thead className="bg-blue-900 text-white">

<tr>
<th className="p-3">Name</th>
<th className="p-3">Enrollment</th>
<th className="p-3">Branch</th>
<th className="p-3">Year</th>
<th className="p-3">Semester</th>
<th className="p-3">Marks</th>
<th className="p-3">Action</th>
</tr>

</thead>

<tbody>

{filteredFeedback.map((fb,index)=>(

<tr key={index} className="text-center border-b hover:bg-gray-100">

<td className="p-3">{fb.name}</td>
<td className="p-3">{fb.enrollment}</td>
<td className="p-3">{fb.branch}</td>
<td className="p-3">{fb.year}</td>
<td className="p-3">{fb.semester}</td>
<td className="p-3 font-semibold text-blue-600">
{fb.marks}/25
</td>

<td className="p-3">

<button
onClick={()=>setSelected(fb)}
className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
>

View

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>


{/* Feedback Details */}

{selected &&(

<div className="bg-white shadow rounded-lg p-5 mb-6">

<h3 className="text-xl font-semibold mb-4">
Feedback Details
</h3>

{questions.map((q,i)=>(

<p key={i} className="mb-2">

<b>{q}</b> : ⭐ {selected.ratings[i]}

</p>

))}

<h4 className="mt-4 font-semibold">
Suggestions / Problems
</h4>

<p className="text-gray-700 mt-1">
{selected.suggestion ? selected.suggestion : "No suggestion given"}
</p>

</div>

)}


{/* Chart Section */}

<div className="bg-white shadow rounded-lg p-5">

<h3 className="text-xl font-semibold mb-4">
Feedback Analytics
</h3>

<div className="w-full max-w-5xl mx-auto">

<Bar data={data}/>

</div>

</div>

</div>

)

}

export default AdminDashboard;