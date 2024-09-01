import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://api.openuv.io/api/v1/uv?lat=51.5&lng=-0.11";

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const result = await axios.get(API_URL, {
      headers:{
        "x-access-token" : "openuv-km2rm0jn8q0x-io",
      }
    });

    
    const dateTime = result.data.result.uv_time;
    const date = new Date(dateTime);
    const time = date.toLocaleTimeString();

    res.render("index.ejs", { 
      uv : "UV INDEX: " + result.data.result.uv,
      muv : "MAX UV TODAY: "+result.data.result.uv_max,
      dt: date.toLocaleDateString() + " "+" "+ time,
    });
  } 
  catch (error) {
    res.render("index.ejs", { 
      uv : "4",
      muv: "11",
      dt: "Daily API quota exceeded !!! TRY AGAIN LATER",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
