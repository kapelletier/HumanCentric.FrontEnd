// require.js looks for the following global when initializing
//"knockout-projections": "bower_modules/knockout-projections/dist/knockout-projections",
var require = {
    baseUrl: ".",
    paths: {
        "bootstrap":            "bower_modules/bootstrap/dist/js/bootstrap.min",
        "crossroads":           "bower_modules/crossroads/dist/crossroads.min",
        "hasher":               "bower_modules/hasher/dist/js/hasher.min",
        "jquery":               "bower_modules/jquery/dist/jquery",
        "knockout":             "bower_modules/knockout/dist/knockout",
        "signals":              "bower_modules/js-signals/dist/signals.min",
        "text":                 "bower_modules/text/text",
        "router":               "app/router"
    },
    shim: {
        "bootstrap": { deps: ["jquery"] }
    }
};
