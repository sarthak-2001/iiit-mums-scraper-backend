const express = require("express");
const { attendanceScraper } = require("../functions/attendance");

const router = new express.Router();

router.post("/attendance/:sem", async (req, res) => {
  let attendance = await attendanceScraper(req.body.uid, req.body.pwd ,req.params.sem );
  if (!attendance) {
    res.status(500).json({ msg: "ERROR" });
  } else if (attendance == "error") {
    res.status(400).json({ msg: "wrong user id" });
  } else {
      let c=0;
    for(let index = 0 ;index < attendance.Attendance.length ; index++){
        //console.log(attendance.Attendance[index])
        if( attendance.Attendance[index].total_days )
        c++;
    } 
    if(c>=1) 
    res.status(200).json({ msg: "success" })
    else
    res.status(404).json({msg: "Data not found"})
  } 
});

module.exports = router;
