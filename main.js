let express = require("express");
let fs = require("fs")

let app = express();
let port = 3800;
app.use(express.static("public"));
app.use(express.json());

app.post("/saveTodo" , (req , res)=>{

  fs.readFile("./dB/data.txt", (err , data)=>{
    let storeData;
    
    if(err){
      console.log("err")
    }
    
    if(data.length == 0){
        console.log("sdfghjkl")
        storeData = [];
      }else{
        storeData = JSON.parse(data);

      }
      storeData.push(req.body)

      fs.writeFile("./dB/data.txt" , JSON.stringify(storeData) , (err)=>{
        if(err){
          res.end("err")
        }else{
          res.end()
        }
      })

  })
  


})

app.listen(port , ()=>{
    console.log(`server is running on port = ${port}`);
})
