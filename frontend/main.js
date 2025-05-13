const buttonRegister = document.querySelector(".main_form_button-register");
const formRegister = document.querySelector(".form-register");

formRegister.addEventListener("submit", (e) => {
  e.preventDefault();
  const formRegisterData = new FormData(formRegister);
  const data = {
    name: formRegisterData.get("name-input"),
    username: formRegisterData.get("username-input"),
    password: formRegisterData.get("password-input"),
  };
  fetch("http://localhost:3000/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("Respuesta del servidor:", res);
    })
    .catch((err) => {
      console.error("Error:", err.message);
    });
});
