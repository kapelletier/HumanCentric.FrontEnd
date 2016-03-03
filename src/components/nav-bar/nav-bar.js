define(['knockout', 'text!./nav-bar.html'], function(ko, htmlString) {
    function NavBarViewModel(params) {
        // Set up properties, etc.
         this.route = params.route;
    }
 
    // Use prototype to declare any public methods
    //MyComponentViewModel.prototype.doSomething = function() { ... };
 
    // Return component definition
    return { viewModel: NavBarViewModel, template: htmlString };
});