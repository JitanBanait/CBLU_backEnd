let express = require("express");
let fs = require("fs")
var session = require('express-session')



let app = express();
let port = 3500;


app.use(express.json())
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))


app.use(express.urlencoded({extended:true}))
app.use(express.static("public"));
app.use(express.static("uploads"));


const multer  = require('multer')

const upload = multer({
  dest : "uploads/"
})

app.get("/", (req,res)=>{
  if(req.session.isLogged){
    res.sendFile(__dirname+"/Home/index.html")
    
  }else{
    res.redirect("/login")
  }
})

app.route("/login").get((req ,res)=>{
if(req.session.isLogged){
  res.redirect("/")
}else{
  
  res.sendFile(__dirname+"/Login/index.html")
}

}).post((req , res)=>{
      console.log(req.body);
      // get data from dB and match
      if(req.body.username == "ram"){
          req.session.isLogged = true
          res.redirect("/")

      }else{

        res.send("not found")
      }

})

app.route("/signup").get((req ,res)=>{
  res.sendFile(__dirname+"/Signup/index.html")
}).post((req , res)=>{

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

app.get("/logout",(req,res)=>{
  req.session.destroy()
  res.redirect("/");
})



app.post("/saveTodo" ,upload.single("todoPics"), (req , res)=>{

  console.log(req.body)
  console.log(req.file)

  
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
      todo.filename = req.file.filename
       
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
