import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function InsertStudent() {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [subjectId, setSubjectId] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subjects, setSubjects] = useState([]); 
  const navigate = useNavigate();

  // Fetch the list of subjects when the component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/subjects");
        const data = await response.json();

        if (response.status === 200) {
          setSubjects(data.data);
        } else {
          console.log("Failed to fetch subjects.");
        }
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };

    fetchSubjects();
  }, []);

  // Input field handlers
  const handleInputChange = (setter) => (e) => setter(e.target.value);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any input is missing
    if (!studentName || !studentEmail || !studentAge || !subjectId) {
      setError("Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/v1/insertstudent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName,
          email: studentEmail,
          age: studentAge,
          subject_id: subjectId, 
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        // Redirect to home page if status is 200
        Swal.fire("Success!", "Student data inserted successfully!", "success");
        setStudentName("");
        setStudentEmail("");
        setStudentAge("");
        setSubjectId(""); 
        navigate("/"); 
      } else if (res.status === 422) {
       
        setError("Student with this email already exists.");
      } else if (res.status === 500) {
        
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        // Handle other errors
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h2 className="mb-0">Enter Student Information</h2>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="form-group mb-4">
              <label htmlFor="student_name" className="form-label fw-bold fs-5">
                Student Name
              </label>
              <input
                type="text"
                id="student_name"
                className="form-control form-control-lg"
                placeholder="Enter Student Name"
                value={studentName}
                onChange={handleInputChange(setStudentName)}
                required
              />
            </div>

            {/* Email Field */}
            <div className="form-group mb-4">
              <label
                htmlFor="student_email"
                className="form-label fw-bold fs-5"
              >
                Student Email
              </label>
              <input
                type="email"
                id="student_email"
                className="form-control form-control-lg"
                placeholder="Enter Student Email"
                value={studentEmail}
                onChange={handleInputChange(setStudentEmail)}
                required
              />
            </div>

            {/* Age Field */}
            <div className="form-group mb-4">
              <label htmlFor="student_age" className="form-label fw-bold fs-5">
                Student Age
              </label>
              <input
                type="number"
                id="student_age"
                className="form-control form-control-lg"
                placeholder="Enter Student Age"
                value={studentAge}
                onChange={handleInputChange(setStudentAge)}
                required
              />
            </div>

            {/* Subject Dropdown */}
            <div className="form-group mb-4">
              <label htmlFor="subject_id" className="form-label fw-bold fs-5">
                Select Subject
              </label>
              <select
                id="subject_id"
                className="form-control form-control-lg"
                value={subjectId}
                onChange={handleInputChange(setSubjectId)}
                required
              >
                <option value="">Select Subject</option>
                {subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <option key={subject.subject_id} value={subject.subject_id}>
                      {subject.subject_name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading subjects...</option>
                )}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger text-center fs-5">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="d-flex justify-content-center gap-3">
              <NavLink
                to="/"
                className="btn btn-secondary btn-lg px-5 fw-bold"
              >
                Cancel
              </NavLink>
              <button
                type="submit"
                className="btn btn-primary btn-lg px-5 fw-bold"
                disabled={loading}
              >
                {loading ? "Inserting..." : "Insert"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

