let input = document.querySelector("#input");
let btn = document.querySelector("#search");
let notFound = document.querySelector(".notFound");
let defBox = document.querySelector(".def");
let audioBox = document.querySelector(".audio");
let loading = document.querySelector(".loading");

const api = "";
/* PASTE YOUR DICTIONARY API KEY HERE */

btn.addEventListener("click", function (e) {
  e.preventDefault();

  loading.style.display = "block";

  // clear data
  notFound.innerHTML = "";
  defBox.innerHTML = "";
  audioBox.innerHTML = "";

  // get the word
  let word = input.value;

  if (word === "") {
    loading.style.display = "none";
    alert("Please provide a word");
    return;
  }

  getData(word);
});

async function getData(word) {
  // AJAX CALL
  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${api}`
  );

  const data = await response.json();

  // if result is empty
  if (!data.length) {
    loading.style.display = "none";
    notFound.innerHTML = "No result found";
    return;
  }

  // if result is sugestions
  if (typeof data[0] == "string") {
    loading.style.display = "none";

    let heading = document.createElement("h3");
    heading.innerHTML = "Did you mean?";
    notFound.appendChild(heading);

    data.forEach((element) => {
      let suggestion = document.createElement("span");
      suggestion.classList.add("suggested");
      suggestion.innerText = element;
      notFound.appendChild(suggestion);
    });

    return;
  }

  // result found
  loading.style.display = "none";
  let defination = data[0].shortdef[0];
  defBox.innerHTML = defination;

  // Sound
  const soundName = data[0].hwi.prs[0].sound.audio;
  if (soundName) {
    renderSound(soundName);
  }
}

function renderSound(soundName) {
  let subfolder = soundName.charAt(0);
  let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${api}`;

  let aud = document.createElement("audio");
  aud.src = soundSrc;
  aud.controls = true;
  audioBox.appendChild(aud);
}
