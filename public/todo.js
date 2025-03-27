 let input = document.getElementById("task-input");
let ul = document.getElementById("task-list");

let taskId = 1;

getTodo(function(data){
if(data.length){
    data.forEach((task)=>{
        showTodo(task);
    })
}
});

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

function saveTodo(data,callback){

    let request = new XMLHttpRequest()
    let time = sessionStorage.getItem("todoTime")

    request.open("POST" , "/saveTodo")
    request.setRequestHeader("Content-Type" , "application/json")
    request.setRequestHeader("time" , "application/json")


    request.send(JSON.stringify(data))

    request.onload = ()=>{
       if( request.status == 200){
        callback(data);
       }
    }

}

function showTodo(data){
    let div = document.createElement("div")
    div.innerText = data.task;
    ul.appendChild(div)
    div.addEventListener("click" , (e)=>{
        deleteTodo(data,function(){
            ul.removeChild(e.target);
        });
    })

}
 input.addEventListener("keydown" , async(e)=>{
   
    if(e.key == "Enter"){

        let data = {
            taskId : taskId,
            task : input.value,
            check : false,
            time : Date()
            
        }

        saveTodo(data , showTodo)

        taskId++;
        input.value = "";
      
    }
 })

