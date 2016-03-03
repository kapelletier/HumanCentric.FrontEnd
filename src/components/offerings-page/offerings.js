define(['knockout', 'text!./offerings.html'], function(ko, htmlString) {
    function OfferingsViewModel(params) {
        // Set up properties, etc.
        
    }
 
    // Use prototype to declare any public methods
    //MyComponentViewModel.prototype.doSomething = function() { ... };
 
    // Return component definition
    return { viewModel: OfferingsViewModel, template: htmlString };
});