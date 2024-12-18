const express = require('express');

const studentController = require('../controller/student-controller');

const router = express.Router();

router.get('/students', studentController.retirveStudentData);

router.get('/subjects', studentController.subjectDropDown);

router.post('/insertstudent', studentController.insertStudentDetails);

router.get('/updateview/:id', studentController.updateView);

router.post('/updateStudents/:id', studentController.updateStudents);


router.get('/delete/student/:id', studentController.deleteStudentRecord);

module.exports = router;