const studentService = require('../service/student-service')

module.exports.retirveStudentData = async(req, res, next) => {

    const data = await studentService.fetchStudentDetails();
    console.log('retrive data into stude service ===<<<>>>', data)
    res.status(200).json({
        status: 200,
        message : 'Data Retrived successfully',
        data
    });
}

module.exports.subjectDropDown = async(req, res, next) => {
    const data = await studentService.subjectList();
    console.log('retrive data into students dropdown service ===<<<>>>', data)
    res.status(200).json({
        status: 200,
        message : 'Data Retrived successfully',
        data
    });

}

module.exports.insertStudentDetails = async(req, res, next) => {
    const studentData = req.body;
    console.log('students data in controller ===<<<>>>', studentData);

    const data = await studentService.insertStudentData(studentData);
    console.log('data response in controller ===<<<>>', data);
    res.status(data.status).json({
        status : data.status,
        message : data.message
    })

} 

module.exports.updateView = async(req, res, next) => {
    const studentId = req.params.id;
    console.log('studentId in controller ==<<<>>', studentId);
    const data = await studentService.upadteView(studentId);
    console.log('data ===<<<<>>>>>', data);
    res.status(data.status).json({
        status : data.status, 
        data
    })
}


module.exports.updateStudents = async(req, res, next) => {
    const studentId = req.params.id;
    const studentData = req.body;
    console.log('student id and studentdata ===<<>>', studentData, studentId);

    const data = await studentService.updateStudenData(studentId, studentData);
    console.log('data response in controller ===<<<<>>>>', data);
    res.status(data.status).json({
        status : data.status,
        message : data.message
    })

}

module.exports.deleteStudentRecord = async(req, res, next) => {
    const studentId = req.params.id;
    console.log('student id ==<<>>>', studentId);

    const data = await studentService.deleteStudent(studentId);
    res.status(data.status).json({
        status: data.status,
        message : data.message
    })
}