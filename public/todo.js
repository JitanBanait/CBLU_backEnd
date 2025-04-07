 let input = document.getElementById("task-input");
let ul = document.getElementById("task-list");
let btn_log = document.getElementById("btn_log")

let taskId = 1;

getTodo(function(data){
if(data.length){
    data.forEach((task)=>{
        showTodo(task);
    })
}
});


btn_log.addEventListener("click",()=>{
    
})

function deleteTodo(task,callback){
    let request = new XMLHttpRequest()

    request.open("DELETE" , `/deleteTodo/${task.taskId}`)
    
    request.send()

    request.onload = ()=>{
       if( request.status == 200){
             callback();
       }
    }

}

function getTodo(callback){
    let request = new XMLHttpRequest()

    request.open("GET" , "/getTodo")
    
    request.send()

    request.onload = ()=>{
       if( request.status == 200){
       // console.log(request.responseText,"data");
       callback(JSON.parse(request.responseText));
       }
    }

}

function saveTodo(data,files,callback){

    let request = new XMLHttpRequest()
    

    request.open("POST" , "/saveTodo")
   // request.setRequestHeader("Content-Type" , "application/json")
    //request.setRequestHeader("time" , "application/json")

    let formData = new FormData();
    console.log(files)

   formData.append("todoPics" , files[0])
    formData.append("taskData", JSON.stringify(data));
    request.send(formData)

    request.onload = ()=>{
       if( request.status == 200){
        callback(JSON.parse(request.responseText));
       }
    }

}

function showTodo(data){
    console.log(data);
    let div = document.createElement("div")
    let img = document.createElement("img")
    img.setAttribute("src" , data.filename);
    div.innerText = data.task;
    div.appendChild(img)

    ul.appendChild(div)
    div.addEventListener("click" , (e)=>{
        deleteTodo(data,function(){
            ul.removeChild(e.target);
        });
    })

}
 input.addEventListener("keydown" , async(e)=>{
   
    if(e.key == "Enter"){

        let fileInput = document.getElementById("todoPic");
            let file = fileInput.files;

            if (!file) {
                alert("Please select a file!");
                return;
            }
        let data = {
            taskId : taskId,
            task : input.value,
            check : false,
            time : Date()
            
        }

        saveTodo(data ,file, showTodo)

        taskId++;
        input.value = "";
      
    }
 })

