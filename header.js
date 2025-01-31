const header = document.getElementById("header");

const sponsor = window.data.sponsor;
const models = window.data.models;

const headerContent = document.createElement("div");
headerContent.classList.add(
  "flex",
  "items-center",
  "justify-between",
  "h-12",
  "px-4",
  "bg-white",
);

if (sponsor && sponsor.is_authenticated) {
  const balance = ((sponsor.clv || 0) - (sponsor.spent || 0)) / 100;

  const avatar = document.createElement("img");
  avatar.src = sponsor.avatar_url;
  avatar.alt = sponsor.owner_login;
  avatar.classList.add("w-8", "h-8", "rounded-full", "mr-2");

  const userInfo = document.createElement("div");
  userInfo.classList.add("flex", "items-center", "mr-4");
  userInfo.appendChild(avatar);
  userInfo.innerHTML += sponsor.owner_login;

  const balanceButton = document.createElement("a");
  balanceButton.href = "https://dashboard.uithub.com/usage";
  balanceButton.classList.add(
    "px-3",
    "py-1",
    "rounded",
    "bg-gradient-to-r",
    "from-purple-500",
    "to-pink-500",
    "text-white",
    "mr-2",
  );
  balanceButton.textContent = `$${balance.toFixed(2)}`;

  const addBalanceButton = document.createElement("a");
  addBalanceButton.href = "https://github.com/sponsors/janwilmake";
  addBalanceButton.classList.add(
    "px-3",
    "py-1",
    "rounded",
    "bg-gradient-to-r",
    "from-purple-500",
    "to-pink-500",
    "text-white",
    "mr-2",
  );
  addBalanceButton.textContent = "Add Balance";

  const logoutButton = document.createElement("a");
  logoutButton.href = "/logout";
  logoutButton.classList.add(
    "px-3",
    "py-1",
    "rounded",
    "bg-gradient-to-r",
    "from-purple-500",
    "to-pink-500",
    "text-white",
  );
  logoutButton.textContent = "Logout";

  headerContent.appendChild(userInfo);
  headerContent.appendChild(balanceButton);
  headerContent.appendChild(addBalanceButton);
  headerContent.appendChild(logoutButton);
} else {
  const loginButton = document.createElement("a");
  loginButton.href = "/login";
  loginButton.classList.add(
    "px-3",
    "py-1",
    "rounded",
    "bg-gradient-to-r",
    "from-purple-500",
    "to-pink-500",
    "text-white",
  );
  loginButton.textContent = "Login";

  headerContent.appendChild(loginButton);
}

const modelSelect = document.createElement("select");
modelSelect.classList.add(
  "px-3",
  "py-1",
  "rounded",
  "border",
  "border-gray-300",
  "mr-4",
);
models.forEach((model) => {
  const option = document.createElement("option");
  option.value = model;
  option.textContent = model;
  modelSelect.appendChild(option);
});
modelSelect.value = localStorage.getItem("model") || models[0];
modelSelect.addEventListener("change", () => {
  localStorage.setItem("model", modelSelect.value);
});

const githubLink = document.createElement("a");
githubLink.href = "https://github.com/janwilmake/uithub.chat";
githubLink.classList.add("text-gray-500", "hover:text-gray-700");
githubLink.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
`;

headerContent.appendChild(modelSelect);
headerContent.appendChild(githubLink);

header.appendChild(headerContent);
