import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate
import Swal from "sweetalert2"; // For alerts and confirmations

export default function HomePage() {
  const [studentData, setStudentData] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/students", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.status === 200) {
        setStudentData(data.data); // Populate the student data
      } else {
        console.log("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteStudent = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/v1/delete/student/${id}`,
            {
              method: "get",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log('data response ===<<<>>>', response)
          if (response.status === 200) {
            Swal.fire("Deleted!", "The student has been deleted.", "success");
            // Remove the deleted record from the studentData state
            setStudentData((prevData) =>
              prevData.filter((student) => student.student_id !== id)
            );
          } else {
            Swal.fire("Error!", "Failed to delete student.", "error");
          }
        } catch (err) {
          Swal.fire("Error!", "Something went wrong.", "error");
          console.log(err);
        }
      }
    });
  };

  return (
    <div className="container p-5">
      <h1 className="text-center mb-4" style={{ color: "#4a4e69" }}>
        Student Records
      </h1>
      <div className="d-flex justify-content-end mb-3">
        <NavLink to="/addstudent" className="btn btn-success shadow fs-5">
          <i className="fa fa-user-plus me-2"></i>Add New Student
        </NavLink>
      </div>
      <div className="card shadow-lg">
        <div
          className="card-header text-white"
          style={{
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
          }}
        >
          <h4 className="mb-0">All Members</h4>
        </div>
        <div className="card-body p-0">
          <table className="table table-bordered table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Age</th>
                <th scope="col">Update</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {studentData.length > 0 ? (
                studentData.map((element, index) => (
                  <tr key={index} className="align-middle">
                    <th scope="row">{element.student_id}</th> {/* Use student_id */}
                    <td>{element.student_name}</td> {/* Use student_name */}
                    <td>{element.email}</td>
                    <td>{element.age}</td>
                    <td>
                      <NavLink
                        to={`/updatestudent/${element.student_id}`}
                        className="btn btn-sm btn-warning"
                      >
                        <i className="fa-solid fa-pen-to-square"></i> Update
                      </NavLink>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteStudent(element.student_id)} // Use student_id
                      >
                        <i className="fa-solid fa-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-3">
                    No student records found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
