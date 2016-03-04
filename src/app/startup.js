require(['jquery', 'bootstrap', 'knockout', 'router'], function(jq, boot, ko, router) {
    // Components can be packaged as AMD modules, such as the following:
    ko.components.register('nav-bar', { require: 'components/nav-bar/nav-bar' });
    ko.components.register('home-page', { require: 'components/home-page/home' });

    // ... or for template-only components, you can just point to a .html file directly:
    //ko.components.register('about-page', {
        //template: { require: 'text!components/about-page/about.html' }
    //});

    ko.components.register('conditions-page', { require: 'components/conditions-page/conditions' });
    ko.components.register('constituents-page', { require: 'components/constituents-page/constituents' });
    ko.components.register('offerings-page', { require: 'components/offerings-page/offerings' });

    // [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]

    // Start the application
    jq(document).ready(function(){
        ko.applyBindings({ route: router.currentRoute });
    });
});