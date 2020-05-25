const express = require("express")
const noitces = require('../functions/notices')


const router = new express.Router()

router.post("/notices",async (req,res)=>{
    let notices = await  noitces(req.body.uid,req.body.pwd);
  
  if(!notices){
    res.status(500).send('ERROR');
  }
  else{
    res.status(200).send(notices);
  }
})

module.exports = router;