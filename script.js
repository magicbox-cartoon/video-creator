function generateVideo() {
  const photoInput = document.getElementById("photoUpload");
  const text = document.getElementById("textInput").value;
  const audioInput = document.getElementById("audioUpload");

  if (!photoInput.files[0] && !text && !audioInput.files[0]) {
    alert("Please upload a photo, text, or audio.");
    return;
  }

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  if (photoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.font = "24px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(text, 20, canvas.height - 40);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "24px Arial";
    ctx.fillText(text || "Your video text here", 20, canvas.height / 2);
  }

  alert("Preview generated. Exporting full video will be added in the next step.");
}
