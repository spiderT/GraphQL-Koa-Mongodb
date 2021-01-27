const { saveStudent, fetchStudent } = require("../controllers/student");

const router = require("koa-router")();

router.post("/savestudent", saveStudent);
router.get("/student", fetchStudent);

module.exports = router;
