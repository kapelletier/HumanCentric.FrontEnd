define(['knockout', 'text!./constituents.html'], function(ko, htmlString) {
    function ConstituentsViewModel(params) {
     var self = this;
    var constituentsUri = '/api/ConstituentModel';
    var editBaseUri = '/api/ConstituentModel/Edit/';
    var resourcesUri = '/api/constituent/resources';
    var postCharacteristicUri = '/api/CharacteristicApi';

    self.Constituents = ko.observableArray();

    self.AvailableCharacteristics = ko.observableArray(); // there are a finite set of these persona characteristics to choose from that are fetched from the server
    self.AvailableCharacteristicCategories = ko.observableArray();
    self.AvailableValueOrientations = ko.observableArray();
    self.IsLoading = ko.observable(true);

    self.DeleteConstituent = function (data) {
        var ajx = ajaxHelper("/api/ConstituentModel/" + data.ConstituentId, 'DELETE');
        ajx.done(function (rtn) {
            self.Constituents.remove(data);
        });

    };

    self.ConstituentProperties = function (data) {
        self.CurrentConstituent(data);
        $("#editConstituentModal").modal('show');
    };

    self.ConstituentCharacteristics = function (data) {
        self.CurrentConstituent(data);
        //we should go through all the available characteristics and select the ones currently on this constituent
        var acArr = self.AvailableCharacteristics();
        for (var i = 0; i < acArr.length; i++) {
            var ccArr = self.CurrentConstituent().Characteristics();
            acArr[i].IsSelected(false);
            for (var ii = 0; ii < ccArr.length; ii++) {
                if (acArr[i].CharacteristicId == ccArr[ii].CharacteristicId) {
                    acArr[i].IsSelected(true);
                    break;
                };
            };
        };
        $("#AvaiCharsModal").modal('show');
    };

    self.CurrentConstituent = ko.observable();



    self.AddConstituent = function (data) {
        //actually going to go right ahead and create one at the server just to make it easier and all that
        var uri = '/api/constituent/new/' + data.Id;
        
        var ajx = ajaxHelper(uri, 'GET');
        ajx.done(function (rtn) {
            var newCons = new ConstituentItemViewModel(rtn.Name, false, rtn.Id, "", rtn.OrientationId, [], makeOrientationsArray());
            self.Constituents.push(newCons);
        });
    };

    self.CreateAndSelectCharacteristic = function () {
        //refresh available characteristics
        //then select

        var model = {};
        model.CharacteristicName = self.BlankCharacteristic().CharacteristicName;
        model.Description = self.BlankCharacteristic().Description();
        model.CategoryFk = self.BlankCharacteristic().SelectedCategory().CategoryId;
        var ajx = ajaxHelper(postCharacteristicUri, 'POST', model); //post this to create
        ajx.done(function (data) {
            //when donw, we'll select it and push it into this current constituent's characteristics
            self.CurrentConstituent().Characteristics.push(new CharacteristicViewModel(data.CharacteristicName, data.CharacteristicId, ""));
            //then hide the modal
            $("#AvaiCharsModal").modal('hide');
        });
    };


    self.UpdateSelectedCharacteristics = function () {
        self.CurrentConstituent().Characteristics.removeAll();
        for (i = 0; i < self.AvailableCharacteristics().length ; i++) {
            if (self.AvailableCharacteristics()[i].IsSelected()) {
                self.CurrentConstituent().Characteristics.push(new CharacteristicViewModel(self.AvailableCharacteristics()[i].CharacteristicName, self.AvailableCharacteristics()[i].CharacteristicId, self.AvailableCharacteristics()[i].Description()))
            }
        }
        //null this out
        self.CurrentConstituent(null);
    };

    self.BlankCharacteristic = ko.observable(new CharacteristicViewModel("New Characteristic", 0, ""));



    //go get all the constituents
    function getAllResources() {

        var ajx = ajaxHelper(resourcesUri, 'GET');
        ajx.done(function (data) {
            //map some stuff

            self.AvailableCharacteristics(ko.utils.arrayMap(data.Characteristics, function (ch) { return new CharacteristicViewModel(ch.CharacteristicName, ch.CharacteristicId, ch.Description) }));
            self.AvailableCharacteristicCategories(ko.utils.arrayMap(data.CharacteristicCategories, function (cat) { return new CharacteristicCategoryItem(cat.CategoryId, cat.CategoryName, cat.CategoryDescription) }));
            self.AvailableValueOrientations(ko.utils.arrayMap(data.ValueOrientations, function (vo) { return new ValueOrientationItemViewModel(vo.Name, false, vo.Id) }));

            self.IsLoading(false);
            var ajx2 = ajaxHelper(constituentsUri, 'GET');
            ajx2.done(function (data) {
                //create a copy of the available value orientations and pass it along
                
                self.Constituents(ko.utils.arrayMap(data, function (c) { return new ConstituentItemViewModel(c.Name, false, c.Id, c.Description, c.OrientationId, c.ConstituentCharacteristics, makeOrientationsArray()) }));
            });
        });

    }

    function makeOrientationsArray()
    {
        var vos = [];
        var arr = self.AvailableValueOrientations();
        for (var i = 0; i < arr.length; i++) {
            vos.push(new ValueOrientationItemViewModel(arr[i].Name(), false, arr[i].Id));
        }

        return vos;
    }
        
    }
 
    // Use prototype to declare any public methods
    //MyComponentViewModel.prototype.doSomething = function() { ... };
 
    // Return component definition
    return { viewModel: ConstituentsViewModel, template: htmlString };
});