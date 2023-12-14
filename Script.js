async function handleLogin(){
    let loginId = document.getElementById("loginId").value;
    let password = document.getElementById("password").value;

    let postData = {
        "login_id" : loginId,
        "password" : password,
    }

    
    let head ={
        "Content-Type": "application/json",
    };
    

    let fetchOptions ={
        method: "POST",
        headers: head,
        body: JSON.stringify(postData),
    }

    const url = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp";

    fetch(url, fetchOptions)
    .then((response)=>{
        if(response.ok){
            return response.json();
        }
        else{
            throw new Error("Login Failed");
        }
    })
    .then((data)=>{
        document.cookie = "token="+data.access_token;
        window.location.href = "/List.html";
    })
    .catch((error)=>{
        alert(error);
    })
    
}


let form = document.getElementById("loginForm");

form.addEventListener("submit", (event)=>{
    event.preventDefault();
    handleLogin();
});


