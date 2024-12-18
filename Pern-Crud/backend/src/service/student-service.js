const studentModels = require('../models/student-models');

module.exports.fetchStudentDetails = async() => {
    const data = await studentModels.retriveStudentDetails()
    console.log('data in service ===<<<>>>', data)

    return data
}

module.exports.subjectList = async() => {
    const data = await studentModels.subjectDropDown();
    return data
}


module.exports.insertStudentData = async(studentData) => {
    console.log(' data in service studentData ==<<<>>> ', studentData)

    const data = await studentModels.insertStudent(studentData);
    return data
}  


module.exports.upadteView = async(studentId) => {
    const data = await studentModels.updateStudentView(studentId);
    return data
}

module.exports.updateStudenData = async(studentId, studentData) => {

    const data = await studentModels.updateStudentDetails(studentId, studentData);
    return data
}

module.exports.deleteStudent = async(studentId) => {

    const data = await studentModels.deleteStudentDetails(studentId);
    return data
}