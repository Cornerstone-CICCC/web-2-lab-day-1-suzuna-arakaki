const inputSearch = document.getElementById('input-search')
const btnSearch = document.getElementById('btn-search')
const sectionTemp = document.getElementById('section-temp')
const nameOfCity = document.getElementById('name-of-city')
const temp = document.getElementById('temp')
const countryTd = document.getElementById('country-td')
const timezoneTd = document.getElementById('timezone-td')
const populationTd = document.getElementById('population-td')
const tmrForecastTdLow = document.getElementById('tmr-forecast-td-low')
const tmrForecastTdMax = document.getElementById('tmr-forecast-td-max')


btnSearch.addEventListener("click", function(e) {
  e.preventDefault();
  const inputValue = inputSearch.value;

  async function getCityLocation() {
    try {
      const resCity = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${inputValue}&count=1&language=en&format=json`)
      const cityData = await resCity.json()
      return cityData
    } catch(err) {
      console.error(err)
    }
  }

  async function getCityWeather() {
    try {
      const cityLocationData = await getCityLocation();
      const latitude = `${cityLocationData.results[0].latitude}`
      const longitude = `${cityLocationData.results[0].longitude}`
      const resWeather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`)
      const weatherData = await resWeather.json()
      return weatherData
    } catch(err) {
      console.error(err)
    }
  }

  async function buildWeatherDisplay() {
    try {
      const cityLocationData = await getCityLocation();
      const cityWeatherData = await getCityWeather();
      nameOfCity.textContent = `${cityLocationData.results[0].name}`,
      temp.textContent = `${cityWeatherData.current.temperature_2m} ${cityWeatherData.current_units.temperature_2m}`,
      countryTd.textContent = `${cityLocationData.results[0].country}`, // It was undefined because the results is array. we need to put [0]
      timezoneTd.textContent = `${cityWeatherData.timezone}`,
      populationTd.textContent = `${cityLocationData.results[0].population}`, // It was undefined because the results is array. we need to put [0]
      tmrForecastTdLow.textContent = `Low: ${cityWeatherData.daily.temperature_2m_min} ${cityWeatherData.daily_units.temperature_2m_min}`,
      tmrForecastTdMax.textContent = `Max: ${cityWeatherData.daily.temperature_2m_max} ${cityWeatherData.daily_units.temperature_2m_max}`

      if(cityWeatherData.current.is_day !== 0) {
        document.body.style.backgroundColor = 'rgb(62, 62, 62)'
        document.body.style.color = 'white'
        // sectionTemp.style.backgroundImage = 'url("images/night.jpg")'
      } else {
        document.body.style.backgroundColor = 'white'
        document.body.style.color = 'black'
        // sectionTemp.style.backgroundImage = 'url("images/day.jpg")'
      }
    } catch(err) {
      console.error(err)
    }
  }
  buildWeatherDisplay()
})