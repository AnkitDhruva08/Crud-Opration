const {
  read_db,
  write_db,
} = require("../config/db-configs");

const dbPoolManager = require("../config/db-pool-manager");

const readDB = dbPoolManager.get("readDB", read_db);
const writeDB = dbPoolManager.get("writeDb", write_db);

module.exports.retriveStudentDetails = async () => {
  let stdSql = {
      text: `
         SELECT 
            students.student_id,
            students.student_name,
            students.email,
            students.age
        FROM 
            students
        WHERE 
            active = true
        ORDER BY 
            students.student_id DESC; 
      `
  };

  try {
      const result = await readDB.query(stdSql);

      
      return result.rows;
  } catch (error) {
     
      console.error("Error retrieving student details:", error);
      throw new Error("Failed to retrieve student details");
  }
};


module.exports.subjectDropDown = async() => {
  let subject = {
    text: ` SELECT subject_id,
    name as subject_name 
    
    FROM 
    subjects
    `
  } 

  try {
    // Execute the query using the readDB pool
    const result = await readDB.query(subject);

    // Return the result rows (student details)
    return result.rows;
    } catch (error) {
        console.error("Error retrieving student details:", error);
        throw new Error("Failed to retrieve student details");
    }
}


module.exports.insertStudent = async (studentData) => {
  
    console.log('studentData in models ===<<<>>', studentData);

    const { name, email, age, subject_id } = studentData;

    // Step 1: Insert into students table
    const studentQuery = {
      text : `   INSERT INTO students (student_name, email, age, subject_id)
      VALUES ($1, $2, $3, $4)
      RETURNING student_id;`,
      values : [name, email, age, subject_id]
    }

    try {
      const data = await writeDB.query(studentQuery);
      console.log('data ===<<<>>', data)
      return {
        status: 200,
        message: 'Data inserted successfully',
       
      };
    }

    
  catch (error) {
    // Handle errors
    console.error('Error inserting data:', error);
    return {
      status: 500,
      message: 'Failed to insert data',
      error: error.message
    };
  }
};


// update viws 

module.exports.updateStudentView = async (studentId) => {
  console.log('studentId in models ===<<<>>>', studentId);
  
  const sql = {
    text: 'SELECT * FROM students WHERE student_id = $1',  
    values: [studentId]  
  };

  try {
    const result = await readDB.query(sql);

    if (result.rows.length === 0) {
      return {
        status: 404,
        message: 'Student not found'
      };
    }

    return {
      status: 200,
      data: result.rows[0]  // Get the first student record from the result
    };
  } catch (error) {
    console.error('Error fetching student:', error);
    return {
      status: 500,
      message: 'Failed to retrieve data',
      error: error.message
    };
  }
};


module.exports.updateStudentDetails = async (studentId, studentData) => {
  console.log('studentData ===<<<>>>', studentData);
  console.log('studentId ===<<<>>>', studentId);
  

  const { name, email, age, subject_id } = studentData;

  const sql = {
    text: `
      UPDATE students
      SET 
        student_name = $1, 
        email = $2, 
        age = $3, 
        subject_id = $4, 
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        student_id = $5
    `,
    values: [name, email, age, subject_id, studentId] 
  };

  try {
    const result = await writeDB.query(sql); 


    if (result.rowCount === 0) {
      return {
        status: 404,
        message: 'Student not found or no changes made'
      };
    }

    return {
      status: 200,
      message: 'Student updated successfully'
    };
  } catch (error) {
    console.error('Error updating student:', error);
    return {
      status: 500,
      message: 'Failed to update student details',
      error: error.message
    };
  }
};


module.exports.deleteStudentDetails = async (studentId) => {
  const sql = {
    text: `
      UPDATE students
      SET 
        active = $1, 
        updated_at = CURRENT_TIMESTAMP
      WHERE 
        student_id = $2
    `,
    values: [false, studentId] 
  };

  try {
    const result = await writeDB.query(sql); 
    
    if (result.rowCount > 0) {
      return {
        status: 200,
        message: "Record deleted successfully"
      };
    } else {
      
      return {
        status: 404,
        message: "Record not found"
      };
    }
  } catch (error) {
    console.error("Error updating student record:", error);
    
    return {
      status: 500,
      message: "An error occurred while deleting the record"
    };
  }
};
