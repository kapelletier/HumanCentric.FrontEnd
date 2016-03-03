define(['knockout', 'text!./home.html'], function(ko, htmlString) {
    function HomeViewModel(params) {
        // Set up properties, etc.
         //this.message = ko.observable('Welcome to HumanCentric!');
    }
 
    // Use prototype to declare any public methods
    //MyComponentViewModel.prototype.doSomething = function() { ... };
 
    // Return component definition
    return { viewModel: HomeViewModel, template: htmlString };
});