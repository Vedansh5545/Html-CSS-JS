// Variables
const inputbtn = document.getElementById('input-btn');
const myLeads = [];
const inputEln = document.getElementById('input-n-el');
const inputEll = document.getElementById('input-l-el');
const ulEl = document.getElementById('ul-el');
let deletebtn = document.getElementById('delete-btn');
let savebtn = document.getElementById('save-btn');

// Functions
savebtn.addEventListener('click', function() {
    chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
        myLeads.push({ name: tabs[0].url, link: tabs[0].url });
        localStorage.setItem('myLeads', JSON.stringify(myLeads));
        render(myLeads); // Call render function with myLeads parameter
    });
});

deletebtn.addEventListener('click', function(){
    console.log("delete");
    localStorage.clear();
    myLeads.length = 0; // Empty the array without reassigning
    render(myLeads); // Call render function with myLeads parameter
    console.log("Tab saved");
});

inputbtn.addEventListener('click', function() {
    myLeads.push({ name: inputEln.value, link: inputEll.value });
    render(myLeads); // Call render function with myLeads parameter
    inputEll.value ="";
    inputEln.value ="";
    localStorage.setItem('myLeads', JSON.stringify(myLeads));
    console.log("Data saved");
});

function render(myLeads) {
    ulEl.innerHTML = "";
    myLeads.forEach(lead => {
        ulEl.innerHTML += `<li><a target="_blank" href="${lead.link}">${lead.name}</a></li>`;
    });
}

// Check if there are previously saved leads
const leadsFromLocalStorage = JSON.parse(localStorage.getItem('myLeads'));
if (leadsFromLocalStorage) {
    myLeads.push(...leadsFromLocalStorage);
    render(myLeads); // Call render function with myLeads parameter
}
