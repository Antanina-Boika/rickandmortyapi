const url = "https://rickandmortyapi.com/api/character/";
const appContainer = document.querySelector(".app_container");
const modalContainer = document.querySelector(".modal_container");
let page = 0;

//a function that will determine when it's time to send a new request.
function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 4;
  const position = scrolled + screenHeight;

  if (position >= threshold) {
    fetchCharacters(url);
  }
}

//a function that slows down scrolling processing in order to reduce the load on the browser.
function throttle(callee, timeout) {
  let timer = null;

  return function perform(...args) {
    if (timer) return;

    timer = setTimeout(() => {
      callee(...args);

      clearTimeout(timer);
      timer = null;
    }, timeout);
  };
}

(() => {
  window.addEventListener("scroll", throttle(checkPosition, 250));
  window.addEventListener("resize", throttle(checkPosition, 250));
})();

//function for requests to the server
function fetchCharacters() {
  page += 1;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.info.pages > page) {
        fetch(`${url}?page${page}`)
          .then((response) => response.json())
          .then((data) => {
            for (let i = 0; i < data.results.length; i++) {
              makeGallery(data.results[i]);
            }
          })
          .catch((error) => console.error(error));
      } else {
        return;
      }
    })
    .catch((error) => console.error(error));
}

//function of rendering information from the server
function makeGallery(info) {
  let characterContainer = document.createElement("div");
  characterContainer.classList.add("character_container");
  characterContainer.setAttribute("id", info.id);
  document.querySelector(".app_container").appendChild(characterContainer);
  let characterImg = document.createElement("img");
  characterImg.classList.add("character_img");
  characterImg.setAttribute("src", info.image);
  characterContainer.appendChild(characterImg);
  let characterName = document.createElement("p");
  characterName.classList.add("character_name_prev");
  characterName.innerHTML = info.name;
  characterContainer.appendChild(characterName);
}

fetchCharacters(url);

appContainer.addEventListener("click", function (event) {
  if (
    event.target.classList.contains("character_container") ||
    event.target.classList.contains("character_img") ||
    event.target.classList.contains("character_name_prev")
  ) {
    let id = null;
    if (event.target.classList.contains("character_container")) {
      id = event.target.getAttribute("id");
    }
    if (
      event.target.classList.contains("character_img") ||
      event.target.classList.contains("character_name_prev")
    ) {
      id = event.target.parentNode.getAttribute("id");
    }
    fetch(url + id)
      .then((response) => response.json())
      .then((data) => {
        appContainer.classList.toggle("display_none");
        modalContainer.classList.toggle("display_none");
        modalContainer.innerHTML = `
        <div class="modal_character"> 
          <div class="cl_btn"></div>       
          <img class="character_full_img"/>
          <div class="character_info">
            <div>      
              <p class="character_info_title">Name:</p>
              <p class="character_info_parag character_name"></p>  
              <p class="character_info_title">Gender:</p>
              <p class="character_info_parag character_gender"></p>
              <p class="character_info_title">Status:</p>
              <p class="character_info_parag character_status"></p></div>    
            <div>
              <p class="character_info_title">Type:</p>
              <p class="character_info_parag character_type"></p>
              <p class="character_info_title">Species:</p>
              <p class="character_info_parag character_species"></p>
              <p class="character_info_title">First appearance:</p>
              <p class="character_info_parag character_appearance"></p>                    
            </div>
          </div>        
      </div>`;
        document
          .querySelector(".character_full_img")
          .setAttribute("src", data.image);
        document.querySelector(".character_name").innerHTML = data.name;
        document.querySelector(".character_status").innerHTML = data.status;
        document.querySelector(".character_species").innerHTML = data.species;
        document.querySelector(".character_type").innerHTML = data.type;
        document.querySelector(".character_appearance").innerHTML =
          data.episode[0].split("episode/")[1];
        document.querySelector(".character_gender").innerHTML = data.gender;
        document
          .querySelector(".cl_btn")
          .addEventListener("click", function () {
            console.log("закрыто");
            appContainer.classList.toggle("display_none");
            modalContainer.classList.toggle("display_none");
          });
      })
      .catch((error) => console.error(error));
  }
});

window.onscroll = function () {
  scrollFunction();
};

//scroll animation to the top of the page
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    const btnToTop = document.createElement("button");
    btnToTop.classList.add("btn_to_top");
    btnToTop.setAttribute("title", "Go to top");
    btnToTop.innerHTML = "Top";
    document.body.append(btnToTop);
    btnToTop.addEventListener("click", topFunction);
    btnToTop.style.cssText = `display:block;`;
  } else {
    btnToTop.style.cssText = `display:none;`;
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
