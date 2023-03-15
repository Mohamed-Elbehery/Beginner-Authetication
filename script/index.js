//! Variables
const form = document.querySelector("form");
const username = document.querySelector('input[type="text"]');
const email = document.querySelector('input[type="email"]');
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirm-password");
const signupBtn = document.querySelector("#signup");
const loginBtn = document.querySelector("#login");
const links = document.querySelectorAll("header nav ul li a");
const cards = document.querySelectorAll(".landing .cards .card");
const cardsImages = document.querySelectorAll(".landing .cards .card img");
const checkBtn = document.querySelector("#check-btn");
let checkedEmail = {};
let isHere = false;
const saveBtn = document.querySelector("#save-btn");
//! Error spans
const usernameError = document.querySelector("#name-error");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const confirmError = document.querySelector("#confirm-error");
const error = document.querySelector("#error");
let users = [];

//! Admin Account
const adminName = "Admin";
const admin = "admin@amit.com";
const adminPassword = "admin";

//! Functions
// Will be triggered when the signup button is clicked
const signup = () => {
  let isDuplicated = false;
  if (username.value == "") {
    username.focus();
    usernameError.innerHTML = "Username is Required";
  } else if (email.value == "") {
    email.focus();
    emailError.innerHTML = "Email is Required";
  } else if (password.value == "") {
    password.focus();
    passwordError.innerHTML = "Password is Required";
  } else if (confirmPassword.value == "") {
    confirmPassword.focus();
  } else if (confirmPassword.value != password.value) {
    confirmError.innerHTML = "Password does not match";
  } else {
    const user = {
      username: username.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    };

    users.forEach((u) => {
      if (user.email === u.email) {
        isDuplicated = true;
      }
    });

    if (!isDuplicated) {
      error.innerHTML = "";
      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));
      console.log(users);
      setTimeout(() => {
        window.open("login.html", "_self");
        username.value =
          email.value =
          password.value =
          confirmPassword.value =
            "";
      }, 1000);
    } else error.innerHTML = "Email already exists";
  }
};

// Will be triggered when the login button is clicked
const login = () => {
  localStorage.removeItem("checkedEmail");
  if (email.value == "") {
    if (emailError) emailError.innerHTML = "Email is Required";
  } else if (password.value == "") {
    if (passwordError) passwordError.innerHTML = "Password is Required";
  } else {
    users.forEach((user) => {
      if (email.value == user.email && password.value == user.password) {
        localStorage.setItem("loggedUser", JSON.stringify(user));
        setTimeout(() => {
          window.open("home.html", "_self");
        }, 1000);
      } else if (email.value == admin && password.value == adminPassword) {
        localStorage.setItem(
          "loggedUser",
          JSON.stringify({
            username: adminName,
            email: admin,
            password: "admin",
          })
        );
        setTimeout(() => {
          window.open("home.html", "_self");
        }, 1000);
      }
    });
  }
};

// Will be triggered when the logut button is clicked
const logout = () => {
  localStorage.removeItem("loggedUser");
  window.open("login.html", "_self");
};

// Will check if the user is in the users array
const checkEmail = () => {
  users.forEach((user) => {
    if (user.email == email.value) {
      isHere = true;
    }
  });
  if (isHere) {
    checkedEmail = users.filter((user) => user.email == email.value)[0];
    localStorage.setItem("checkedEmail", JSON.stringify(checkedEmail));
    email.value = "";
    window.open("reset-password.html", "_self");
  }
};

// Will save the changes in the checked email
const saveChanges = () => {
  if (
    password.value == confirmPassword.value &&
    password.value != "" &&
    confirmPassword.value != ""
  ) {
    checkedEmail.password = password.value;
    checkedEmail.confirmPassword = confirmPassword.value;
    localStorage.setItem("checkedEmail", JSON.stringify(checkedEmail));

    users.forEach((user) => {
      if (user.email == checkedEmail.email) {
        user.password = checkedEmail.password;
      }
    });

    localStorage.setItem("users", JSON.stringify(users));

    window.open("login.html", "_self");
  }
};

// Will be triggered on each key press
const validate = (selector, span, errorValue) => {
  if (selector.value.length > 0) {
    if (span) span.innerHTML = "";
  } else {
    if (span) span.innerHTML = errorValue;
  }
};

// Will prevent the form from submitting
const handleSubmit = (e) => {
  e.preventDefault();
};

//! Event Listeners
if (form) form.addEventListener("submit", handleSubmit);
if (signupBtn) signupBtn.addEventListener("click", signup);
if (loginBtn) loginBtn.addEventListener("click", login);
if (checkBtn) checkBtn.addEventListener("click", checkEmail);
if (saveBtn) saveBtn.addEventListener("click", saveChanges);

//! Validation Styles
if (username)
  username.addEventListener("keyup", () =>
    validate(username, usernameError, "Username is Required")
  );
if (email)
  email.addEventListener("keyup", () =>
    validate(email, emailError, "Email is Required")
  );
if (password)
  password.addEventListener("keyup", () =>
    validate(password, passwordError, "Password is Required")
  );
if (confirmPassword)
  confirmPassword.addEventListener("keyup", () =>
    validate(confirmPassword, confirmError, "Password does not match")
  );

//! onload
window.addEventListener("load", () => {
  if (localStorage.users) users = JSON.parse(localStorage.users);

  //* if the user is not logged in
  if (!localStorage.loggedUser) {
    const header = document.createElement("header");
    header.innerHTML = `
    <div class="logo">
      <h1><a href="home.html">Zoro</a></h1>
    </div>
    <nav>
      <ul>
        <li><a href="home.html">Home</a></li>
        <li><a href="login.html">Login</a></li>
        <li><a href="index.html">Register</a></li>
      </ul>
    </nav>`;
    document.body.prepend(header);

    cardsImages.forEach((cardImage) => {
      cardImage.classList.add("hide-img");
    });

    cards.forEach((card) => {
      card.innerHTML += `
      <div class="need-to-login">
        <a href="login.html">Login</a>
        <p>Or</p>
        <a href="index.html">Signup</a>
      </div>
    `;
    });

    const login_signup_btns = document.querySelectorAll(".need-to-login a");
    login_signup_btns.forEach((btn) => {
      btn.style.cssText = "pointer-events: none";
    });

    cards.forEach((card) => {
      card.addEventListener("transitionend", () => {
        login_signup_btns.forEach((btn) => {
          btn.style.cssText = "pointer-events: all;";
        });
      });
    });
  } else {
    //* if the user is logged in
    if (JSON.parse(localStorage.loggedUser).email != admin) {
      const header = document.createElement("header");
      header.innerHTML = `
    <div class="logo">
      <h1><a href="home.html">Zoro</a></h1>
      </div>
    <nav>
      <ul>
      <li><a href="home.html">Home</a></li>
      <li class="user">Hello, ${
        JSON.parse(localStorage.loggedUser).username
      }</li>
        <li><a class="logout" onclick="logout()">Logout</a></li>
        </ul>
        </nav>`;
      document.body.prepend(header);

      cards.forEach((card) => {
        card.innerHTML += `
          <div class="card-info">
            <p>
              Roronoa Zoro, also known as "Pirate Hunter" Zoro, is a fictional
              character in the One Piece franchise.
            </p>
          </div>
        `;
      });
    } else {
      //* if the admin is logged in
      const header = document.createElement("header");
      header.innerHTML = `
    <div class="logo">
      <h1><a href="home.html">Zoro</a></h1>
      </div>
    <nav>
      <ul>
      <li><a href="home.html">Home</a></li>
      <li><a href="soon.html">Soon</a></li>
      <li class="user">Hello, ${
        JSON.parse(localStorage.loggedUser).username
      }</li>
        <li><a class="logout" onclick="logout()">Logout</a></li>
        </ul>
        </nav>`;
      document.body.prepend(header);

      cards.forEach((card) => {
        card.innerHTML += `
          <div class="card-info">
            <p>
              Roronoa Zoro, also known as "Pirate Hunter" Zoro, is a fictional
              character in the One Piece franchise.
            </p>
          </div>
        `;
      });
    }
  }

  //* if the user is logged in it will redirect him to the home page
  if (
    localStorage.loggedUser &&
    (window.location.pathname == "/Beginner-Authetication/login.html" ||
      window.location.pathname == "/Beginner-Authetication/index.html")
  ) {
    window.open("home.html", "_self");
  }

  //* Active Class
  const links = document.querySelectorAll("header nav ul li a");
  links.forEach((link) => {
    if (window.location.pathname == link.pathname) {
      link.classList.add("active");
    }
  });

  if (
    window.location.pathname === "/Beginner-Authetication/soon.html" &&
    JSON.parse(localStorage.loggedUser).email !== admin
  ) {
    window.open("home.html", "_self");
  }

  if (localStorage.checkedEmail) {
    checkedEmail = JSON.parse(localStorage.checkedEmail);
  }
});
