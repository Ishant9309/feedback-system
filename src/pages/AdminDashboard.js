import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import questions from "../data/questions";
import { useNavigate } from "react-router-dom";

function AdminDashboard(){

const [feedbacks,setFeedbacks] = useState([]);
const [selected,setSelected] = useState(null);

const [branchFilter,setBranchFilter] = useState("");
const [yearFilter,setYearFilter] = useState("");

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

let csv = "Branch,Year,Semester,Teacher,Question,Rating\n";

feedbacks.forEach((fb)=>{

Object.entries(fb.teachers || {}).forEach(([teacher,ratings])=>{

Object.entries(ratings).forEach(([qIndex,rate])=>{

csv += `${fb.branch},${fb.year},${fb.semester},${teacher},Q${parseInt(qIndex)+1},${rate}\n`;

});

});

});

const blob = new Blob([csv],{type:"text/csv"});
const url = window.URL.createObjectURL(blob);

const a = document.createElement("a");
a.href = url;
a.download = "teacher_feedback_report.csv";
a.click();

};


// ⭐ Average
const getAverage = (ratings) => {
const values = Object.values(ratings);
const total = values.reduce((a,b)=>a+b,0);
return values.length ? (total / values.length).toFixed(2) : 0;
};


// ⭐ Marks
const calculateMarks = (ratings) => {
const total = Object.values(ratings).reduce((a,b)=>a+b,0);
const max = questions.length * 5;
return ((total / max) * 25).toFixed(2);
};


// 🔥 FILTERED DATA
const filteredFeedbacks = feedbacks.filter(fb =>
(!branchFilter || fb.branch === branchFilter) &&
(!yearFilter || fb.year === yearFilter)
);


// 🔥 LEADERBOARD LOGIC
const calculateLeaderboard = () => {

let teacherMap = {};

filteredFeedbacks.forEach(fb => {
Object.entries(fb.teachers || {}).forEach(([teacher,ratings]) => {

const avg = parseFloat(getAverage(ratings));

if(!teacherMap[teacher]){
teacherMap[teacher] = { total: 0, count: 0 };
}

teacherMap[teacher].total += avg;
teacherMap[teacher].count += 1;

});
});

const result = Object.entries(teacherMap).map(([teacher,data]) => ({
teacher,
avg: (data.total / data.count).toFixed(2)
}));

return result.sort((a,b)=>b.avg - a.avg).slice(0,3);

};

const leaderboard = calculateLeaderboard();

return(

<div className="max-w-7xl mx-auto mt-8 px-4">

{/* Header */}
<div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">

<h2 className="text-2xl font-bold text-gray-800">
Admin Dashboard
</h2>

<div className="flex gap-3">

<button
onClick={downloadCSV}
className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500"
>
Download CSV
</button>

<button
onClick={logout}
className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
>
Logout
</button>

</div>

</div>


{/* Filters */}
<div className="flex gap-3 mb-6">

<select
value={branchFilter}
onChange={(e)=>setBranchFilter(e.target.value)}
className="border p-2 rounded"
>
<option value="">All Branch</option>
<option value="Computer Engineering">Computer Engineering</option>
<option value="Information Technology">Information Technology</option>
</select>

<select
value={yearFilter}
onChange={(e)=>setYearFilter(e.target.value)}
className="border p-2 rounded"
>
<option value="">All Year</option>
<option value="Second Year">Second Year</option>
<option value="Third Year">Third Year</option>
</select>

</div>


{/* Leaderboard */}
<div className="bg-white shadow rounded-lg p-4 mb-6">

<h3 className="text-lg font-semibold mb-3">
🏆 Top 3 Teachers
</h3>

{leaderboard.length === 0 ? (
<p>No data available</p>
) : (
leaderboard.map((t,i)=>(
<p key={i} className="font-semibold">

{i===0 && "🥇 "}
{i===1 && "🥈 "}
{i===2 && "🥉 "}

{t.teacher} → ⭐ {t.avg}

</p>
))
)}

</div>


{/* Total Feedback */}
<div className="bg-white shadow rounded-lg p-4 mb-6 text-center">

<h3>Total Feedback</h3>
<p className="text-3xl font-bold text-blue-600">
{filteredFeedbacks.length}
</p>

</div>


{/* Table */}
<div className="bg-white shadow rounded-lg overflow-x-auto mb-6">

<table className="w-full">

<thead className="bg-blue-900 text-white">
<tr>
<th>Branch</th>
<th>Year</th>
<th>Semester</th>
<th>Teachers</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{filteredFeedbacks.map((fb,index)=>(

<tr key={index} className="text-center border-b">

<td>{fb.branch}</td>
<td>{fb.year}</td>
<td>{fb.semester}</td>
<td>{Object.keys(fb.teachers || {}).length}</td>

<td>
<button
onClick={()=>setSelected(fb)}
className="bg-blue-600 text-white px-2 py-1 rounded"
>
View
</button>
</td>

</tr>

))}

</tbody>

</table>

</div>


{/* Details */}
{selected &&(

<div className="bg-white shadow rounded-lg p-5 mb-6">

<div className="flex justify-between mb-4">
<h3>Teacher-wise Feedback</h3>
<button onClick={()=>setSelected(null)}>Close ✖</button>
</div>

{Object.entries(selected.teachers || {}).map(([teacher,ratings],i)=>(

<div key={i} className="mb-4">

<h4>{teacher}</h4>

<p>⭐ {getAverage(ratings)}</p>
<p>Marks: {calculateMarks(ratings)} / 25</p>

</div>

))}

{selected.suggestion && (
<div className="mt-3 bg-gray-100 p-3 rounded">
{selected.suggestion}
</div>
)}

</div>

)}

</div>

)

}

export default AdminDashboard;