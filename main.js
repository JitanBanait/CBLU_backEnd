let express = require("express");
let fs = require("fs")

let app = express();
let port = 3800;
app.use(express.static("public"));
//app.use(express.json())
app.use((req,res,next)=>{
  let content = req.rawHeaders.find((data)=>{
    return data == 'application/json'
  })
  if(content == "application/json"){
    let body = "";   
    req.on("data",(chunk)=>{
        body += chunk 
    })
    req.on("end",()=>{
      let data = JSON.parse(body)
      req.body = data
      console.log(req.body)
      next()
    })
  }else{
    next()
  }
})

app.use((req,res,next)=>{
      console.log(req.url);
   next()
})

app.use((req,res,next)=>{
  console.log("middleWare 2 ");
  next()
})


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

app.post("/saveTodo" , (req , res)=>{

  console.log(req.body)

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
