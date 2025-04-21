let express = require("express");
const multer  = require('multer')
const {MongoClient} = require("mongodb");
let fs = require("fs")
var session = require('express-session')


const url = "mongodb://localhost:27017"

const dbName = "demoDb"

const client = new MongoClient(url)
let db;





let app = express();
let port = 3500;

app.set("view engine" , "ejs")

app.use(express.json())
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  
}))


app.use(express.urlencoded({extended:true}))
app.use(express.static("public"));
app.use(express.static("uploads"));

const storage = multer.diskStorage({
  destination : function(req , file , cb){
    if(req.path = "/saveTodo"){
      
      cb(null , "uploads/todos")
      
    }else{
      cb(null , "uploads/profile")
    }


  },

  filename : function(req , file , cb){
    cb(null , `todo+${file.originalname}`)

  }

})


const upload = multer({
 storage : storage
})

app.get("/", (req,res)=>{
  if(req.session.isLogged){
   // res.sendFile(__dirname+"/Home/index.html")
    res.render("index",{name : req.session.userName})
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
     
          req.session.isLogged = true
          req.session.userName = req.body.username
          res.redirect("/")

      

})

app.route("/signup").get((req ,res)=>{
  res.sendFile(__dirname+"/Signup/index.html")
}).post((req , res)=>{

})


app.delete("/deleteTodo/:id",async(req,res)=>{
  let id =parseInt( req.params.id);
  console.log(id);
  await db.collection("tasks").deleteOne({taskId : id})
  console.log(  await db.collection("tasks").deleteOne({taskId : id}))
  res.end()
  // fs.readFile("./dB/data.txt", (err , data)=>{
  //   let storeData; 
  //   if(err){
  //     console.log("err")
  //   } 
  //   if(data.length){
  //       storeData = JSON.parse(data);

  //     let filterData = storeData.filter((task)=>{
  //         return task.taskId != id
  //       })
  //       fs.writeFile("./dB/data.txt" , JSON.stringify(filterData) , (err)=>{
  //         if(err){
  //           res.end("err")
  //         }else{
  //           res.end()
  //         }
  //       })
  //     }
 
     
  // })


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



app.post("/saveTodo" ,upload.single("todoPics"), async(req , res)=>{

  // console.log(req.body)
  // console.log(req.file)

  try {
    let todo;
   
    todo = JSON.parse(req.body.taskData)
    todo.filename = req.file.filename
  // console.log(todo)
 
 let result1O=  await db.collection("tasks").insertOne(todo);
 console.log("on store",result1O)
      console.log(await db.collection("tasks").find())

       res.json(todo);
    
  } catch (error) {
      res.send("err");
  }

  // fs.readFile("./dB/data.txt", (err , data)=>{
  //   let storeData;
  //   let todo;
    
  //   if(err){
  //     console.log("err")
  //   }
    
  //   if(data.length == 0){
  //     //  console.log("sdfghjkl")
  //       storeData = [];
  //     }else{
  //       storeData = JSON.parse(data);

  //     }

  //     todo = JSON.parse(req.body.taskData)
  //     todo.filename = req.file.filename

       
  //     //console.log(todo)
  //     storeData.push(todo)

  //     fs.writeFile("./dB/data.txt" , JSON.stringify(storeData) , (err)=>{
  //       if(err){
  //         res.end("err")
  //       }else{
  //         res.json(todo)
  //       }
  //     })

  // })
  


})

app.use((err , req , res , next)=>{
    if(err){
      res.JSON(err)
    }
    next()
  })
  
  
  async function serverStart(){
    
    try {
      await client.connect();
      db = client.db(dbName)
      console.log("connect db")
    } catch (error) {
      console.log(error,"database")
    }
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  
  }


  serverStart()