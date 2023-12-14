function getFormData(){
    let formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        street: document.getElementById('street').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };

    for(let key in formData){
        if(formData[key] === ""){
            delete formData[key];
        }
    }
    return formData;
}

async function handleAdd(){
    let formData = getFormData();
    console.log(formData);

    if(formData.firstName == "" || formData.lastName == ""){
        alert("First Name and Last Name are mandatory");
        return;
    }
    else{

        let head ={
            "Content-Type": "application/json",
            "Authorization": "Bearer "+getCookie("token"),
        };
        let fetchOptions ={
            method: "POST",
            headers: head,
            body: JSON.stringify(formData),
        }
    
        const url = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp+?cmd=add";
    
        fetch(url, fetchOptions)
        .then((response)=>{
            if(response.status == 200){
                return response.json();
            }
            else if(response.status == 400){
                throw new Error("First Name or Last Name is missing");
            }
        })
        .then((data)=>{
            console.log(data);
        })
        .catch((error)=>{
            alert(error);
        })
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

document.getElementById("addForm").addEventListener("submit", (event)=>{
    event.preventDefault();
    handleAdd();
});

document.getElementById("backBtn").addEventListener("click", (event)=>{
    window.location.href = "/List.html";
});