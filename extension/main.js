document.addEventListener("DOMContentLoaded", function () {
  getCurrTabUrl();
  manageButtonSelection();
  generateBtnClickEvent();
  document
    .getElementById("dropdown")
    .addEventListener("click", toggleAdvancedOptions);
});

// Function to create and get data
function getData(url, type, summaryLength, prompt, temperature) {
  var baseurl = "http://127.0.0.1:5000/api";
  var data = { url: url, type: type , summaryLength: summaryLength, prompt: prompt, temperature: temperature};

  return fetch(baseurl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// Function to create new div and append it for summary and major points
function appendData(data, type) {
  var newDiv = document.createElement("div");

  if (type == "summary") {
    newDiv.innerHTML = data.summary;
  } else {
    newDiv.innerHTML = data.points;
  }

  document.getElementById("content").appendChild(newDiv);
}

// Main function
function postApi(url, type, summaryLength = "short",temperature = 0.75) {
  console.log("hyfhdrgherigikerfgdj",prompt)
  getData(url, type, summaryLength, prompt, temperature)
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      
      // Clear the content before appending new data
      document.getElementById("content").innerHTML = "";
      if(type == "summary"){
        appendData(data, type);
      }
      else{
        var points = data.points;
        var points_string = "";
        for(var i=0; i<points.length; i++){
          points_string += points[i] + "<br>";
        }
        document.getElementById("content").innerHTML = points_string;
      }
      // appendCost(data);
      // appendType(type);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(error);
    });
}

function manageButtonSelection() {
  var unselectedButtons = Array.from(
    document.getElementsByClassName("unselected")
  );
  var selectedButtons = Array.from(document.getElementsByClassName("selected"));
  var buttons = unselectedButtons.concat(selectedButtons);
  var advanceOptionsSummary = document.getElementById(
    "advance-options-summary"
  );
  var advanceOptionsPoints = document.getElementById("advance-options-points");

  function removeSelectedFromAllButtons() {
    buttons.forEach(function (button) {
      if (button.classList.contains("selected")) {
        deselectButton(button);
      }
    });
  }

  function selectButton(button) {
    button.classList.remove("unselected");
    button.classList.add("selected");
  }

  function deselectButton(button) {
    button.classList.remove("selected");
    button.classList.add("unselected");
  }

  // Select the 'getSummary' button by default
  selectButton(document.getElementById("getSummary"));
  advanceOptionsSummary.style.display = "block";
  advanceOptionsPoints.style.display = "none";

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (this.classList.contains("selected")) {
        deselectButton(this);
        if (this.id == "getSummary") {
          advanceOptionsSummary.style.display = "none";
          advanceOptionsPoints.style.display = "block";
        } else {
          advanceOptionsSummary.style.display = "block";
          advanceOptionsPoints.style.display = "none";
        }
      } else {
        removeSelectedFromAllButtons();
        selectButton(this);
        if (this.id == "getSummary") {
          advanceOptionsSummary.style.display = "block";
          advanceOptionsPoints.style.display = "none";
        } else {
          advanceOptionsSummary.style.display = "none";
          advanceOptionsPoints.style.display = "block";
        }
      }
    });
  });
}

function generateBtnClickEvent() {
  document.getElementById("generate").addEventListener("click", function () {
    var url = document.getElementById("url").value;
    var type = document
      .getElementById("getSummary")
      .classList.contains("selected")
      ? "summary"
      : "points";
      // summaryLengthDropdown
    var initialValue = document.getElementsByName("Short summary");
    var summaryLength
    for (i = 0; i < initialValue.length; i++) {
      if (initialValue[i].checked)
      summaryLength= initialValue[i].value;
  }
    var prompt = document.getElementById("promptDropdown").value;
    var temperature = document.getElementById("temperature").value;
    postApi(url, type, summaryLength, prompt, temperature);
  });
}

function disableButton(id) {
  document.getElementById(id).disabled = true;
}
function enableButton(id) {
  document.getElementById(id).disabled = false;
}

function toggleAdvancedOptions() {
  var advancedOptions = document.querySelector(".advance-options");
  var dropdownButton = document.getElementById("dropdown");

  if (advancedOptions.style.display === "none") {
    advancedOptions.style.display = "block";
    dropdownButton.innerHTML = "Advanced Options &#9650;"; 
  } else {
    advancedOptions.style.display = "none";
    dropdownButton.innerHTML = "Advanced Options &#9660;";
  }
}

function getCurrTabUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    document.getElementById("url").value = tabs[0].url;
  });
}

// dynamic temperature on change slider
document.getElementById("temperature").addEventListener("change", function () {
  document.getElementById("temperatureValue").innerHTML = document.getElementById("temperature").value;
});