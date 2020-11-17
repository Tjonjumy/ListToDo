//Data 
var items;
let data = localStorage.getItem("TODO");//  Retrieve data
if(data){
    items=JSON.parse(data);
}
else{
    items=[];
}
let countCompleted=0;

//variables
const list=document.getElementById('list');
const completedList=document.getElementById('completedList');
const CHECK='fa-check-circle';
const UNCHECK='fa-circle-thin';
const LINETHROUGHT='lineThrought';
// Generating list to-do function
function render(){
    var html="";
    var comphtml="";
    items.forEach(item=>{
    if(item.trash){return;}
    const DONE=item.done?CHECK:UNCHECK;
    const LINE=item.done?LINETHROUGHT:"";
    if(item.done){
        comphtml+=`<li class="item ${item.id}" >
            <i class="fa ${DONE}" aria-hidden="true" job="complete"></i>
            <span class="text ${LINE}">${item.todo}</span>
            <i class="fa fa-trash-o" aria-hidden="true" job="delete"></i>
        </li>`;
        return;
    }
    html+=`<li class="item ${item.id}" >
            <i class="fa ${DONE}" aria-hidden="true" job="complete"></i>
            <span class="text ${LINE}">${item.todo}</span>
            <i class="fa fa-trash-o" aria-hidden="true" job="delete"></i>
        </li>`;
    });
    list.innerHTML=html;
    completedList.innerHTML=comphtml;
}

// Get value of input when enter key is pressed
var input=document.getElementById('input');
const plusElement = document.querySelector('.fa-plus-circle');
var toDo="";
//add item by plus button
plusElement.addEventListener('click',()=>{
    toDo=input.value;
    if(toDo){
        addToDo();
    }
    input.value="";
    localStorage.setItem("TODO", JSON.stringify(items));
    //console.log(JSON.stringify(items));
});
// add to item by enter key
input.onkeydown=function(event){
    if(event.keyCode==13){
        toDo=input.value;
        if(toDo){
            addToDo();
        }
        input.value="";
        localStorage.setItem("TODO", JSON.stringify(items));
        //console.log(JSON.stringify(items));
    }
}
                   
//Add To-do item
function addToDo(){
    items.push(
        {
            id:items.length,
            todo:`${toDo}`,
            done:false, 
            trash:false
        }
    );
    render();
}


//Refresh List To-do
const alertBox=document.querySelector('.alertBox');
const yesConfirm=document.querySelector('.yes');
const noConfirm=document.querySelector('.no');
const close=document.querySelector('.fa-times');
const refreshElement=document.querySelector('.refresh');
close.addEventListener('click',()=>{
    alertBox.style.display='none';
})
refreshElement.onclick=function(){
    refreshElement.style.transform=`rotate(0deg)`;
    alertBox.style.display='block'; 
    alertBox.classList.remove('close');
    alertBox.classList.add('open'); 
     
}
yesConfirm.addEventListener('click',()=>{
    alertBox.style.display='none';
    items.splice(0,items.length);
    countCompleted=0;
    updateCountCompleted();
    localStorage.setItem("TODO", JSON.stringify(items));
    render();
})
noConfirm.addEventListener('click',()=>{
    alertBox.classList.remove('open');
    alertBox.classList.toggle('close');
    
})
refreshElement.onmousemove=function(){
    refreshElement.style.transform=`rotate(45deg)`;
}
refreshElement.onmouseout=function(){
    refreshElement.style.transform=`rotate(0deg)`;
}

//Show today's date
const options = {weekday : "long", month:"short", day:"numeric"};
const today=new Date();
let dateElement=document.getElementById('date');
dateElement.innerText=today.toLocaleDateString("en-US", options);

//Delete to do
function deleteToDo(element){
    element.parentElement.parentElement.removeChild(element.parentElement);
    items[element.parentElement.classList.value.slice(5)].trash=true;
    if(items[element.parentElement.classList.value.slice(5)].done){
        countCompleted--;
        updateCountCompleted();
    }   
}
// check or uncheck
function check(element){
    if(element.tagName=='I'){
        element.classList.toggle('fa-circle-thin');
        element.classList.toggle('fa-check-circle');
        element.parentElement.querySelector('.text').classList.toggle('lineThrought');
    }
    else if(element.tagName=='SPAN'){
        element.classList.toggle('lineThrought');
        element.parentElement.querySelector('.fa').classList.toggle('fa-circle-thin');
        element.parentElement.querySelector('.fa').classList.toggle('fa-check-circle');
    }
    let elementId=element.parentElement.classList.value.slice(5);
    items[elementId].done = items[elementId].done ? false:true;
}
//Complete to do
function completeToDo(element){
    check(element);
    countCompleted++;
    updateCountCompleted();
    list.removeChild(element.parentElement);
    completedList.appendChild(element.parentElement);
}
// re-complete to do
function recomplete(element){
    check(element);
    countCompleted--;
    updateCountCompleted();
    completedList.removeChild(element.parentElement);
    list.appendChild(element.parentElement);
}
// action when click each item
list.addEventListener('click',(event)=>{
    action(event);
});
completedList.addEventListener('click',(event)=>{
    action(event);
});
function action(event){
    const element=event.target; 
    const elementJob=element.attributes.job ? element.attributes.job.value:event.target.tagName;
    if(elementJob=='delete'){
        deleteToDo(element);
    }
    else if(elementJob=='complete'||elementJob=='SPAN'){
        if(event.target.parentElement.parentElement.id=="list"){
            completeToDo(element);
        }
        else{
            recomplete(element);
        }
    }
    localStorage.setItem("TODO", JSON.stringify(items));
}
window.onload=function(){
    render();
    items.forEach((item)=>{
        if(item.done&&!item.trash){
            countCompleted++;
        }
    });
    updateCountCompleted();
}

// completed list
const completed=document.querySelector('.completed');
const completedText=document.querySelector('.completed span');
const chevrondown=document.querySelector('.fa-chevron-down');
// initial completed list
function updateCountCompleted(){
    if(countCompleted>0){
        completed.style.display="block";
        completedText.innerText=`Completed ${countCompleted}`;
    }
    else{
        completed.style.display="none";
    }
}

completed.addEventListener('click',()=>{
    if(window.getComputedStyle(chevrondown).getPropertyValue('transform')=='matrix(6.12323e-17, -1, 1, 6.12323e-17, 0, 0)'){
        chevrondown.style.transform="rotate(0deg)";
        completedList.style.display='block';
    }
    else{
        chevrondown.style.transform="rotate(-90deg)";
        completedList.style.display='none';
    } 
});
