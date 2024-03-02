import express from 'express';
import axios from 'axios';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use(express.static(join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("index")
});

app.post("/current-location", async(req, res) => {//this is the api code//
    try {
        const apiKey = "";//go to https://openweathermap.org/api log in for free and get the apiKey than paste it here //
const {cityName}=req.body;
        const geoMap = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},&limit=1&appid=${apiKey}` );//this take the city name and convert it into coordinates//

        const {lat, lon} = geoMap.data[0];//this store the city name result and convert into coordinates data//
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);//this calls the api to check the weather condition //
          
       const {main,description}=result.data.weather[0];//this take this value from all the api data check api documentation to understand better//
       const {temp}= result.data.main;//this take temperature from the all api data  //
      
       let temperatureInCelsius = temp - 273.15;//converts kelvin into celsius//
       temperatureInCelsius=Math.floor(temperatureInCelsius);//this make  the temperature more readable//
        res.render('index', {//this display all the data i want to display from the api data//
           weatherMain:main,
           weatherDescription:description,
    temperature: temperatureInCelsius,
city:cityName,

        });
     
    } catch (error) {//catch all the errors in case something goes wrong //
        console.log('error fetching weather data', error)
        res
            .status(500)
            .send(error.message)
    }
})

app.listen(port, (req, res) => {
    console.log(`app listening on port ${port}`);
})