define(['knockout', 'text!./conditions.html'], function(ko, htmlString) {
    function ConditionsViewModel(params) {
        // Set up properties, etc.
         var self = this;
    var resourcesUri = '/api/resources/all';
    var condFilterUri = '/api/ConditionModel/?';

    self.Tags = ko.observableArray();
    self.Pinned = ko.observableArray();
    self.TagsVisible = ko.observable(true);
    self.Constituents = ko.observableArray();
    self.ServiceContexts = ko.observableArray();
    self.PinnedVisible = ko.observable(true);
    self.ConstituentsVisible = ko.observable(true);
    self.ServicesVisible = ko.observable(false);

    self.Conditions = ko.observableArray();

    self.WholeMishpucha = ko.observable(); //new TreeItemBase("Whole Mishpucha")
    self.SelectedTreeItem = ko.observable();

    self.SelectTreeItem = function (data, event) {
        //check it's type and then go off and filter the list based on that
        //it's going to be a Tag or a Constituent... so, given that... we'll do a search and update the table
        if(self.SelectedTreeItem() != 'undefined' && self.SelectedTreeItem() != null)
            self.SelectedTreeItem().IsSelected(false);

        data.IsSelected(true);
        self.SelectedTreeItem(data);
        var fullUri = "";
        /*
        if (data instanceof TagItemViewModel) {
            //let's go ahead and filter the table by the selected tag
            //alert("tag");
            var fullUri = condFilterUri + "term=" + data.DisplayName() + "&searchtype=tag";
        }
        else if (data instanceof ConstituentDigestViewModel) {
            //let's go get all the items by this constituent
            //alert("constituent");
            var fullUri = condFilterUri + "term=" + data.DisplayName() + "&searchtype=constituent";
        }
        else if (data instanceof ServiceContextItemViewModel) {
            //let's go get all the items by this constituent
            //alert("constituent");
            var fullUri = condFilterUri + "term=" + data.ServiceContextId + "&searchtype=service";
        }
        else {
            //let's assume it's the whole mispucha
            //alert("mishpucha");
            var fullUri = condFilterUri + "term=" + data.DisplayName() + "&searchtype=mishpucha";
        }

        var ajx = ajaxHelper(fullUri, 'GET');
        ajx.done(function (data) {
            
            self.Conditions(ko.utils.arrayMap(data, function (c) { return new ConditionItemViewModel(c.ConditionName, c.ConditionId, c.ConditionDescription) }));
        });
        */
    };

    //all of this is ripe for some inheritence so we don't have all this duplication

    self.ExpandedPinClass = ko.computed(function () {

        if (self.PinnedVisible()) {
            return "glyphicon glyphicon-chevron-right tree-glyph-down";
        }
        else {
            return "glyphicon glyphicon-chevron-right tree-glyph";
        }
    });

    self.ExpandedTagsClass = ko.computed(function () {

        if (self.TagsVisible()) {
            return "glyphicon glyphicon-chevron-right tree-glyph-down";
        }
        else {
            return "glyphicon glyphicon-chevron-right tree-glyph";
        }
    });

    self.ExpandedConsituentsClass = ko.computed(function () {

        if (self.ConstituentsVisible()) {
            return "glyphicon glyphicon-chevron-right tree-glyph-down";
        }
        else {
            return "glyphicon glyphicon-chevron-right tree-glyph";
        }
    });

    self.ExpandedServicesClass = ko.computed(function () {

        if (self.ServicesVisible()) {
            return "glyphicon glyphicon-chevron-right tree-glyph-down";
        }
        else {
            return "glyphicon glyphicon-chevron-right tree-glyph";
        }
    });

    self.HasPins = ko.computed(function () {
        return (false);
    });

    self.HasTags = ko.computed(function () {
        return (self.Tags().length > 0);
    });

    self.HasConstituents = ko.computed(function () {
        return (self.Constituents().length > 0);
    });

    self.TogglePinned = function (data, event) {
        self.PinnedVisible(!self.PinnedVisible());
    };

    self.ToggleTags = function (data, event) {
        self.TagsVisible(!self.TagsVisible());
    };

    self.ToggleConstituents = function (data, event) {
        self.ConstituentsVisible(!self.ConstituentsVisible());
    };

    self.ToggleService = function (data, event) {
        self.ServicesVisible(!self.ServicesVisible());
    };


    //any time a constituent is added or tags are added, this should update, but that requires a Messenger of some kind
    //if we are going to do things across tabs... otherwise, it can just load up and perhaps check for updates on occassion if that makes sense
    //might want to make this observable, but for now, it will probably get loaded once and then in full when necessary
    //this is going to be a hierarchy of objects
    self.TreeItems = [];
    }
 
    // Use prototype to declare any public methods
    //MyComponentViewModel.prototype.doSomething = function() { ... };
 
    // Return component definition
    return { viewModel: ConditionsViewModel, template: htmlString };
});