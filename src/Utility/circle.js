document.addEventListener("mousemove", function (e) {
  document.querySelector(".circle").style.left = e.offsetX + "px";
  document.querySelector(".circle").style.top = e.offsetY + "px";
  document.querySelector(".circle").style.right = undefined;
});

document.querySelectorAll(".circle").forEach((item) => {
  item.addEventListener("mouseover", function (e) {
    var key = e.target.dataset.key;
    e.target.style.left = e.offsetX + "px";
    e.target.style.top = e.offsetY + "px";
    e.target.style.right = undefined;
  });
});
