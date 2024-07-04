//LOGIN ADMINISTRATOR//

const element = {
    password: document.querySelector("#password"),
    email: document.querySelector("#email"),
    submit: document.querySelector("#submitUserInfo"),
};
const messageError = document.querySelector('#error');


let boutonLogin = element.submit.addEventListener("click", (event) => {
    event.preventDefault();

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: element.email.value,
            password: element.password.value,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            localStorage.setItem("Token", data.token);

            if (data.message || data.error) {
                // message d'erreur 
                //   alert("Erreur dans l\'identifiant ou le mot de passe");
                messageError.textContent = "Erreur dans l’identifiant ou le mot de passe";


            }

            else {
                localStorage.setItem("isConnected", JSON.stringify(true));
                window.location.replace("index.html");
            }
        });
});















