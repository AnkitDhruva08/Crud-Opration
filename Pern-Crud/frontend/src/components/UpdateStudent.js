import React, { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 

export default function UpdateStudent() {
  // State to store student details
  const [studentName, setStudentName] = useState(""); 
  const [studentEmail, setStudentEmail] = useState(""); 
  const [studentAge, setStudentAge] = useState(""); 
  const [subjectId, setSubjectId] = useState(""); 
  const [subjects, setSubjects] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams(); 

  // Handlers for input fields
  const handleNameChange = (e) => {
    setStudentName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setStudentEmail(e.target.value);
  };

  const handleAgeChange = (e) => {
    setStudentAge(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubjectId(e.target.value);
  };

  // Fetch student data and subjects based on ID when the component loads
  useEffect(() => {
    const getStudentAndSubjects = async () => {
      try {
        // Fetch student data based on ID
        const studentRes = await fetch(`http://localhost:8080/api/v1/updateview/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const studentData = await studentRes.json();
        console.log("studentData ===<<<>>>", studentData.data.data);

        if (studentRes.status === 200 && studentData.data) {
          setStudentName(studentData.data.data.student_name || "");
          setStudentEmail(studentData.data.data.email || "");
          setStudentAge(studentData.data.data.age || "");
          setSubjectId(studentData.data.data.subject_id || "");
        } else {
          setError("Failed to fetch student data. Please try again.");
        }

        // Fetch subjects for the dropdown
        const subjectsRes = await fetch("http://localhost:8080/api/v1/subjects", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const subjectsData = await subjectsRes.json();

        if (subjectsRes.status === 200) {
          setSubjects(subjectsData.data);
        } else {
          setError("Failed to fetch subjects.");
        }
      } catch (err) {
        console.log(err);
        setError("An error occurred while fetching data.");
      }
    };

    getStudentAndSubjects();
  }, [id]);

  // Function to update student details
  const updateStudent = async (e) => {
    e.preventDefault();

    if (!studentName || !studentEmail || !studentAge || !subjectId) {
      setError("*Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8080/api/v1/updateStudents/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: studentName,
          email: studentEmail,
          age: studentAge,
          subject_id: subjectId, 
        }),
      });

      const responseData = await response.json();

      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Student details updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/"); 
        });
      } else {
        setError(responseData.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-5">
      <h1>Update Student Information</h1>
      <form onSubmit={updateStudent} className="mt-5 col-lg-6 col-md-6 col-12">
        {/* Name Field */}
        <div className="mb-3">
          <label htmlFor="student_name" className="form-label fs-4 fw-bold">
            Student Name
          </label>
          <input
            type="text"
            value={studentName || ""} // Ensuring value is never undefined
            onChange={handleNameChange}
            className="form-control fs-5"
            id="student_name"
            placeholder="Enter Student Name"
            required
          />
        </div>

        {/* Email Field */}
        <div className="mb-3">
          <label htmlFor="student_email" className="form-label fs-4 fw-bold">
            Student Email
          </label>
          <input
            type="email"
            value={studentEmail || ""} 
            onChange={handleEmailChange}
            className="form-control fs-5"
            id="student_email"
            placeholder="Enter Student Email"
            required
          />
        </div>

        {/* Age Field */}
        <div className="mb-3">
          <label htmlFor="student_age" className="form-label fs-4 fw-bold">
            Student Age
          </label>
          <input
            type="number"
            value={studentAge || ""} 
            onChange={handleAgeChange}
            className="form-control fs-5"
            id="student_age"
            placeholder="Enter Student Age"
            required
          />
        </div>

        {/* Subject Dropdown */}
        <div className="mb-3">
          <label htmlFor="subject_id" className="form-label fs-4 fw-bold">
            Select Subject
          </label>
          <select
            id="subject_id"
            className="form-control fs-5"
            value={subjectId || ""} // Ensuring value is never undefined
            onChange={handleSubjectChange}
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

        {/* Buttons */}
        <div className="d-flex justify-content-center mt-4">
          <NavLink to="/students" className="btn btn-secondary me-3 fs-4">
            Cancel
          </NavLink>
          <button
            type="submit"
            className="btn btn-primary fs-4"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-danger mt-3 fs-5 fw-bold text-center">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
