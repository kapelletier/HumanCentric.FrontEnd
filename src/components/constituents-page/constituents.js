define(['knockout', 'text!./constituents.html'], function(ko, htmlString) {
    function ConstituentsViewModel(params) {
        // Set up properties, etc.
        
    }
 
    // Use prototype to declare any public methods
    //MyComponentViewModel.prototype.doSomething = function() { ... };
 
    // Return component definition
    return { viewModel: ConstituentsViewModel, template: htmlString };
});