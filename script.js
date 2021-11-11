const btnThame = document.querySelector(".btn-thame");
const btnIcon = document.querySelector(".btn-icon");
const containerCards = document.querySelector(".container-cards");
const wrapperCards = document.querySelector(".wrapper-cards");
const searchBar = document.querySelector(".input-kywoard-provinsi");
const menuDropdown = document.querySelector(".menu-dropdown");
const textDropdown = document.querySelector(".text-dropdown");
const modalContainer = document.querySelector(".modal-container");

btnThame.addEventListener("click", () => {
  document.body.classList.toggle("darkmode");

  if (document.body.classList.contains("darkmode")) {
    document.body.setAttribute("id", "dark");
    btnIcon.innerHTML = `<i class="fas fa-moon"></i>`;
  } else {
    document.body.setAttribute("id", "");
    btnIcon.innerHTML = `<i class="far fa-moon"></i>`;
  }
});

// array object
let arrData = [];

// filter by region
menuDropdown.addEventListener("click", function (e) {
  const data = e.target.dataset.region;
  const filterName = arrData.filter((card) => {
    return card.region.includes(data);
  });

  if (data === "All") {
    removeChildElement();
    updateUI(arrData);
    textDropdown.innerHTML = `Filter By Region`;
  }else {
    removeChildElement();
    updateUI(filterName);
    textDropdown.innerHTML = `Region : ${data}`;
  }
});

// filter by name
searchBar.addEventListener("keyup", (e) => {
  const searchString = e.target.value.toLowerCase();
  const filterName = arrData.filter((card) => {
    return card.name.toLowerCase().includes(searchString);
  });
  textDropdown.innerHTML = `Filter By Region`;
  removeChildElement();
  if (filterName.length === 0){
    containerCards.innerHTML = `<div class="container error-section d-flex justify-content-center text-center align-items-center p-5">
    <div class="boo-wrapper">
      <h1>Whoops!</h1>
      <p>
        We couldn't find the page you
        <br />
        were looking for.
      </p>
    </div>
  </div>
    `;
  }
  updateUI(filterName);
});

// request in API
const loadData = async () => {
  try {
    const res = await fetch("https://restcountries.com/v2/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.responseText);
        }
        return response.json();
      })
      .then((response) => response);
    arrData = await res;
    updateUI(arrData);
  } catch (error) {
    console.error(error);
  }
};

function removeChildElement(){
  while (containerCards.hasChildNodes()) {  
    containerCards.removeChild(containerCards.firstChild);
  }
}

const contentModal = document.querySelector(".content-modal");

function updateUI(data) {
  data.forEach((element) => {
    const country = document.createElement("div");
    country.classList.add("country", "col-md-4", "col-lg-3", "col-sm-6");
    country.innerHTML = `<div class="card m-3 card-element detail">
                                <img src="${element.flag}" class="card-img-top card-img detail">
                                <div class="card-body p-4 detail">
                                    <h4 class="card-text fw-bold mt-2 mb-4 detail">${element.name}</h4>
                                    <h6 class="fw-bold detail">Population : <span class="fw-normal detail">${element.population}</span></h6>
                                    <h6 class="fw-bold detail">Region : <span class="fw-normal detail">${element.region}</span></h6>
                                    <h6 class="fw-bold detail">Capital : <span class="fw-normal detail">${element.capital}</span></h6>
                                </div>
                            </div>`;

    // card add event listener
    country.addEventListener("click", function () {
      showDetail(element);
      setTimeout(function() {
        wrapperCards.style.display = 'none';
      }, 400);
      modalContainer.classList.add("active");
    });

    // button back in detail
    const btnBackModal = document.querySelector('.btn-back-modal');
    btnBackModal.addEventListener('click', () => {
      modalContainer.classList.remove("active");
      wrapperCards.style.display = 'inherit';
    });
    containerCards.appendChild(country);
  });
}

loadData();

function showDetail(data) {
  const languagesData = data.languages;
  let arrLanguages = [];
  languagesData.forEach(element => {
    arrLanguages.push(element.name);
  });

  const currency = data.currencies;
  let strCurrency = '';
  currency.forEach(element => {
    strCurrency += `${element.name}(${element.code}), ${element.symbol}`
  })
  contentModal.innerHTML = `<div class="container mb-5 pt-5 pb-5">
                                <div class="row p-3">
                                    <div class="col-md-5">
                                    <img src="${data.flag}" class="img-fluid" alt="">
                                    </div>
                                    <div class="col wrapper-info">
                                    <h3 class="nama-negara fw-bold">${data.name}</h3>
                                    <div class="content-detail d-flex mt-5">
                                        <div class="kiri">
                                        <p class="fw-bold">Native Name : <span class="fw-normal">${data.nativeName}</span> </p>
                                        <p class="fw-bold">Population : <span class="fw-normal">${data.population}</span> </p>
                                        <p class="fw-bold">Region : <span class="fw-normal">${data.region}</span> </p>
                                        <p class="fw-bold">Sub Region : <span class="fw-normal">${data.subregion}</span> </p>
                                        <p class="fw-bold">Capital : <span class="fw-normal">${data.capital}</span> </p>
                                        </div>
                                        <div class="kanan">
                                        <p class="fw-bold">Top Lavel Domain : <span class="fw-normal">${data.topLevelDomain.join('')}</span> </p>
                                        <p class="fw-bold">Curency : <span class="fw-normal">${strCurrency}</span> </p>
                                        <p class="fw-bold">Language : <span class="fw-normal">${arrLanguages.join(',')}</span> </p>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>`;
}


