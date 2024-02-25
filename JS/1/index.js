let count = 0;
let saveStr = "Previous data: ";

function increment (){
    console.log('clicked'); 
    count++;
    console.log(count);
    document.getElementById('count_el').innerHTML = count;
}

function decrement (){
    console.log('clicked');
    count--;
    console.log(count);
    document.getElementById('count_el').innerHTML = count;
}

function save () {
    console.log('saving');
    console.log(count);
    saveStr = saveStr + count + ", ";
    let tempString = document.getElementById("save-el");
    tempString.innerText = saveStr;

    count = 0;
    document.getElementById('count_el').innerHTML = count;
}
