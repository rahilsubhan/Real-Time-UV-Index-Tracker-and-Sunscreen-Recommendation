import express from "express";
import axios from "axios";
import https from "https";

const app = express();
const port = 3000;
const numbers = new Array(2); 
var Longitude=0;
var Latitude=0;
const options = {
  hostname: 'ipinfo.io',
  path: '/json',
}; 

app.use(express.static("public"));

app.get("/", async (req, res) => {
  async function fetchDataAndProcess() {
    return new Promise((resolve, reject) => {
      https.get(options, (res) => {
        let dataChunks = [];
        res.on('data', (chunk) => {
        dataChunks.push(chunk);
        });

        res.on('end', () => {
          const data = Buffer.concat(dataChunks).toString();
          const locationData = JSON.parse(data);
          Latitude = locationData.loc.split(',')[1];
          Longitude = locationData.loc.split(',')[0];   
          resolve("TRUE");
        });

        res.on('error', (error) => {
          reject(error);
        });

      });
    });
  }

  try {
    await fetchDataAndProcess();
  } catch (error) {
    console.error('Error:', error);
  }

  const API_URL = `https://api.openuv.io/api/v1/uv?lat=${Longitude}&lng=${Latitude}`;
  try {
    const result = await axios.get(API_URL, {
      headers:{
        "x-access-token" : "openuv-km2rm0jeisla-io",
      }
    });
    const dateTime = result.data.result.uv_time;
    const date = new Date(dateTime);
    const time = date.toLocaleTimeString();
    var av = "";
    if(result.data.result.uv > 3){
      av = "SUNSCREEN IS HIGHLY RECOMMENDED";
    }else{
      av = "SUNSCREEN IS'NT NECESSARY";
    }
    res.render("index.ejs", { 
      uv : "UV INDEX: " + result.data.result.uv,
      muv : "MAX UV TODAY: "+result.data.result.uv_max,
      a : av,
      dt: date.toLocaleDateString() + " "+" "+ time +" IST",
    });
  } 
  catch (error) {
    res.render("index.ejs", { 
      uv : "NA",
      muv: "NA",
      a : "NA",
      dt: "API quota exceeded !!! TRY AGAIN LATER",
    });
  }

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
