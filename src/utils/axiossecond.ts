import axios from "axios";

const isProduction = true; // Change this to false for development

const url = {
  production: "https://www.devifai.website/api/master/mechanic",
  development: "http://localhost:5000/api/master/super/mechanic",
};

const axiosDiesel = axios.create({
  baseURL: isProduction ? url.production : url.development,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosDiesel;
