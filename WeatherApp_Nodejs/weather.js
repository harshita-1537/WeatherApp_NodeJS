const http=require('http');
const fs = require('fs');
var requests=require("requests");


const homeFile=fs.readFileSync("home.html","utf-8");
const replaceVal=(tempVal,orgVal)=>{
    let temperature=tempVal.replace("{%tempval%}",((orgVal.main.temp)-273.15).toFixed(2));
    temperature= temperature.replace("{%tempmin%}",((orgVal.main.temp_min)-273.15).toFixed(2));
    temperature=temperature.replace("{%tempmax%}",((orgVal.main.temp_max)-273.15).toFixed(2));
    temperature=temperature.replace("{%location%}",orgVal.name);
    temperature=temperature.replace("{%country%}",orgVal.sys.country);
    temperature=temperature.replace("{%tempStatus%}",orgVal.weather[0].main);
    return temperature;

}
const server=http.createServer((req,res)=>{
    if(req.url="/")
    {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Safidon&appid=fd737a352b52fd49cd450a52db25330e")
        .on("data", (chunk) =>{
            const objdata=JSON.parse(chunk);
            const arrData=[objdata];
       // console.log(arrData[0].main.temp);
       const realTimeData=arrData.map((val)=>
        //    console.log(val.main);
           replaceVal(homeFile,val)).join("");
           res.write(realTimeData);
        console.log(realTimeData);
    })
       .on("end",(err) =>{
        if (err) return console.log("connection closed due to errors", err);
          res.end();
          console.log("end");
    });

    }
})
server.listen(8000);