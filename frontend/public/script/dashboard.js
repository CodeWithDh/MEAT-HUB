document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const content = document.querySelector(".content");
  
    menuToggle.addEventListener("click", function () {
      if (sidebar.classList.contains("left-[-100%]")) {
        sidebar.classList.replace("left-[-100%]", "left-0");
        content.classList.replace("ml-0", "ml-64");
      } else {
        sidebar.classList.replace("left-0", "left-[-100%]");
        content.classList.replace("ml-64", "ml-0");
      }
    });
  });
  