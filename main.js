let express = require("express");
let fs = require("fs")
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })



let app = express();
let port = 3800;
app.use(express.static("public"));
app.use(express.static("uploads"));



app.delete("/deleteTodo/:id",(req,res)=>{
  let id = req.params.id;
  fs.readFile("./dB/data.txt", (err , data)=>{
    let storeData; 
    if(err){
      console.log("err")
    } 
    if(data.length){
        storeData = JSON.parse(data);

      let filterData = storeData.filter((task)=>{
          return task.taskId != id
        })
        fs.writeFile("./dB/data.txt" , JSON.stringify(filterData) , (err)=>{
          if(err){
            res.end("err")
          }else{
            res.end()
          }
        })
      }
 
     
  })


})

app.get("/getTodo" , (req,res)=>{
  fs.readFile("./dB/data.txt", (err , data)=>{
    let storeData;
    
    if(err){
      console.log("err")
    }
    
    if(data.length == 0){
      
        storeData = [];
      }else{
        storeData = JSON.parse(data);

      }
 
      res.json(storeData);
  })







})

app.post("/saveTodo",upload.single("todoPic") , (req , res)=>{

  console.log(req.body)
  console.log(req.file)
  return
  fs.readFile("./dB/data.txt", (err , data)=>{
    let storeData;
    let todo;
    
    if(err){
      console.log("err")
    }
    
    if(data.length == 0){
      //  console.log("sdfghjkl")
        storeData = [];
      }else{
        storeData = JSON.parse(data);

      }

      todo = JSON.parse(req.body.taskData)
      todo.filename = (req.file.filename)
      //console.log(todo)
      storeData.push(todo)

      fs.writeFile("./dB/data.txt" , JSON.stringify(storeData) , (err)=>{
        if(err){
          res.end("err")
        }else{
          res.json(todo)
        }
      })

  })
  


})

app.listen(port , ()=>{
    console.log(`server is running on port = ${port}`);
})
