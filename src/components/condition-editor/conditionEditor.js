define(['knockout', 'jquery', 'text!./conditions.html'], function(ko, jq, htmlString) {
    function ConditionViewModel(params) {
        var ConditionModel = function () {
            var self = this;
            self.Name = "";
            self.Description = "";
            self.ConditionTypeFk = 0;
            self.ConditionEvidence = [];
            self.Tags = [];
            self.ConstituentIds = [];
            self.OfferingId = null;
            self.FacetId = null;
        };
        
    var self = this;

    var conditionsUri = '/api/ConditionModel';
    var resourcesUri = '/api/resources/condition';
    var newConditionUri = '/api/condition/new';
    var getConditionsUri = '/api/conditions/' + params.id;
    var getOfferingsUri = '/api/resources/offerings';
    var updateOfferingUri = '/api/condition/update';

    self.ConditionId = params.id;
    self.ConditionName = ko.observable(); // the name of the condition
    self.ConditionDescription = ko.observable(); //the condition description
    self.ConditionTypeId = ko.observable(); // the type of condition... like Problem, etc. will be 0 when created new ones
    self.AvailableConditionTypes = ko.observableArray();
    self.SelectedConditionType = ko.observable(); // the selected condition type for this condition

    self.RelatedOfferingId = ko.observable(0); //for product conditions, we'll want to know the ID of the offering context where the condition exists
    self.InvolvesProduct = ko.observable(false); // this is so that when a product constituency is involved, we can offer up a Product Facet to select from
    self.SelectedOfferingFacet = ko.observable(); //when a condition is related to an offering, there will be some facet of the offering where the condition exists... like in the interactive layer

    self.error = ko.observable(); //
    self.EvidenceCollection = ko.observableArray(); // the set of evidence items
    self.CurrentEvidence = ko.observable(); // the evidence currently being edited

    self.AvailableConstituents = ko.observableArray(); // a list of people to choose from
    self.SelectedConstituents = ko.observableArray();

    self.AvailableFacets = ko.observableArray(); // a list of all of our offerings... for Offering Conditions
    self.SelectedFacet = ko.observable();

    self.AvailableOfferings = ko.observableArray(); // a list of all the product facets... for Offering Conditions
    self.SelectedOffering = ko.observableArray();

    self.ServiceProductTrees = ko.observable(new ProductDashboardViewModel());

    self.ConditionTags = [];

    self.IsProductDerived = ko.observable(false);

    self.SaveCondition = function () {
        if (self.ConditionId == 0) {
            jq.getJSON(newConditionUri,self.Model)
            .done(function (data) {
                alert("Created? ... " + data);
            });
        }
        else {
            //post the new one
            var model = self.ConditionModel();

            jq.getJSON(updateOfferingUri, model)
            .done(function (data) {
                alert("Saved? ... " + data);
            });
        }

    };

    self.CreateEvidence = function () {
        self.CurrentEvidence(new EvidenceViewModel(0, "New Evidence", "", true));
    };

    self.RemoveEvidence = function (evidence) {
        self.EvidenceCollection.remove(evidence);
    };

    self.EditEvidence = function (evidence) {
        self.CurrentEvidence(evidence);
        jq("#EvidenceModal").modal('show');
    };

    self.UpdateConstituents = function () {

        self.SelectedConstituents.removeAll();

        for (var i = 0; i < self.AvailableConstituents().length ; i++) {

            if (self.AvailableConstituents()[i].IsSelected()) {
                var id, name, description = null;
                name = self.AvailableConstituents()[i].ConstituentName;
                id = self.AvailableConstituents()[i].Id;
                
                var digest = new ConstituentDigestViewModel(name, description, id, false);
               
                self.SelectedConstituents.push(digest);
            };
        };
    };

    self.RemoveConstituent = function (cons) {
        //remove the constituent from selected
        var len = self.SelectedConstituents().length - 1;
        for (var i = len; i >= 0; i--) {
            if (self.SelectedConstituents()[i].Id == cons.Id) {
                self.SelectedConstituents.remove(self.SelectedConstituents()[i]);
            };
        };

        //deselect the previously selected item from available... or maybe do this elsewhere
        for (i = 0; i < self.AvailableConstituents().length ; i++) {
            if(self.AvailableConstituents()[i].Id == cons.Id)
            {
                self.AvailableConstituents()[i].IsSelected(false);
            }
        };

    };

    self.AddOrUpdateEvidence = function (evidence) {
        if (evidence.IsNew) {
            var newEvidence = new EvidenceViewModel(0, evidence.EvidenceName(), evidence.EvidenceDescription(), false);
            self.EvidenceCollection.push(newEvidence)
            self.CurrentEvidence(null);
            $("#EvidenceModal").modal('hide');
        };
    };

    self.SelectEvidence = function (evidence) {
        //alert(evidence instanceof EvidenceViewModel);
        if (self.CurrentEvidence() !== 'undefined' && self.CurrentEvidence() != null) self.CurrentEvidence().IsSelected(false);
        self.CurrentEvidence(evidence);
        self.CurrentEvidence().IsSelected(true);

    };

    self.Model = function () {
        var model = new ConditionModel();
        model.Id = self.ConditionId;
        model.Name = self.ConditionName();
        model.Description = self.ConditionDescription();
        model.ConditionTypeFk = self.SelectedConditionType().ConditionTypeId();

        var eArr = self.EvidenceCollection();
        for (var i = 0; i < eArr.length; i++) {
            model.ConditionEvidence.push({ EvidenceId: eArr[i].EvidenceId, EvidenceName: eArr[i].EvidenceName(), EvidencDescription: eArr[i].EvidenceDescription() });
        }

        model.Tags = jq('#condition-tags').tagEditor('getTags')[0].tags.slice();

        if (self.IsProductDerived()) {
            model.OfferingId = self.SelectedOffering().OfferingId();
            model.FacetId = self.SelectedFacet().FacetId();
        }

        var cArr = self.SelectedConstituents();
        for (var i = 0; i < cArr.length; i++) {
            alert(cArr[i].Id);
            model.ConstituentIds.push(cArr[i].Id);
        }

        return model;
    };

    self.RefreshOfferings = function () {
        jq.getJSON(getOfferingsUri)
        .done(function (data) {
            self.AvailableOfferings(ko.utils.arrayMap(data, function (o) { return new OfferingItemViewModel(o.OfferingName, o.OfferingId, o.OfferingDescription) }));
        });
    };

    function getAllResources() {
        jq.getJSON(resourcesUri)
        .done(function (data) {

            self.AvailableConditionTypes(ko.utils.arrayMap(data.ConditionTypes, function (ct) { return new ConditionTypeItemViewModel(ct.ConditionTypeName, ct.ConditionTypeId, ct.Description) }));
            self.AvailableConstituents(ko.utils.arrayMap(data.Constituents, function (c) { return new ConstituentDigestViewModel(c.Name, c.Description, c.Id, false) }));
            self.AvailableOfferings(ko.utils.arrayMap(data.Offerings, function (o) { return new OfferingItemViewModel(o.OfferingName, o.OfferingId, o.OfferingDescription) }));
            self.AvailableFacets(ko.utils.arrayMap(data.Facets, function (f) { return new FacetItemViewModel(f.FacetName, f.FacetId, f.FacetDescription) }));

            //now go get the model

            if (self.ConditionId !== 0) {
                jq.getJSON(getConditionsUri)
                .done(function (data) {
                    self.ConditionName(data.Name);
                    self.ConditionDescription(data.Description);

                    //find and set the condition type
                    var ctArr = self.AvailableConditionTypes();

                    for (var ct = 0; ct < ctArr.length; ct++) {
                        if (ctArr[ct].ConditionTypeId() == data.ConditionTypeFk) {
                            self.SelectedConditionType(ctArr[ct]);
                            break;
                        }
                    }
                    //load up any evidence
                    self.EvidenceCollection(ko.utils.arrayMap(data.ConditionEvidence, function (f) {
                        return new EvidenceViewModel(f.EvidenceId, f.EvidenceName, f.EvidencDescription, false);
                    }));

                    //load up any constituents
                    var constituentArr = self.AvailableConstituents();

                    for (var i = 0; i < data.ConstituentIds.length; i++) {
                        for (var c = 0; c < constituentArr.length; c++) {
                            if (constituentArr[c].Id == data.ConstituentIds[i]) {
                                constituentArr[c].IsSelected(true);
                            }
                        }
                    };

                    self.UpdateConstituents();

                    //check the is product related

                    if (data.OfferingId != null && data.OfferingId !== 'undefined' && data.OfferingId != 0) //should make the model nullable 
                    {
                        self.IsProductDerived(true);
                        //select the related product
                        var offeringArr = self.AvailableOfferings();
                        for (var o = 0; o < offeringArr.length; o++) {
                            if (data.OfferingId == offeringArr[o].OfferingId()) {
                                self.SelectedOffering(offeringArr[o]);
                            }
                        };
                        //select the related facet
                        var facetArr = self.AvailableFacets();
                        for (var f = 0; f < facetArr.length; f++) {
                            if (data.FacetId == facetArr[f].FacetId()) {
                                self.SelectedFacet(facetArr[f]);
                            }
                        };
                    }

                    //need to load up any tags

                    self.ConditionTags = data.Tags.slice(0);
                    jq('#condition-tags').tagEditor({
                        autocomplete: {
                            delay: 250, // show suggestions after a 250 ms delay
                            minLength: 2, // don't go immediately... make sure at least 1 char is typed and then fire away on the second
                            position: { collision: 'flip' }, // automatic menu position up/down
                            source: "/api/resources/tagsearch"
                        },
                        initialTags: self.ConditionTags.slice(0),
                        placeholder: 'Start typing tags ...'
                    });
                });
            }
            else {
                self.ConditionName("New Condition");
            }

        });
    }
        //getAllResources();
    }
    // Fetch the initial resources. On the callback we'll go get the model

    
    return { viewModel: ConditionViewModel, template: htmlString };
});