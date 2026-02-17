import axios from "axios";

const API_KEY = "cb9f7b37fba455c57409ccdb6a5bb933";

const getWeather = (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  return axios.get(url).then(res => res.data);
};

export default { getWeather };
