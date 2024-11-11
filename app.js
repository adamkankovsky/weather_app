if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    })

}

function getCityTemp(cityName, id) {
    const key = "351763a16d4a2b0e40d09c275450b2ff";
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + key + "&units=metric")  
    .then(function(resp) { return resp.json() })
    .then(function(data) {
        if (data.cod === 200){
            document.getElementById(id).textContent = data.name + ": " + data.main.temp + "°C";
        } else {
            console.log(data);
        }
    })
    .catch(function(error) {
        console.log("Error ocured" + error);
    });
}

window.onload = function() {
    getCityTemp("Dobronin", "dobronin");
    getCityTemp("Jihlava", "jihlava");
}

function getUserCityTemp() {
    const input_city = document.getElementById("input_city").value;

    getCityTemp(input_city, "city");
}





