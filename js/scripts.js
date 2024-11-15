document.addEventListener("DOMContentLoaded", async () => {
  // About section
  const aboutMeElement = document.getElementById("aboutMe");
  try {
    const response = await fetch('./data/aboutMeData.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const headshot = data.headshot.replace('../', './');
    aboutMeElement.innerHTML = `
    <p>${data.aboutMe}</p>
    <div class="headshotContainer">
      <img src="${headshot}" />
    </div>`;
  } catch (error) {
    console.error("Error fetching aboutMeData.json:", error);
    aboutMeElement.textContent = "Could not load the 'About Me' section.";
  }

  // Projects section
  const projectListElement = document.getElementById("projectList");
  const projectSpotlightElement = document.getElementById("projectSpotlight");

  try {
    const response = await fetch('./data/projectsData.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Function to update the spotlight
    const updateSpotlight = (project) => {
      let spotlightImg = "";
      if (project.spotlight_image) {
        spotlightImg = `
        <div class="spotlightImage">
          <img src="${project.spotlight_image.replace('../', './')}" />
        </div>`;
      }
      projectSpotlightElement.innerHTML = `
      <h3 id="spotlightTitles">${project.project_name}</h3>
      ${spotlightImg}
      <p>${project.long_description}</p>
      <a href="${project.url}">Click here to see more...</a>`;
    };

    const projects = await response.json();

    projects.forEach((project) => {
      const projectCardElement = document.createElement("div");
      projectCardElement.className = "projectCard";
      projectCardElement.id = project.project_id;
      projectCardElement.innerHTML = `
          <h4>${project.project_name}</h4>
          <p>${[project.short_description]}<p>`;
      if (project.card_image) {
        projectCardElement.style.backgroundImage =
        `url(${project.card_image.replace('../', './')})`;
      }

      projectCardElement.addEventListener("click", () => updateSpotlight(project));
      projectListElement.appendChild(projectCardElement);
    });

    updateSpotlight(projects[0])

    // ---- Scrolling functionality ----
    const arrowLeft = document.querySelector(".arrow-left");
    const arrowRight = document.querySelector(".arrow-right");
    let scrollDirection = "horizontal"; // Default for mobile

    const calculateScrollSize = () => {
      if (scrollDirection === "horizontal") {
        return projectList.offsetWidth - 40; // Scroll one full "page" horizontally
      } else {
        const projectCardHeight = projectList.offsetHeight - 40;
        return projectCardHeight || 100; // Default to 100px if no card exists
      }
    };

    // Should be the same with the @media threshold in styles.css.
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const updateScrollDirection = (e) => {
      scrollDirection = e.matches ? "horizontal" : "vertical";
    };

    updateScrollDirection(mobileQuery);
    mobileQuery.addEventListener("change", updateScrollDirection);

    const scrollProjectList = (direction) => {
      const scrollAmount = calculateScrollSize();
      if (scrollDirection === "horizontal") {
        // Scroll horizontally
        projectList.scrollBy({
          left: direction === "left" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      } else {
        // Scroll vertically
        projectList.scrollBy({
          top: direction === "up" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    };

    // Attach event listeners for arrows
    arrowLeft.addEventListener("click", () => {
      scrollProjectList(scrollDirection === "horizontal" ? "left" : "up");
    });

    arrowRight.addEventListener("click", () => {
      scrollProjectList(scrollDirection === "horizontal" ? "right" : "down");
    });

  } catch (error) {
    console.error("Error fetching projectsData.json:", error);
    aboutMeElement.textContent = "Could not load the 'Projects' section.";
  }


  // Contact section
  const form = document.getElementById("formSection");
  const emailInput = document.getElementById("contactEmail");
  const messageInput = document.getElementById("contactMessage");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const charactersLeft = document.getElementById("charactersLeft");

  const maxMessageLength = 300;
  const illegalCharsRegex = /[^a-zA-Z0-9@._-]/;
  const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Live character count for the message input
  messageInput.addEventListener("input", () => {
    const currentLength = messageInput.value.length;
    charactersLeft.textContent = `Characters: ${currentLength}/${maxMessageLength}`;
    if (currentLength > maxMessageLength) {
      charactersLeft.style.color = "red";
    } else {
      charactersLeft.style.color = "black";
    }
  });

  // Form validation
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the form from being submitted

    // Reset error messages
    emailError.textContent = "";
    messageError.textContent = "";

    let isValid = true;

    // Email validation
    const emailValue = emailInput.value.trim();
    if (!emailValue) {
      emailError.textContent = "Email is required.";
      isValid = false;
    } else if (!validEmailRegex.test(emailValue)) {
      emailError.textContent = "Invalid email format.";
      isValid = false;
    } else if (illegalCharsRegex.test(emailValue)) {
      emailError.textContent = "Email contains illegal characters.";
      isValid = false;
    }

    // Message validation
    const messageValue = messageInput.value.trim();
    if (!messageValue) {
      messageError.textContent = "Message is required.";
      isValid = false;
    } else if (illegalCharsRegex.test(messageValue)) {
      messageError.textContent = "Message contains illegal characters.";
      isValid = false;
    } else if (messageValue.length > maxMessageLength) {
      messageError.textContent = `Message exceeds the maximum length of ${maxMessageLength} characters.`;
      isValid = false;
    }

    // If all validations pass, display a success alert
    if (isValid) {
      console.log("valid");
      showModal("Form validation passed! Your message has been accepted.");
    }
  });


  // Modal elements
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modalMessage");
  const closeModal = document.getElementById("closeModal");
  
  // Function to show the modal
  function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = "block";
  }

  // Close modal when the close button is clicked
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal when clicking outside the modal content
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

});