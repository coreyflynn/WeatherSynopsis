// MODELS
bostonTreeModel = new Barista.Models.PertCellBreakdownModel();
houstonTreeModel = new Barista.Models.PertCellBreakdownModel();

bostonCountModel = new Barista.Models.PertCountModel();
houstonCountModel = new Barista.Models.PertCountModel();


// generate a treemap view for the weather
bostonTreeView = new Barista.Views.FlatTreeMapView({
    el: $("#boston_treemap_view_target"),
    model: bostonTreeModel,
    span_class: "col-xs-6",
	fg_color: "#018203",
    category_html: WeatherModel.icon_map
});

houstonTreeView = new Barista.Views.FlatTreeMapView({
    el: $("#houston_treemap_view_target"),
    model: houstonTreeModel,
    span_class: "col-xs-6",
    fg_color: "#D41133",
    category_html: WeatherModel.icon_map
});

// generate a view for the basic stats
bostonCountView = new Barista.Views.PertCountView({
    el: $("#boston_pert_view_target"),
    model: bostonCountModel,
    static_text: "Temperature",
    fg_color: "#018203",
    bg_color: "#ffffff",
    span_class: "col-xs-6",
    plot_height: 200,
    categories: [{_id:"feels like",count:0},{_id:"dew point",count:0},{_id:"humidity (%)",count:0}]
});

houstonCountView = new Barista.Views.PertCountView({
    el: $("#houston_pert_view_target"),
    model: houstonCountModel,
    static_text: "Temperature",
    fg_color: "#D41133",
    bg_color: "#ffffff",
    span_class: "col-xs-6",
    plot_height: 200,
    categories: [{_id:"feels like",count:0},{_id:"dew point",count:0},{_id:"humidity (%)",count:0}]
});

// INPUT BINDINGS
$("#dateInput").change(function(){
    update_weather();
});

// UTILITY FUNCTIONS
var houstonLocation = '29.7605,-95.3698';
var bostonLocation = '42.3650,-71.1050';

function update_weather(){
    // var new_daily_counts = WeatherModel.get_fake_weather();
    // var t = (new Date()).getTime();
    // treeView.model.set({tree_object: {name:"root", children:new_daily_counts}, last_update: t});

    // get the selected date
    var date = new Date($("#dateInput").val()).getTime() / 1000;

    // get the weather for that date in boston
    var boston_weather_promise = WeatherModel.get_weather(date,bostonLocation);
    var boston_weather_promise2 = WeatherModel.get_weather(date + 172800,bostonLocation);
    var boston_weather_promise3 = WeatherModel.get_weather(date - 172800,bostonLocation);
    $.when(boston_weather_promise,boston_weather_promise2,boston_weather_promise3).then(function(weather1,weather2,weather3){
        var context = weather1.context.concat(weather2.context,weather3.context);
        var counts = _.countBy(context,function(o){
            if (o === "clear-night"){
                return "clear-day";
            }else if (o === "partly-cloudy-night"){
                return "partly-cloudy-day";
            }else{
                return o;
            }
        });
        var data = [];
        _.keys(counts).forEach(function(o){
            data.push({_id: o, count: counts[o]});
        });
        var t = (new Date()).getTime();
        bostonTreeView.model.set({tree_object: {name:"root", children:data}, last_update: t});

        console.log(weather1)
        bostonCountView.model.set({pert_types:weather1.current, count: weather1.temperature})
    });

    // get the weather for that date in boston
    var houston_weather_promise = WeatherModel.get_weather(date,houstonLocation);
    var houston_weather_promise2 = WeatherModel.get_weather(date + 172800,houstonLocation);
    var houston_weather_promise3 = WeatherModel.get_weather(date - 172800,houstonLocation);
    $.when(houston_weather_promise,houston_weather_promise2,houston_weather_promise3).then(function(weather1,weather2,weather3){
        var context = weather1.context.concat(weather2.context,weather3.context);
        var counts = _.countBy(context,function(o){
            if (o === "clear-night"){
                return "clear-day";
            }else if (o === "partly-cloudy-night"){
                return "partly-cloudy-day";
            }else{
                return o;
            }
        });
        var data = [];
        _.keys(counts).forEach(function(o){
            data.push({_id: o, count: counts[o]});
        });
        var t = (new Date()).getTime();
        houstonTreeView.model.set({tree_object: {name:"root", children:data}, last_update: t});

        console.log(weather1)
        houstonCountView.model.set({pert_types:weather1.current, count: weather1.temperature})
    });
}

// SET UP
$("#dateInput").val(new Date().toISOString().split('T')[0]);
update_weather();
