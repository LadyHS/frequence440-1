import data from "./dataPresta.js";
let checkFrEn = document.querySelector(".hero-title").innerHTML;

function changeChevrons() {
  let icons = document.querySelectorAll(".fas");
  let windowWidth = window.innerWidth;
  let chevronType;
  windowWidth >= "850" ? (chevronType = "right") : (chevronType = "down");
  icons.forEach((icon) => {
    if (icon.classList.contains("fa-chevron-right"))
      icon.classList.remove("fa-chevron-right");
    if (icon.classList.contains("fa-chevron-down"))
      icon.classList.remove("fa-chevron-down");
    icon.classList.add(`fa-chevron-${chevronType}`);
  });
}

function displayData() {
  let buttons = document.querySelectorAll(".presta-item");
  let finalLocation = cleanLocation();
  if (finalLocation === "details") {
    document.querySelectorAll(".presta-item").forEach((button) => {
      button.classList.contains("selected-item") &&
        button.classList.remove("selected-item");
    });
    let firstButton = document.querySelector(".presta-item");
    firstButton.classList.add("selected-item");
    let selectedCategory = data.filter(
      (setOfData) => setOfData.category === firstButton.dataset.cat
    );
    let finalData = selectedCategory[0].options;
    let additionalData = selectedCategory[0].addOn
      ? selectedCategory[0].addOn
      : null;

    createGridFromData(finalData, additionalData);
  }
  buttons.forEach((button) => {
    if (button.dataset.cat === finalLocation) {
      document.querySelectorAll(".presta-item").forEach((button) => {
        button.classList.contains("selected-item") &&
          button.classList.remove("selected-item");
      });
      button.classList.add("selected-item");

      let selectedCategory = data.filter(
        (setOfData) => setOfData.category === button.dataset.cat
      );
      let finalData = selectedCategory[0].options;
      let additionalData = selectedCategory[0].addOn
        ? selectedCategory[0].addOn
        : null;

      createGridFromData(finalData, additionalData);
    }
  });
}

function cleanLocation() {
  let cutHash = window.location.hash.split("#")[1];
  let finalLocation = cutHash;
   if (finalLocation === undefined && checkFrEn === "Prestations")
    finalLocation = "conférences";
  if (finalLocation === undefined && checkFrEn === "Services")
    finalLocation = "conferences";
  if (finalLocation === "conf%C3%A9rences") finalLocation = "conférences";
  return finalLocation;
}

function createGridFromData(data, additionalData) {
  let resultDiv = document.getElementById("cards");
  resultDiv.innerHTML = "";
  data.forEach((oneArticle, index) => {
    createOneCard(oneArticle, index, resultDiv);
  });
  if (window.innerWidth < 500) {
    addAdditionalButton(resultDiv);
  }
  addAdditionalText(additionalData);
}

function createOneCard(oneArticle, index, resultDiv) {
  let newArticle = document.createElement("div");
  newArticle.classList.add("card");
  newArticle.classList.add("flex-col");
  newArticle.classList.add("space-b");
  let duration = oneArticle.duration;
  if (!duration) duration = "";
  newArticle.innerHTML = `
  <div>
    <div class="detailed-info flex space-b">
      <p class="index">0${index + 1}</p>
      <p class="duration">${duration}</p>
    </div>
    <h3>${oneArticle.title}</h3>
    <p class="content">${oneArticle.content}</p>
  </div>
  `;
  if (oneArticle.title === "Ateliers solutions") {
    let additionalText = `<p class="content"> Pour plus de détails sur les sujets possibles, voir <a href="/transition#graph" target='blank' style="text-decoration: underline;">ici</a> </p>`;
    newArticle.innerHTML += additionalText;
  }
  let link =
    oneArticle.callToAction === "prendre rdv" ||
    oneArticle.callToAction === "let's meet"
      ? "https://calendly.com/frequence440"
      : "";
  newArticle.innerHTML += `<div class="semi-underlined">
  <a href="${link}" target="_blank">${oneArticle.callToAction}</a>
  </div>`;
  if (
    oneArticle.callToAction === "demander un devis" ||
    oneArticle.callToAction === "ask for invoice"
  ) {
    newArticle.querySelector(".semi-underlined a").onclick = () => {
      if (window.innerWidth > 750) {
        displayInvoice(oneArticle.title);
      } else {
        window.location = "/contact#invoice-form";
      }
    };
  }
  resultDiv.append(newArticle);
}

function addAdditionalButton(resultDiv) {
  let navigationDiv = document.createElement("a");
  navigationDiv.className = "button black-button flex";
  navigationDiv.setAttribute("href", "#details");
  navigationDiv.innerHTML =
    checkFrEn === "Prestations"
      ? '<i class="fa fa-chevron-up" aria-hidden="true"></i><p>autres prestations</p>'
      : '<i class="fa fa-chevron-up" aria-hidden="true"></i><p>Back to services</p>';
  resultDiv.append(navigationDiv);
}

function addAdditionalText(additionalData) {
  let additionalContainer = document.querySelector(".additional-container");
  additionalContainer.innerHTML = "";
  additionalContainer.style.display = "none";
  if (additionalData) {
    additionalContainer.style.display = "block";
    let additionalInfo = document.createElement("div");
    additionalInfo.innerHTML = `
    <h3>${additionalData.title}</h3>
    <p class="content">${additionalData.content}</p>
    `;
    additionalContainer.append(additionalInfo);
  }
}

function displayInvoice(requestedService) {
  event.preventDefault();
  let invoiceContainer = document.createElement("div");
  if (checkFrEn === "Prestations") {
    invoiceContainer.innerHTML = `
    <div id="invoice" class="form">
      <div class="flex space-b">
        <h2>FORMULAIRE DE DEVIS</h2>
        <img src="/images/menu-close.svg" id="close-invoice"></img>
      </div>
      <div class="bordered flex-col flex-center">
        <p>Si vous voulez discuter avant, prenez RDV:</p>
        <a href="https://calendly.com/frequence440" class="button black-button" target="_blank">Voir le calendrier</a>
      </div>
      <div class="flex-col">
        <input type="hidden" id="requested-service" name="requestedService" value="${requestedService}">
        <div class="form-group flex-col">
          <label for="client-name">Nom<span class="mandatory">*</span></label>
          <input type="text" name="name" id="client-name" required />
        </div>
        <div class="form-group flex-col">
          <label for="client-email">Email de contact<span class="mandatory">*</span></label>
          <input type="text" name="email" id="client-email" required />
        </div>
        <div class="form-group flex-col">
          <label for="client-number">Numéro de téléphone</label>
          <input type="text" name="number" id="client-number" />
        </div>
        <div class="form-group flex-col">
          <label for="client-type">Nom de l'Entreprise ou Ecole du supérieur<span class="mandatory">*</span></label>
          <input type="text" name="type" id="client-type" required/>
        </div>
        <div class="form-group flex-col">
          <label for="client-quantity"
            >Nombre de personnes<span class="mandatory">*</span></label
          >
          <select name="quantity" id="client-quantity" required>
            <option value=""></option>
            <option value="1-5">1 - 5</option>
            <option value="6-10">6 - 10</option>
            <option value="11-20">11 - 20</option>
            <option value="+20">+20</option>
          </select>
        </div>
        <div class="form-group flex-col">
          <label for="client-message"
            >Message (merci de préciser les équipes qui seront concernées, les
            contraintes de temps / espace / matériel, etc.)</label
          >
          <textarea
            name="message"
            id="client-message"
            cols="30"
            rows="3"
          ></textarea>
        </div>
        <div class="flex align-c">
          <button id="send-invoice" class="button black-button" type="submit">Envoyer</button>
          <div id="additional-message"></div>
        </div>
      </div>
    </div>`;
  } else {
    invoiceContainer.innerHTML = `
    <div id="invoice" class="form">
      <div class="flex space-b">
        <h2>QUOTE REQUEST FORM</h2>
        <img src="/images/menu-close.svg" id="close-invoice"></img>
      </div>
      <div class="bordered flex-col flex-center">
        <p>If you have any questions before completing this form, we can meet on the phone:</p>
        <a href="https://calendly.com/frequence440" class="button black-button" target="_blank">Let's meet</a>
      </div>
      <div class="flex-col">
        <input type="hidden" id="requested-service" name="requestedService" value="${requestedService}">
        <div class="form-group flex-col">
          <label for="client-name">Name<span class="mandatory">*</span></label>
          <input type="text" name="name" id="client-name" required />
        </div>
        <div class="form-group flex-col">
          <label for="client-email">Email address<span class="mandatory">*</span></label>
          <input type="text" name="email" id="client-email" required />
        </div>
        <div class="form-group flex-col">
          <label for="client-number">Phone number</label>
          <input type="text" name="number" id="client-number" />
        </div>
        <div class="form-group flex-col">
          <label for="client-type">Name of the Company or Higher Education Organization*<span class="mandatory">*</span></label>
          <input type="text" name="type" id="client-type" required/>
        </div>
        <div class="form-group flex-col">
          <label for="client-quantity"
            >Number of participants<span class="mandatory">*</span></label
          >
          <select name="quantity" id="client-quantity" required>
            <option value=""></option>
            <option value="1-5">1 - 5</option>
            <option value="6-10">6 - 10</option>
            <option value="11-20">11 - 20</option>
            <option value="+20">+20</option>
          </select>
        </div>
        <div class="form-group flex-col">
          <label for="client-message"
            >Message (please mention your needs, field of interest, which teams will be involved, your time or space constraints, schedule, budget, etc.) </label
          >
          <textarea
            name="message"
            id="client-message"
            cols="30"
            rows="3"
          ></textarea>
        </div>
        <div class="flex align-c">
          <button id="send-invoice" class="button black-button" type="submit">Send</button>
          <div id="additional-message"></div>
        </div>
      </div>
    </div>`;
  }

  invoiceContainer.className = "invoice-container";
  invoiceContainer.style.minHeight = "100vh";
  document.querySelector("body").append(invoiceContainer);
  invoiceContainer.querySelector("#close-invoice").onclick = removeInvoice;
  invoiceContainer.querySelector("#send-invoice").onclick = sendInvoice;
}

function removeInvoice() {
  document.querySelector(".invoice-container").remove();
}

function sendInvoice() {
  let invoiceToSend = {
    requestedService: document.querySelector('input[name="requestedService"]')
      .value,
    email: document.querySelector('input[name="email"]').value,
    name: document.querySelector('input[name="name"]').value,
    type: document.querySelector('input[name="type"]').value,
    number: document.querySelector('input[name="number"]').value,
    quantity: document.querySelector('select[name="quantity"]').value,
    message: document.querySelector('textarea[name="message"]').value,
  };

  let additionalMessage = document.querySelector("#additional-message");
  if (
    invoiceToSend.email === "" ||
    invoiceToSend.name === "" ||
    invoiceToSend.type === "" ||
    invoiceToSend.number === ""
  ) {
    additionalMessage.innerHTML =
      checkFrEn === "Prestations"
        ? "<p>Veuillez renseigner tous les champs obligatoires</p>"
        : "Please enter every mandatory field";
    return;
  }
  axios
    .post("/send-invoice", invoiceToSend)
    .then((success) => {
      additionalMessage.innerHTML =
        checkFrEn === "Prestations"
          ? `<p>${success.data.fr}</p>`
          : `<p>${success.data.en}</p>`;
    })
    .catch((error) => {
      console.log(error);
    });
}

let previousHeight = document.getElementById("details").getBoundingClientRect()
  .height;

let newPage = true;

function scrollToGrid() {
  const y =
    document.getElementById("details").getBoundingClientRect().top +
    window.scrollY -
    document.getElementById("navbar-sticky").getBoundingClientRect().height;

  let difference =
    document.getElementById("details").getBoundingClientRect().height -
    previousHeight;

  previousHeight = document.getElementById("details").getBoundingClientRect()
    .height;

  if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1 && !newPage) {
    window.scrollTo({
      top: y - difference,
      left: 0,
      behavior: "smooth",
    });
  } else {
    window.scrollTo({
      top: y,
      left: 0,
      behavior: "smooth",
    });
  }

  newPage = false;
}

function getGridData() {
  let nbrCards = document.getElementsByClassName("card").length;
  // calc computed style
  let gridComputedStyle = window.getComputedStyle(
    document.getElementById("cards")
  );
  let gridColumnCount = gridComputedStyle
    .getPropertyValue("grid-template-columns")
    .split(" ").length;

  let lastCard = document.getElementsByClassName("card")[nbrCards - 1];

  if (nbrCards % gridColumnCount === 1) {
    lastCard.classList.add("expand");
  } else {
    lastCard.classList.remove("expand");
  }
}

function createContainingDivs() {
  // cards grid
  let resultDiv = document.createElement("div");
  resultDiv.setAttribute("id", "cards");
  // additional data container
  let additionalDiv = document.createElement("div");
  additionalDiv.setAttribute("class", "additional-container");

  let siblingDivCards = document.querySelector(".presta-list").parentNode;
  siblingDivCards.parentNode.insertBefore(
    resultDiv,
    siblingDivCards.nextSibling
  );

  let siblingDivAdditional = document.querySelector(".presta-list");
  siblingDivAdditional.parentNode.insertBefore(
    additionalDiv,
    siblingDivAdditional.nextSibling
  );
}

// call the functions the first time to display data on screen
createContainingDivs();
displayData();
getGridData();

if (window.location.hash != "") scrollToGrid();

// listen for selected list item (on the left side of the screen)
document.querySelectorAll(".presta-item").forEach((button) => {
  button.onclick = () => {
    window.history.pushState(
      `${button.dataset.cat}`,
      `${button.dataset.cat}`,
      `#${button.dataset.cat}`
    );
    displayData();
    getGridData();
  };
});

// listen for clickable link (on the bottom of the screen)
let footerLinks = document.querySelectorAll(".sub-link");
footerLinks.forEach((link) => {
  link.onclick = () => {
    window.history.pushState(
      `${link.dataset.cat}`,
      `${link.dataset.cat}`,
      `#${link.dataset.cat}`
    );
    displayData();
    getGridData();
    scrollToGrid();
  };
});

// listen for changes in display
window.addEventListener("DOMContentLoaded", () => {
  changeChevrons();
  getGridData();
});
window.addEventListener("resize", () => {
  changeChevrons();
  getGridData();
});

document.onkeydown = function (evt) {
  evt = evt || window.event;
  if (evt.keyCode == 27 && document.querySelector("#invoice")) removeInvoice();
};
