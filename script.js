const apiKey = "bWFnaWNib3hjYXJ0b29uQGdtYWlsLmNvbQ:2y1fFwNe6X_D-3Bk8ONUt"; // Replace with your actual D-ID API key

async function generateVideo() {
  const imageFile = document.getElementById("imageInput").files[0];
  const text = document.getElementById("textInput").value;
  const aspectRatio = document.getElementById("ratioSelect").value;

  if (!imageFile || !text) {
    alert("Please upload an image and enter text.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async function () {
    const base64Image = reader.result.split(",")[1];

    const response = await fetch("https://api.d-id.com/talks", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        source_url: `data:image/jpeg;base64,${base64Image}`,
        script: {
          type: "text",
          input: text,
        },
        config: {
          output_format: "mp4",
          ratio: aspectRatio,
        }
      })
    });

    const data = await response.json();
    if (data.id) {
      const videoUrl = `https://api.d-id.com/talks/${data.id}`;
      document.getElementById("output").innerHTML = `<p>Video is being processed...<br>Check here soon:</p><a href="${videoUrl}" target="_blank">${videoUrl}</a>`;
    } else {
      alert("Failed to generate video. Check API key or input.");
    }
  };

  reader.readAsDataURL(imageFile);
}
