 let input = document.getElementById("task-input");
let ul = document.getElementById("task-list");

let taskId = 1;

function saveTodo(data,callback){

    let request = new XMLHttpRequest()

    request.open("POST" , "/saveTodo")
    request.setRequestHeader("Content-Type" , "application/json")

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

