
define(['knockout', 'crossroads', 'hasher'], function(ko, xroads, hasher){
    function Router(config){
        var self = this; //probably have to capture this so we can use it below
        this.currentRoute = ko.observable({});
    
        // Configure Crossroads route handlers
        ko.utils.arrayForEach(config.routes, function(route) {
            xroads.addRoute(route.url, function(requestParams) {
                self.currentRoute(ko.utils.extend(requestParams, route.params));
            });
        });
        
        function handleChanges(newHash, oldHash) {
             xroads.parse(newHash);
        }
    
        // Activate Crossroads
        xroads.normalizeFn = xroads.NORM_AS_OBJECT;
        hasher.initialized.add(handleChanges);
        hasher.changed.add(handleChanges);
        
        hasher.init();
        hasher.setHash('');
    }
    
    var routerInstance = new Router({
        routes: [
            { url: '',          params: { page: 'home-page' } },
            { url: 'conditions',     params: { page: 'conditions-page' } },
            { url: 'constituents',     params: { page: 'constituents-page' } },
            { url: 'offerings',     params: { page: 'offerings-page' } }
        ]
    });
    return routerInstance;
});