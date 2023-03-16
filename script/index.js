//! Regular Expressions
const nameReg = /\w{3,}/; // example (amr - omar - mohamed - moustafa)
const emailReg = /\w+(.)*(\W+)?@\w+\.\w+/; // example ( dev.elbehery@gmail.com || moaaz@jr.anyTopDomainLevel )
const passwordReg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[0-9a-zA-Z]{8,20}$/; // example As4112002

//! Variables
const form = document.querySelector("form");
const username = document.querySelector("#name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirm-password");
const signupBtn = document.querySelector("#signup");
const loginBtn = document.querySelector("#login");
const links = document.querySelectorAll("header nav ul li a");
const cardsContainer = document.querySelector(".landing .cards");
const cards = document.querySelectorAll(".landing .cards .card");
const cardsImages = document.querySelectorAll(".landing .cards .card img");
const checkBtn = document.querySelector("#check-btn");
let checkedEmail = {};
let isHere = false;
const saveBtn = document.querySelector("#save-btn");
const addBtn = document.querySelector("#add-btn");
const imgUrl = document.querySelector("#img-url");
const description = document.querySelector("#description");
let posts = [];
//! Error spans
const usernameError = document.querySelector("#name-error");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const confirmError = document.querySelector("#confirm-error");
const error = document.querySelector("#error");
const loginError = document.querySelector("#login-error");
let users = [];

//! Admin Account
const admin = "admin@amit.com";
const adminPassword = "admin";
const adminName = "Admin";

//! Functions
// Will be triggered when the signup button is clicked
const signup = () => {
  let isDuplicated = false;
  if (!nameReg.test(username.value)) {
    username.focus();
    usernameError.innerHTML = "Name Field Must Contain Atleast 3 Characters";
    error.innerHTML = "";
  } else if (!emailReg.test(email.value)) {
    email.focus();
    emailError.innerHTML = "Please Enter Valid Email";
    error.innerHTML = "";
  } else if (!passwordReg.test(password.value)) {
    password.focus();
    passwordError.innerHTML =
      "Make sure it's at least between 8 to 20 characters including a number, an uppercase and lowercase letter";
    error.innerHTML = "";
  } else if (
    confirmPassword.value == "" ||
    confirmPassword.value != password.value
  ) {
    confirmPassword.focus();
    confirmError.innerHTML = "Passwords don't match";
    error.innerHTML = "";
  } else {
    usernameError.innerHTML =
      emailError.innerHTML =
      passwordError.innerHTML =
      confirmError.innerHTML =
        "";
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
  if (!emailReg.test(email.value)) {
    if (emailError) {
      emailError.innerHTML = "Please Enter Valid Email...";
      email.focus();
    }
  } else if (password.value.length == 0) {
    if (passwordError)
      passwordError.innerHTML = "Please Enter Your Password...";
    password.focus();
  } else {
    users.forEach((user) => {
      if (email.value == admin && password.value == adminPassword) {
        localStorage.setItem(
          "loggedUser",
          JSON.stringify({
            username: adminName,
            email: admin,
            password: adminPassword,
          })
        );
        setTimeout(() => {
          window.open("home.html", "_self");
        }, 1000);
      } else if (email.value == user.email && password.value == user.password) {
        localStorage.setItem("loggedUser", JSON.stringify(user));
        setTimeout(() => {
          window.open("home.html", "_self");
        }, 1000);
      } else {
        loginError.innerHTML = "Invalid Email or Password...";
      }

      if (localStorage.loggedUser) {
        loginError.innerHTML = "";
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
  if (!emailReg.test(email.value)) {
    emailError.innerHTML = "Please Enter Valid Email...";
    email.focus();
  }
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
  } else {
    emailError.innerHTML = "Wrong Email make sure it's correct";
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

    setTimeout(() => {
      localStorage.removeItem("checkedEmail");
      window.open("login.html", "_self");
    }, 1000);
  } else {
    if (!passwordReg.test(password.value)) {
      passwordError.innerHTML =
        "Make sure it's at least between 8 to 20 characters including a number, an uppercase and lowercase letter";
      password.focus();
    } else if (confirmPassword.value.length == 0) {
      confirmPassword.focus();
      confirmError.innerHTML = "Enter your password again please...";
    } else if (password.value != confirmPassword.value)
      confirmError.innerHTML = "Passwords don't match";
  }
};

// Will be triggered when the add button is clicked
const addPost = () => {
  if (imgUrl.value.length > 0 && description.value.length > 0) {
    let post = {
      imgUrl: imgUrl.value,
      description: description.value,
    };

    setTimeout(() => {
      imgUrl.value = description.value = "";
    }, 300);

    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));
  }
};

// Will be triggered when the add button is clicked or Loading the Website
const displayPosts = () => {
  posts.forEach((card) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    // Image
    const cardImgContainer = document.createElement("div");
    cardImgContainer.classList.add("card-img");
    const cardImg = document.createElement("img");
    cardImg.setAttribute("src", card.imgUrl);
    cardImgContainer.append(cardImg);
    cardDiv.append(cardImgContainer);
    // Info
    const cardInfo = document.createElement("div");
    cardInfo.classList.add("card-info");
    const cardParagraph = document.createElement("p");
    cardParagraph.innerHTML = card.description;
    cardInfo.append(cardParagraph);
    // Need to Signup or Login
    const needToDiv = document.createElement("div");
    needToDiv.classList.add("need-to-login");
    const loginAnchor = document.createElement("a");
    loginAnchor.href = "login.html";
    loginAnchor.innerHTML = "Login";
    const orParagraph = document.createElement("p");
    orParagraph.innerHTML = "Or";
    const signupAnchor = document.createElement("a");
    signupAnchor.innerHTML = "Signup";
    signupAnchor.href = "index.html";

    const login_signup_btns = document.querySelectorAll(".need-to-login a");
    login_signup_btns.forEach((btn) => {
      btn.style.cssText = "pointer-events: none";
    });

    const globalCards = document.querySelectorAll(".card");
    const globalCardsImages = document.querySelectorAll(".card img");

    globalCards.forEach((card) => {
      card.addEventListener("transitionend", () => {
        login_signup_btns.forEach((btn) => {
          btn.style.cssText = "pointer-events: all;";
        });
      });
    });

    needToDiv.append(loginAnchor);
    needToDiv.append(orParagraph);
    needToDiv.append(signupAnchor);

    if (!localStorage.loggedUser) {
      cardDiv.append(needToDiv);
      globalCardsImages.forEach((img) => {
        img.style.cssText = "filter: blur(10px); transform: none;";
      });
    } else {
      cardDiv.append(cardInfo);
    }

    // Add to Cards Container
    if (cardsContainer) cardsContainer.appendChild(cardDiv);
  });
};

const validate = (e) => {
  e = e || window.event;
  if (e.target.id == "name" && nameReg.test(username.value))
    usernameError.innerHTML = "";
  else if (e.target.id == "email" && emailReg.test(email.value))
    emailError.innerHTML = "";
  else if (e.target.id == "password" && passwordReg.test(password.value))
    passwordError.innerHTML = "";
  else if (e.target.id == "confirm-password") confirmError.innerHTML = "";
  else if (e.target.id == "password" && e.target.name == "login-password")
    passwordError.innerHTML = "";
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
if (addBtn) addBtn.addEventListener("click", addPost);

//! onload
window.addEventListener("load", () => {
  if (localStorage.users) users = JSON.parse(localStorage.users);

  //* if the user is not logged in
  if (!localStorage.loggedUser) {
    const header = document.createElement("header");
    header.innerHTML = `
    <div class="logo">
      <h1><a href="home.html">Logo</a></h1>
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
      <h1><a href="home.html">Logo</a></h1>
      </div>
    <nav>
      <ul>
      <li><a href="home.html">Home</a></li>
      <li><a class="logout" onclick="logout()">Logout</a></li>
      <li class="user">${JSON.parse(localStorage.loggedUser).username}</li>
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
      <h1><a href="home.html">Logo</a></h1>
      </div>
    <nav>
      <ul>
      <li><a href="home.html">Home</a></li>
      <li><a href="add-posts.html">Add</a></li>
      <li><a class="logout" onclick="logout()">Logout</a></li>
      <li class="user">${JSON.parse(localStorage.loggedUser).username}</li>
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
    window.location.pathname === "/Beginner-Authetication/add-posts.html" &&
    JSON.parse(localStorage.loggedUser).email !== admin
  ) {
    window.open("home.html", "_self");
  }

  if (localStorage.checkedEmail) {
    checkedEmail = JSON.parse(localStorage.checkedEmail);
  }

  if (localStorage.posts) {
    posts = JSON.parse(localStorage.posts);
  }

  if (
    window.location.pathname == "/Beginner-Authetication/reset-password.html" &&
    localStorage.getItem("checkedEmail") == null
  ) {
    window.open("check-email.html", "_self");
  }

  displayPosts();
});
