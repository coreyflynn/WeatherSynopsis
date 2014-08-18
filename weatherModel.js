(function(){
    // build the top level object for the WeatherModel
    this.WeatherModel = this.WeatherModel || {};

    // set up a standard REST endpoint for forecast.io
    this.WeatherModel.url = 'https://api.forecast.io/forecast';

    // set up a forecast.io API key
    this.WeatherModel.key = 'e7ba9a3ca95eb9b62b8d52a5fa649e8e';

    // set an initial location
    this.WeatherModel.location = '42.3650,-71.1050';

    // map forecast.io API icon names to html snippets that can be used with our Treemap View
    this.WeatherModel.icon_map = {
        "clear-day": "<img style='margin:auto' class='flex-image' src='http://coreyflynn.github.io/Bellhop/img/climacons/Sun.png'></img>",
        "clear-night": "<img style='margin:auto' class='flex-image' src='http://coreyflynn.github.io/Bellhop/img/climacons/Moon.png'></img>",
        "rain": "<img style='margin:auto' class='flex-image' src='http://coreyflynn.github.io/Bellhop/img/climacons/Cloud-Drizzle.png'></img>",
        "snow": "<img style='margin:auto' class='flex-image' src='http://coreyflynn.github.io/Bellhop/img/climacons/Cloud-Snow-Alt.png'></img>",
        "sleet": "<img style='margin:auto' class='flex-image' src='http://coreyflynn.github.io/Bellhop/img/climacons/Cloud-Hail.png'></img>",
        "wind": "<img style='margin:auto' class='flex-image' src='http://coreyflynn.github.io/Bellhop/img/climacons/Wind.png'></img>",
        "fog": "<img style='margin:auto' class='flex-image' src='http://coreyflynn.github.io/Bellhop/img/climacons/Cloud-Fog.png'></img>",
        "cloudy": "<img style='margin:auto' class='flex-image' src='http://coreyflynn.github.io/Bellhop/img/climacons/Cloud.png'></img>",
        "partly-cloudy-day": "<img style='margin:auto' class='flex-image' src='http://coreyflynn.github.io/Bellhop/img/climacons/Cloud-Sun.png'></img>",
        "partly-cloudy-night": "<img style='margin:auto' class='flex-image' src='http://coreyflynn.github.io/Bellhop/img/climacons/Cloud-Moon.png'></img>"
    }

    // mock weather data ready to be consumed in a Barista TreeView
    this.WeatherModel.get_fake_weather = function(){
        var weather_types = _.keys(WeatherModel.icon_map);
        var context = [];
        for (i=0; i < 14; i++){
            context.push(weather_types[Math.floor(Math.random()*weather_types.length)]);
        }
        var counts = _.countBy(context,function(o){return o;});
        var data = [];
        _.keys(counts).forEach(function(o){
            data.push({_id: o, count: counts[o]});
        });
        return data;
    }

    // real weather data ready to be consumed in a Barista TreeView
    this.WeatherModel.get_weather = function(date,location){
        var call_url = [WeatherModel.url,WeatherModel.key,location].join('/') + ',' + date + '?callback=?';
        var data = [];
        var promise = $.Deferred();
        $.getJSON(call_url,function(res){
            console.log(res);
            var weather_types = _.keys(WeatherModel.icon_map);
            var context = [];
            res.hourly.data.forEach(function(d){
                context.push(d.icon);
            });

            current = [
                {
                    _id: "temperature",
                    count: res.currently.temperature
                },
                {
                    _id: "feels like",
                    count: res.currently.apparentTemperature
                },
                {
                    _id: "wind speed",
                    count: res.currently.windSpeed
                },
                {
                    _id: "dew point",
                    count: res.currently.dewPoint
                },
                {
                    _id: "humidity (%)",
                    count: res.currently.humidity * 100
                },
                {
                    _id: "pressure",
                    count: res.currently.pressure
                },
                {
                    _id: "precipitation (%)",
                    count: res.currently.precipProbability * 100
                },

            ];

            promise.resolve({
                context: context,
                current: current,
                temperature: res.currently.temperature
                });
        });
        return promise;
    }
})(this);
