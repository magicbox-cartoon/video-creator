const apiKey = "bWFnaWNib3hjYXJ0b29uQGdtYWlsLmNvbQ:2y1fFwNe6X_D-3Bk8ONUt"; // Replace this with your actual D-ID API Key

async function generateVideo() {
  const imgFile = document.getElementById("imageInput").files[0];
  const text = document.getElementById("textInput").value;
  const ratio = document.getElementById("ratioSelect").value;

  if (!imgFile || !text) {
    alert("Please upload a photo AND enter text.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64 = reader.result.split(",")[1];

    try {
      // Step 1: Create talk
      const postResp = await fetch("https://api.d-id.com/talks", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          source_url: `data:image/jpeg;base64,${base64}`,
          script: { type: "text", input: text },
          config: { output_format: "mp4", ratio }
        })
      });

      const postData = await postResp.json();

      if (!postData.id) {
        alert("Error: " + JSON.stringify(postData));
        return;
      }

      const talkId = postData.id;
      document.getElementById("output").innerHTML = `<p>Processing video... please wait ⏳</p>`;

      // Step 2: Poll for completion
      let videoUrl = "", status = "";
      const statusUrl = `https://api.d-id.com/talks/${talkId}`;

      while (status !== "done") {
        await new Promise(r => setTimeout(r, 3000));
        const getResp = await fetch(statusUrl, {
          headers: { "Authorization": `Bearer ${apiKey}` }
        });
        const getData = await getResp.json();
        status = getData.status;
        if (status === "done") {
          videoUrl = getData.result_url;
        }
      }

      // Step 3: Show video
      document.getElementById("output").innerHTML = `
        <video src="${videoUrl}" controls width="100%"></video>
        <br><a href="${videoUrl}" download="video.mp4">Download Video</a>
      `;
    } catch (error) {
      alert("Error occurred: " + error.message);
      console.error(error);
    }
  };

  reader.readAsDataURL(imgFile);
}
