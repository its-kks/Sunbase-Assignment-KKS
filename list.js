function handleFetchData(){
    const url = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp";
    let head ={
        "Content-Type": "application/json",
        "Authorization": "Bearer "+getCookie("token"),
    };
    let fetchOptions ={
        method: "GET",
        headers: head,
    }
    fetch(url, fetchOptions)
    .then((response)=>{
        if(response.status == 200){
            return response.json();
        }
        else{
            throw new Error("Login Failed");
        }
    })
    .then((data)=>{
        console.log(data);
    })
    .catch((error)=>{
        alert(error);
    })
}

function handleFillTable(data){
    let table = document.getElementById("table");
    for(let i=0; i<data.length; i++){
        let row = document.createElement("tr");

        //adding uuid to handle delete and update
        row.setAttribute("id", data[i].id); 

        let cell1 = row.insertCell();
        let cell2 = row.insertCell();
        let cell3 = row.insertCell();
        let cell4 = row.insertCell();
        let cell5 = row.insertCell();
        let cell6 = row.insertCell();
        let cell7 = row.insertCell();
        let cell8 = row.insertCell();
        let cell9 = row.insertCell();

        let buttonEdit = document.createElement("button");
        buttonEdit.innerHTML = "Edit";
        buttonEdit.addEventListener("click", (event)=>{
            event.preventDefault();
            handleEdit(row);
        });
        let buttonDelete = document.createElement("button");
        buttonDelete.addEventListener("click", (event)=>{
            event.preventDefault();
            handleDelete(row);
        });
        buttonDelete.innerHTML = "Delete";

        cell1.innerHTML = data[i].first_name || " ";
        cell2.innerHTML = data[i].last_name || " ";
        cell3.innerHTML = data[i].street || " ";
        cell4.innerHTML = data[i].address || " ";
        cell5.innerHTML = data[i].city || " ";
        cell6.innerHTML = data[i].state || " ";
        cell7.innerHTML = data[i].email || " ";
        cell8.innerHTML = data[i].phone || " ";

        cell9.appendChild(buttonEdit);
        cell9.appendChild(buttonDelete);
        table.appendChild(row);
    }
}


function getCookie(name){
    let cookie = document.cookie;
    let cookieArray = cookie.split(";");
    for(let i=0; i<cookieArray.length; i++){
        let cookieItem = cookieArray[i].split("=");
        if(cookieItem[0].trim() == name){
            return cookieItem[1];
        }
    }
    return "";
}

function handleDelete(row){
    let id = row.getAttribute("id");
    let url = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?id="+id+"?cmd=delete";
    let head ={
        "Content-Type": "application/json",
        "Authorization": "Bearer "+getCookie("token"),
    };
    let fetchOptions ={
        method: "DELETE",
        headers: head,
    }
    fetch(url, fetchOptions)
    .then((response)=>{
        if(response.status == 200){
            return response.json();
        }
        else if(response.status == 400){
            throw new Error("Unauthorized");
        }
        else if(response.status == 500){
            throw new Error("Failed to delete");
        }
    })
    .then((data)=>{
        console.log(data);
        row.remove();
    })
    .catch((error)=>{
        alert(error);
    })

}

// if update is successful set new data
function handleInputToTextUpdated(row){
    let tds = row.getElementsByTagName("td");

    for(let i=0; i<tds.length-1; i++){
        tds[i].innerHTML = tds[i].getElementsByTagName("input")[0].value;
    }
    const updateBtn = tds[tds.length-1].childNodes[0];
    updateBtn.innerHTML = "Update";
    updateBtn.addEventListener("click", (event)=>{
        event.preventDefault();
        handleEdit(row);
    });
}

// if update fails set previous data
function handleInputToTextNotUpdated(row,prevData){
    let tds = row.getElementsByTagName("td");

    for(let i=0; i<tds.length-1; i++){
        tds[i].innerHTML = prevData[i];
    }
    const updateBtn = tds[tds.length-1].childNodes[0];
    updateBtn.innerHTML = "Update";
    updateBtn.addEventListener("click", (event)=>{
        event.preventDefault();
        handleEdit(row);
    });
}


//handling api call for update
function handleSave(row,prevData){

    const id = row.getAttribute("id");
    let url = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?id="+id+"?cmd=update";
    let tds = row.getElementsByTagName("td");

    let postData = {
        "first_name" : tds[0].getElementsByTagName("input")[0].value,
        "last_name" : tds[1].getElementsByTagName("input")[0].value,
        "street" : tds[2].getElementsByTagName("input")[0].value,
        "address" : tds[3].getElementsByTagName("input")[0].value,
        "city" : tds[4].getElementsByTagName("input")[0].value,
        "state" : tds[5].getElementsByTagName("input")[0].value,
        "email" : tds[6].getElementsByTagName("input")[0].value,
        "phone" : tds[7].getElementsByTagName("input")[0].value,
    }

    let head ={
        "Content-Type": "application/json",
        "Authorization": "Bearer "+getCookie("token"),
    };
    let fetchOptions ={
        method: "PUT",
        headers: head,
        body: JSON.stringify(postData),
    }
    fetch(url, fetchOptions)
    .then((response)=>{
        if(response.status == 200){
            return response.json();
        }
        else if(response.status == 400){
            throw new Error("Body is empty");
        }
        else if(response.status == 500){
            throw new Error("Failed to update");
        }
    })
    .then((data)=>{
        console.log(data);
        handleInputToTextUpdated(row);
    })
    .catch((error)=>{
        alert(error);
        handleInputToTextNotUpdated(row,prevData);
        console.log(prevData);
    })
}

//changing text to input for editing
function handleEdit(row){
    let tds = row.getElementsByTagName("td");
    let id = row.getAttribute("id");

    
    const previousData = [];
    for(let i=0; i<tds.length-1; i++){
        let input = document.createElement("input");
        input.classList.add("inputsTable");
        input.value = tds[i].innerHTML;

        //saving previous data if update fails
        previousData[i] = tds[i].innerHTML;
        tds[i].innerHTML = "";
        tds[i].appendChild(input);
    }
    const updateBtn = tds[tds.length-1].childNodes[0];
    updateBtn.innerHTML = "Save";
    updateBtn.addEventListener("click", (event)=>{
        event.preventDefault();
        handleSave(row,previousData);
    });
}

document.getElementById('addBtn').addEventListener("click", (event)=>{
    event.preventDefault();
    window.location.href = "/Add.html";
});

handleFetchData();