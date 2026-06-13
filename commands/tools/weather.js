const axios = require('axios');

const API_KEY = '02747b16d8034d27be864142261306';

module.exports = {
  name: 'weather',
  category: 'tools',
  description: 'Real Time Weather',

  async execute(sock, msg, args, extra) {
    const city = args.join(' ');

    if (!city) {
      return extra.reply(
        'Example:\n.weather lahore\n.weather hasilpur\n.weather qaimpur'
      );
    }

    try {
      const { data } = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=1&aqi=no&alerts=no`
      );

      const current = data.current;
      const forecast = data.forecast.forecastday[0].day;

      const rainChance = forecast.daily_chance_of_rain || 0;

      let rainStatus = 'Nahi ❌';
      let umbrella = 'Zaroorat nahi 😎';

      if (rainChance >= 50) {
        rainStatus = `Haan ✅ (${rainChance}%)`;
        umbrella = 'Sath rakhein 🌂';
      }

      const reply = `🌤 Weather: ${data.location.name}

🌡 Temperature: ${current.temp_c}°C
🤒 Feels Like: ${current.feelslike_c}°C
💧 Humidity: ${current.humidity}%
💨 Wind: ${current.wind_kph} km/h

☁️ Condition: ${current.condition.text}

☔ Aaj Barish: ${rainStatus}
🌂 Umbrella: ${umbrella}

🕒 Updated: ${current.last_updated}`;

      return extra.reply(reply);

    } catch (err) {
      console.error(err.response?.data || err.message);
      return extra.reply('❌ City not found.');
    }
  }
};
