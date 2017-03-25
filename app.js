// var uriPrefix = "https://cip.prep.amalga.uwmedicine.org:8801/LeafWCFRest/LeafWCFRest.LeafWCFRestImpl.svc/" // Prep
// var uriPrefix = "https://console.amalga.uwmedicine.org:8801/LeafWCFRest/LeafWCFRest.LeafWCFRestImpl.svc/" // Prod
var uriPrefix = "https://AM-DEVTOOLS01.amc.uwmedicine.org:8801/LeafWCFRest/LeafWCFRest.LeafWCFRestImpl.svc/" // DEV


//================================================
// Leaf 
//================================================
var Leaf = {
    ConceptList: {},
    DataExportTypes: [],
    PatientListDatasets: {},
    AuxiliaryQueries: {},
    SavedQueries: {
        List: {},
        callBackOnComplete: function () {}
    },
    PreviousQueries: {},
    Panels: [],
    Utils: {},
    Ui: {},
    HtmlGenerators: {},
    Models: {},
    Ajax: {},
    RCImport: {
        CurrentUiStep: 1,
        Projects: {},
        Binding: {}
    },
    PatientList: {
        Table: {},
        Columns: {},
        HistorySubTable: {},
        Configuration: {
            Datasets: [],
            ColumnOrder: []
        },
        Templates: {}
    },
    Xhr: {
        Clinical: {},
        Search: {},
        PatientList: {},
        Demographics: {},
        Visits: {},
        ClinicVisits: {},
        ProgressModal: {}
    },
    Session: {
        AuthToken: Caradigm.Platform.AppFramework.Utils.getJWT(),
        SessionType: "",
        isSessionDocumentationComplete: false,
        IdentificationType: "",
        isAdmin: false
    },
    Global: {
        SaveQueryPatientLimit:   200000,
        SqlDropDownItemDelimiter: "|",
        SqlDropDownTextDelimiter: "~",
        RedcapExportWarning:  10000,
        RedcapExportLimit:    50000
    },
    Status: {
        PatientListTotalCount_data: 0,
        PreviousSearchString: "",
        CurrentTotalPatients: 0,
        isConceptEditModeOn: false,
        PreviousCodeSearchString: "",
        LatestHoveredNode: "",
        TopParentSearchFilter: 0,
        CurrentQueryBuilderStatus: 1,
        isPatientListCurrent: true,
        areDemographicsCurrent: true,
        areQueryCriteriaChanged: false,
        CurrentSavedQueryID: 0,
        CurrentPatientListTemplateID: 0,
        clearPanelsOnSaveQueryEvent: false
    },
    Visualization: {
        TRANSITION_IN_SECONDS: 750,
        Binary: {
            drawChart: function () { }
        },
        AgeByGender: {
            drawChart: function () { }
        },
        Sparkline: {
            drawChart: function () { }
        },
        LanguageEthnicity: {
            drawChart: function () { }
        },
        Location: {
            drawChart: function () { }
        },
        EmploymentInsurance: {
            drawChart: function () { }
        },
        Religion: {
            drawChart: function () { }
        }
    },
    QuestionMarkHelp:{
      // These are here for help popovers that are text-only.  
      // If they contain a picture or embedded html, they are in a Div in Site.Master.
		
       PopoverHelpQueryCriteria_Content           : 'In order to create a query, drag the concepts to the panels below.  Then click the "Run Query" button.'
      ,popoverHelpLogin_Filters_Content           : 
      // "Filters are used to include/exclude the most popular cohorts.<br />"
      "Filters are a convenient way to include/exclude commonly used cohorts.<br />"
      + "You can use the included filters, as well as filters you define yourself.<br />"
      + "To define a custom filter for your own use, click on any concept in the Concept List, and select 'add as filter'.<br />"
      + "Queries you saved in the Concept List can similarly be used as custom filters."

      ,popoverHelpPL_Datasets_Content             : "Click here to select more datasets for your cohort.<br />"
      + 'The "Basic Demographics" dataset is configured for you.<br />'
      + 'Many other datsets are available, including detailed Demographics, Labs, Encounters, Vitals and more.'
        
      ,popoverHelpPL_PatientList_Content          :
        "This patient list displays your cohort's patient data for review.<br />"
        + "It is limited to 499 patients.<br />"
        + 'Click "Datasets" below to configure datasets for your cohort.<br />'
        + 'Click the "Export Data" button to send your data to REDCap.'
        // : "The patient list shows patient demographics and other dataset you select.<br />"
        // + "It is limited to 499 patients <br />"
        // + "Data can be exported via the Export Data button on the right."
        
        
      ,popoverHelpPL_SavedView_Content            : "A View is the set of Datasets and Columns you have selected.<br />"
      + "You can save and restore Views.<br />" 
      + "This enables you to see the same view of your data, across different queries."  
      ,popoverHelpPL_Search_Content               : "Search the cohort's data records for a string.  The result will display only the patients that have this string somethwere in any of their data records."
	    ,popoverHelpMyLeaf_MyQueries_Content        : "These are all the queries you have saved, including the queries you have exported..  You can open, search, sort,  and delete them."
	    ,popoverHelpMyLeaf_MyImported_Content       : "These are all the projects you have imported from REDCap.  You can search, sort,  and delete them.  Open them from the Concept List tree under 'MyREDCap Imports'."
	    ,popoverHelpMyLeaf_ImportProj_Content       : "Import a project from REDCap.  You can also re-import an existing project."
    }
};



//======================
// help initialization
//======================

  
//================================================
// Utility functions
//================================================

Leaf.Utils.runStringSearch = function (forceSearch) {

    var searchString = $("#conceptSearch").val().trim().substring(0, 30),
        searchLength = searchString.length,
        containsNumber = /\d/.test(searchString),
        $primaryConceptList = $("#list-parent"),
        $searchConceptList = $("#list-search");

    // Clear any previous code equivalent
    if (Leaf.Status.PreviousCodeSearchString != searchString) {

        $("#code-equivalent-wrapper").html("");
    }


    // If the field is not blank
    if (searchLength > 2) {

        // Hide the primary Concept List
        $primaryConceptList.hide();

        // Show the search Concept List
        $searchConceptList.show();

        if (searchString != Leaf.Status.PreviousSearchString || forceSearch == true) {

            Leaf.Ajax.refreshSearchConceptList(searchString);
            Leaf.Status.PreviousSearchString = searchString;
        }

        if (containsNumber) {

            Leaf.Ajax.getSearchCodeConversion(searchString);
        }

    }
        // Else the search field is blank
    else {

        // Show the primary Concept List
        $primaryConceptList.show();

        // Hide the search Concept List
        $searchConceptList.hide();


        $("#code-equivalent-wrapper").html("");

        if (Leaf.Xhr.Search.readyState == 1) {
            Leaf.Xhr.Search.abort();
        }
    }
};

Leaf.Utils.convertToObjectArray = function (keyValueArray) {

    var outputArray = {};

    $.each(keyValueArray, function (index) {

        var key = this[0].Value.value; // Key is the "id"

        outputArray[key] = {};

        $(keyValueArray[index]).each(function (ob) {

            var property = keyValueArray[index][ob].Key,
                value = keyValueArray[index][ob].Value.value;

            outputArray[key][property] = value;
        });

    });

    return outputArray;
};

Leaf.Utils.addToConceptList = function (newConcepts) {

    $.each(newConcepts, function (i) {

        Leaf.ConceptList[newConcepts[i].id] = newConcepts[i];

    });
};

Leaf.Utils.getPatientListColumns = function () {

    var $columns = $("#patientTable th");

    Leaf.PatientList.Configuration.ColumnOrder = [];

    if ($columns.length > 0) {

        $columns.each(function () {

            Leaf.PatientList.Configuration.ColumnOrder.push($(this).text());
        });
    }
};

Leaf.Utils.initializePanels = function () {

    Leaf.Panels = [];

    for (var i = 0; i < 3; i++) {

        Leaf.Panels[i] = new Leaf.Models.Panel();
        Leaf.Panels[i].SubPanels[0] = new Leaf.Models.SubPanel();
        Leaf.Panels[i].Domain = "Panel " + (i + 1).toString();

        $("#panel" + i.toString())
            .data("panelID", i);
    }
};

Leaf.Utils.addTopParentsToFilterList = function (topParentArray) {

    var $topParentFilter = $("#concept-list-btn").siblings("ul");

    topParentArray.sort(Leaf.Utils.sortAlphabetical);

    for (var i = 0; i < topParentArray.length; i++) {

        var $newLi = $("<li value='" + topParentArray[i].id + "'><a>" + topParentArray[i].ui_Display_Name + "</a></li>");

        $topParentFilter.append($newLi);
    }
};

Leaf.Utils.updateSearchCodeEquivalent = function (codeContent) {

    var code = codeContent.TargetCode,
        codeType = codeContent.TargetCodeType,
        codeName = codeContent.ui_Display_TargetName,
        $codeBody = $("<span class='code-equivalent-prefix'>Possible Equivalent:</span><span class='code-equivalent'><strong>" + code + '</strong> - ' + codeName + " (" + codeType + ")" + "</span>"),
        previousCode = $(".code-equivalent")
                            .data("code");

    // If the previous code is not the same as the new code, update the DOM and data
    if (previousCode != code) {

        $("#code-equivalent-wrapper").html("");

        $("#code-equivalent-wrapper")
            .append($codeBody);

        $(".code-equivalent")
            .data("code", code);
    }
};

Leaf.Utils.getConceptInfoFromWiki = function () {

    var concept = {};

    concept.id = $("#conceptedit-id").val() == "" ? 0 : $("#conceptedit-id").val();
    concept.parent = $("#conceptedit-parentid").val() == "" ? "#" : $("#conceptedit-parentid").val();
    concept.ui_Display_Name = $("#conceptedit-name").val() == "" ? null : $("#conceptedit-name").val();
    concept.ui_Display_Text = $("#conceptedit-text").val() == "" ? null : $("#conceptedit-text").val();
    concept.PermittedUserOrGroup = $("#conceptedit-permitteduser").val() == "" ? null : $("#conceptedit-permitteduser").val();
    concept.PatientCount = $("#conceptedit-patientcount").val() == "" ? null : $("#conceptedit-patientcount").val();
    concept.is_EncounterBased = $("#conceptedit-encounterbased").prop("checked");
    concept.is_EventBased = $("#conceptedit-eventbased").prop("checked");
    concept.is_Numeric = $("#conceptedit-numeric").prop("checked");
    concept.is_Parent = $("#conceptedit-parent").prop("checked");
    concept.has_Dropdown = $("#conceptedit-hasdropdown").prop("checked");
    concept.sql_Set_Name = $("#conceptedit-sqlsetname").val() == "" ? null : $("#conceptedit-sqlsetname").val();
    concept.sql_WhereClause = $("#conceptedit-sqlwhereclause").val() == "" ? null : $("#conceptedit-sqlwhereclause").val();
    concept.ui_Display_Tooltip = $("#conceptedit-tooltip").val() == "" ? null : $("#conceptedit-tooltip").val();
    concept.sql_Field_Numeric = $("#conceptedit-numericfield").val() == "" ? null : $("#conceptedit-numericfield").val();
    concept.sql_Field_Date = $("#conceptedit-datefield").val() == "" ? null : $("#conceptedit-datefield").val();
    concept.ui_Dropdown_DefaultMessage = $("#conceptedit-dropdowndefaultmessage").val() == "" ? null : $("#conceptedit-dropdowndefaultmessage").val();
    concept.ui_Numeric_DefaultMessage = $("#conceptedit-numericdefaultmessage").val() == "" ? null : $("#conceptedit-numericdefaultmessage").val();
    concept.ui_Dropdown_Elements = $("#conceptedit-dropdownelements").val() == "" ? null : $("#conceptedit-dropdownelements").val();


    return concept;
};

Leaf.Utils.updateQueryBuilderStatus = function (currentStatus) {

    var $queryButton = $("#get-count"),
        buttonText,
        glyphicon;

    /* 
        1 = Run Query
        2 = Cancel Query
        3 = Save Query
        4 = Query Saved
    */

    // If the user has changed the query criteria while executing a current query,
    // revert the current status to Cancel Query, which prevents the user from
    // intentionally or unintentionally running multiple queries at once
    if (Leaf.Xhr.Clinical.readyState == 1 && currentStatus == 1) {

        currentStatus = 2;
    }

    switch (currentStatus) {

        case 1:
            buttonText = "Run Query";
            glyphicon = "search";


            // Hide the visualize and patient list tabs
            $(".carousel-button-toggle")
                .addClass("hidden");
            $(".carousel-button-placeholder")
                .removeClass("hidden");

            break;

        case 2:
            buttonText = "Cancel Query";
            glyphicon = "remove";

            break;

        case 3:
            buttonText = "Save Query";
            glyphicon = "star";


            // Show the visualize and patient list tabs
            $(".carousel-button-toggle")
                .removeClass("hidden");
            $(".carousel-button-placeholder")
                .addClass("hidden");

            break;

        case 4:
            buttonText = "Query Saved";
            glyphicon = "star";
    }

    Leaf.Status.CurrentQueryBuilderStatus = currentStatus;

    $queryButton
        .html("<span class='glyphicon glyphicon-" + glyphicon + "' style='color: white; margin-right:8px;font-size:18px'></span>" + buttonText);
}

Leaf.Utils.addCommasToNumber = function (number) {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};

Leaf.Utils.sortAlphabetical = function (a, b) {

    if (a.ui_Display_Name === b.ui_Display_Name) {
        return 0
    }
    else {
        return (a.ui_Display_Name < b.ui_Display_Name) ? -1 : 1;
    }
};

Leaf.Utils.addSelectedAuxiliaryQueries = function (userCreatedQueries) {

    $.each(Leaf.AuxiliaryQueries, function (index) {

        var currentQuery = Leaf.AuxiliaryQueries[index];

        if (currentQuery.isChecked == true)
            userCreatedQueries.push(currentQuery.Panel);
    });

    return userCreatedQueries;
};

Leaf.Utils.getCurrentQueryConceptItems = function () {

    var conceptItems = [];

    for (var i = 0; i < Leaf.Panels.length; i++) {

        for (var j = 0; j < Leaf.Panels[i].SubPanels.length; j++) {

            for (var k = 0; k < Leaf.Panels[i].SubPanels[j].PanelItems.length; k++) {

                var currentConceptId = Leaf.Panels[i].SubPanels[j].PanelItems[k].ConceptID;

                conceptItems.push(Leaf.ConceptList[currentConceptId]);
            }
        }
    }

    return conceptItems;
};

Leaf.Utils.isNumeric = function (value) {

    return !isNaN(parseFloat(value)) && isFinite(value);
}

//================================================
// HTML generators 
//================================================
Leaf.HtmlGenerators.numericFilterPopover = function (selectedOperator, numericValue, additionalNumericValue) {

    //  the HTML will differ slightly if the operator is BETWEEN, so detect that first
    var isBetween = selectedOperator == "BETWEEN" ? true : false,
        inputHtml,
        additionalBetweenHtml;

    

    // set defaults if parameters not provided
    numericValue = numericValue || "";
    additionalNumericValue = additionalNumericValue || "";
    selectedOperator = selectedOperator || ">="

    inputHtml = "<input type='number' class='form-control numeric-filter-trigger" + (isBetween ? " numeric-filter-between" : "") + "' placeholder='" + (isBetween ? "Low Range" : "Enter Number") + "'>" +
                "<span class='glyphicon form-control-feedback'></span>";
                
     
    additionalBetweenHtml = "<span class='numeric-filter-between-text'>And</span>" +
                            "<div class='form-group has-feedback'>" +
                                "<input type='number' class='form-control numeric-filter-trigger numeric-filter-between' placeholder='High Range'>" +
                                "<span class='glyphicon form-control-feedback'></span>" +
                            "</div>"


    var newFilters = "<div>" +
                        "<div class='numeric-filter-wrapper'>" +
                            "<div class='" + (isBetween ? "form-inline " : "") + "numeric-filter-popover'>" +
                                "<div class='form-group has-feedback'>" +
                                    "<div class='input-group'>" +
                                        "<div class='input-group-btn'>" +
                                              "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                                              selectedOperator + "<span class='caret'></span>" + 
                                              "</button>" +
                                              "<ul class='dropdown-menu numeric-filter-trigger'>" +
                                                "<li value='>='><a>  >= </a></li>" +
                                                "<li value='>'> <a>  >  </a></li>" +
                                                "<li value='<='><a>  <= </a></li>" +
                                                "<li value='<'> <a>  <  </a></li>" +
                                                "<li value='='> <a>  =  </a></li>" +
                                                "<li value='BETWEEN'> <a>  Between  </a></li>" +
                                             "</ul>" +
                                        "</div>" + // end input group button
                                     inputHtml +
                                  "</div>" + // end input group
                             "</div>" + // end form group
                             (isBetween ? additionalBetweenHtml : "") +
                        "</div>" + // end form inline
                        "<div class='row'>" +
                            "<button class='btn leaf-btn-default pull-right popover-closer' type='button'>" +
                                 "Set Filter" +
                            "</button>" +
                            "<button class='btn leaf-btn-default pull-left numeric-filter-remove' type='button'>" +
                                 "Clear Filter" +
                            "</button>" +
                        "</div>" +
                   "</div>" +
                "</div>";

    var $newFilters = $(newFilters)

    $newFilters.find("input").eq(0).val(numericValue);

    if (numericValue != "") {

        Leaf.Ui.setInputValidationState($newFilters.find("input").eq(0), "has-success", "", "glyphicon-ok", "");
    }

    if (isBetween) {

        $newFilters.find("input").eq(1).val(additionalNumericValue);

        if (additionalNumericValue != "") {
            Leaf.Ui.setInputValidationState($newFilters.find("input").eq(1), "has-success", "", "glyphicon-ok", "");
        }
    }
    
    return $newFilters;
};

Leaf.HtmlGenerators.patientListDatasetsPopover = function (options) {

    var newOptions = "<div class='container popover'>";

    $.each(options, function (index) {

        var checked = "";

        if (options[index].visible) {
            checked = "checked";
        }

        newOptions += "<div class='row patientlist-column-checkbox'>" +
                                 "<div class='col-md-10 query-options-text'>" + options[index].name;
        newOptions += "</div>" +
                      "<div class='col-md-2 query-options-checkbox switch'><input type='checkbox' class='cmn-toggle cmn-toggle-round' id='patientlist-column-" + options[index].name + "' " + checked + ">" +
                      "<label for='patientlist-column-" + options[index].name + "'></label></div>" +
                      "</div>";

    });

    return newOptions;
};

/**
* Called when filtersPopover is closed, being initialized , but *not* when it is open
*/
Leaf.HtmlGenerators.filtersPopover = function (options) {
    if ( event != null ){
      console.log('filtersPopover event: ' + event.timeStamp + ' ' + event.type );
    }

    var newOptions = "<div class='container popover' id='query-options-wrapper'>";

    $.each(options, function (index) {    // for each filter.

        var checked = "";

        if (options[index].isChecked){
            checked = "checked";
        }
        
       var conceptList_KEY= '';
       var conceptList_ID = options[index].ID; // like cf_77
        if ( conceptList_ID.substring( 0, 3) == 'cf_' ) {
          conceptList_KEY = conceptList_ID.substring(  3 ); // like 77
        }        
        
            
        if (options[index].isActive) {
            newOptions += "<div class='row filter-toprow' "
            + 'conceptList_ID="'  + options[index].ID   + '" ' // like CF_77
            + 'conceptList_KEY="' + conceptList_KEY     + '" ' // like 77
            + '>'
            + "<div class='col-md-10 query-options-text'>" + options[index].QueryText;
            if (options[index].isCustomFilter) {
                newOptions += "<span class='glyphicon glyphicon-remove optional-filter'></span>" ;
            }
                newOptions += "</div>" +
                              "<div class='col-md-2 query-options-checkbox switch'><input type='checkbox' class='cmn-toggle cmn-toggle-round' id='" + options[index].ID + "' " + checked + ">" +
                              "<label for='" + options[index].ID + "'></label></div>" +
                              "</div>" +
                              "<div class='row filter-2ndrow'>" +
                                 "<div class='col-md-8 query-options-description'>" + options[index].QueryDescription + "</div>" +
                              "</div>";
        };
    });

    return newOptions;
};

Leaf.HtmlGenerators.subPanelInclusionDropdown = function () {

    var newDropdown = "<div class='dropdown in-filter-subpanel'>" +
                        "<a class='dropdown-toggle sub-header' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                        "And" +
                        "<span class='caret'></span>" +
                        "</a>" +
                        "<ul class='dropdown-menu'>" +
                        "<li value = '1'><a>And</a></li>" +
                        "<li value = '0'><a>And Not</a></li>" +
                        "</ul>" +
                        "</div>";

    return newDropdown;
};

Leaf.HtmlGenerators.panelItemDropdown = function (displayText) {

    var newDropDown = "<span class='dropdown panel-item-dropdown'>" +
                        "<a class='dropdown-toggle panel-item' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                        displayText +
                        "</a>" +
                        "<ul class='dropdown-menu'>" +
                        //"<li value = '1'><a class='a-disabled'><span class='glyphicon glyphicon-ok' style='margin-right:10px'></span>Include</a></li>" +
                        //"<li value = '0'><a><span class='glyphicon glyphicon-remove' style='margin-right:10px'></span>Exclude</a></li>" +
                        //"<li role='seperator' class='divider'></li>" +
                        "<li value = '2'><a><span class='glyphicon glyphicon-time' style='margin-right:10px'></span>Any Occurance</a></li>" +
                        "<li value = '3'><a><span class='glyphicon glyphicon-menu-up' style='margin-right:10px'></span>First Time</a></li>" +
                        "<li value = '4'><a><span class='glyphicon glyphicon-menu-down' style='margin-right:10px'></span>Most Recent Time</a></li>" +
                        "<li role='seperator' class='divider'></li>" +
                        "<li value = '-1'><a><span class='glyphicon glyphicon-trash' style='margin-right:10px'></span>Delete</a></li>" +
                        "</ul>" +
                        "</span>";

    return newDropDown;
}

Leaf.HtmlGenerators.subpanelTypeDropdown = function () {

    var newDropdown = "<div class='dropdown subpanel-type'>" +
                        "<a class='dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                        "In the Same Encounter" +
                        "<span class='caret'></span>" +
                        "</a>" +
                        "<ul class='dropdown-menu multi-level'>" +
                        "<li value = '0'><a>In the Same Encounter</a></li>" +
                        "<li value = '4'><a>In the Same Event</a></li>" +
                        "<li class='dropdown-submenu-right' value = '1'><a>Within +/-" +
                        "<input value='1' style='width:40px; margin-left:5px; text-align:center' type='number' class='input-small'>" +
                        "</a>" + Leaf.HtmlGenerators.dateTypeDropdown() +
                        "</li>" +
                        "<li class='dropdown-submenu-right' value = '2'><a>In the Following" +
                        "<input value='1' style='width:40px; margin-left:5px; text-align:center' type='number' class='input-small'>" +
                        "</a>" + Leaf.HtmlGenerators.dateTypeDropdown() +
                        "</li>" +
                        "<li value = '3'><a>Anytime Afterward</a></li>" +
                        "</ul>" +
                        "</div>";

    return newDropdown;
};

Leaf.HtmlGenerators.iterationOutput = function () {

    var iterationOutput = "<div class='iteration-output-wrapper'>" +
                           "<div class='row'>" +
                               "<div class='col-lg-4 col-md-4 iteration-output-metadata'>" +
                                    "<div>" +
                                    "</div>" +
                               "</div>" +
                               "<div class='col-lg-8 col-md-8 iteration-output-result'>" +
                               "</div>" +
                           "</div>" +
                           "<div class='row'>" +
                               "<div class='col-lg-12 col-md-12 iteration-output-description'>" +
                               "</div>" +
                           "</div>" +
                      "</div>";

    return iterationOutput;
};

Leaf.HtmlGenerators.iterationOutputArrow = function (direction) {

    var iterationOutputArrow = "<div class='iteration-output-arrow'>" +
                                 "<span class='glyphicon glyphicon-arrow-" + direction + "'></span>" +
                          "</div>" +
                          "<div class='iteration-output-ofthose'>" +
                                 "of those..." +
                                 "<img src='gif/leafajax_40124.gif' alt='' />" +
                          "</div>";

    return iterationOutputArrow;
};

Leaf.HtmlGenerators.dateTypeDropdown = function () {

    var newDateTypes = "<ul class='dropdown-menu'>" +
                        "<li value = 'MINUTE'><a>Minute(s)</a></li>" +
                        "<li value = 'HOUR'><a>Hour(s)</a></li>" +
                        "<li value = 'DAY'><a>Day(s)</a></li>" +
                        "<li value = 'WEEK'><a>Week(s)</a></li>" +
                        "<li value = 'MONTH'><a>Month(s)</a></li>" +
                        "<li value = 'YEAR'><a>Year(s)</a></li>" +
                        "</ul>";

    return newDateTypes;
};

Leaf.HtmlGenerators.havingFilter = function () {

    var newHaving = "<div class='dropdown count-filter'>";

    newHaving += "<a class='dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                 "At Least 1x<span class='caret'></span></a>";
    newHaving += "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>";

    for (var i = 1; i <= 10; i++) {
        newHaving += "<li value='" + i.toString() + "'><a >" + i.toString() + "x</a></li>";
    }

    newHaving += "</ul></div>";

    return newHaving;
};

Leaf.HtmlGenerators.panelItemModifier = function (defaultMessage) {

    var newModifier = "<span class='panel-item-modifier'>" + defaultMessage + "</span>";

    return newModifier;
};

Leaf.HtmlGenerators.panelItemCustomSqlDropdown = function (dropdownString, defaultMessage) {

    // Dropdowns are split into sections by a tilde ~, so first split into an array
    var stringArray = dropdownString.split("~"),
        $htmlOutput = $("<span class='dropdown panel-item-sqldropdown'>" +
                        "<a class='dropdown-toggle panel-item-modifier' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                        defaultMessage +
                        "</a>" +
                        "<ul class='dropdown-menu'>" +
                            "<li value = '0'><a>" + defaultMessage + "</a></li>" +
                            "<li role='seperator' class='divider'></li>" +
                        "</ul>" +
                       "</span>");

    for (var i = 0; i < stringArray.length; i++) {

        // The bar | splits between the display text and the SQL it represents
        var split = stringArray[i].split("|"),
            text = split[0],
            sql = split[1];

        var $li = $("<li><a>" + text + "</a></li>");

        $li
            .attr("value", sql);

        $htmlOutput
          .find("ul")
            .append($li);
    }

    return $htmlOutput;
};

Leaf.HtmlGenerators.loginHaveDocumentation = function (headerText) {

    var newButtonGroup = "<div class='login-section' id='login-documentation'>" 
                       + "<h4 id='btn-login-documentation-header'>" + headerText 
                       + "<span id='popoverHelpLogin_ApprovedQIDoc' data-toggle='collapse' href='#popoverHelpLogin_ApprovedQIDoc_div' class='glyphicon glyphicon-question-sign question-marks'></span>"
                       + "</h4>" 
					   
                       + "<div class='collapse well' id='popoverHelpLogin_ApprovedQIDoc_div'>"
                       + "<ul>"
                       + "<li>Do you have appropriate pre-approval and documentation for this activity?</li> "
                       + "<li>If in doubt, contact your manager.</li> "
                       + "</ul>"
                       + "</div>"
											
                       + "<div id='btn-login-documentation' class='btn-group btn-group-justified' data-toggle='buttons'>" 
					   + "<label class='btn leaf-btn-login leaf-btn-default'>" 
					   + "<input value='" + 0 + "' type='radio' name='options' autocomplete='off' checked>" + "No" 
					   + "</label>" 
				       + "<label class='btn leaf-btn-login leaf-btn-default'>" 
					   + "<input value='" + 1 + "' type='radio' name='options' autocomplete='off'>" + "Yes" 
					   + "</label>" 
					   + "</div>" 
					   + "</div>"
					   ;

    return newButtonGroup;
};

Leaf.HtmlGenerators.loginDocumentationInformation = function (documentationType) {
    var newFormGroup = "<div class='login-section' id='login-documentinfo'>"
                     + "<div class='form-group'>"
                     + "<label for='documentation-id'>" + documentationType + "</label>" 
                     + "<input type='text' class='form-control' id='documentation-id' placeholder='" + documentationType + "'>" 
		     + "</div>" 
		     + "<div class='form-group'>" 
		     + "<label for='documentation-institution'>Approving Institution</label>" 
		     + "<input type='text' class='form-control' id='documentation-institution' placeholder='e.g. UW HSD'>" 
		     + "</div>" 
		     + "<div class='form-group'>" 
		     + "<label for='documentation-date'>Expiration Date</label>" 
		     + "<input type='text' class='form-control' id='documentation-date' placeholder='MM/DD/YYYY'>" 
		     + "</div>" 
		     + "<p id='documentation-status'></p>" 
		     + "</div>";

    return newFormGroup;
};

Leaf.HtmlGenerators.loginPurposeOther = function () {

    var newTextArea = "<div class='login-section'>" +
                            "<h4>Please explain the purpose of your use. If you intend to view identified data, please indicate why de-identified data is insufficient</h4>" +
                            "<textarea class='form-control' rows='3' name='login-purposeother' id='login-purposeother'></textarea>" +
                            "</div>";

    return newTextArea;
};

Leaf.HtmlGenerators.loginIdentificationType = function (identifiedIsDisabled) {

    identifiedIsDisabled = Leaf.Session.isDeidentifiedOnlyUser ? true : identifiedIsDisabled;

    var identifiedIsDisabled = identifiedIsDisabled ? "display-only" : "";

    var newButtonGroup = "<div class='login-section' id='login-identificationtype'>" 
                       + "<h4 id='btn-login-identification-header'>I would like Protected Health Information" 
                       + "<span id='popoverHelpLogin_IdentificationType' data-toggle='collapse' href='#popoverHelpLogin_IdentificationType_div' class='glyphicon glyphicon-question-sign question-marks'></span>"
                       + "</h4>"
						+ "<div class='collapse well' id='popoverHelpLogin_IdentificationType_div'>"
						+ "<ul>"
						+ "<li>You may choose to view Identified information, depending on your authorizations, and your previous answers. </li>"
		                + "<li>In De-Identified mode, Patient identifiers are removed, dates shifted, and certain other data is encrypted or denied.</li>"
						+ "</ul>"
						+ "</div>"
                       + "<div id='btn-login-identification' class='btn-group btn-group-justified' data-toggle='buttons'>" 
                       + "<label class='btn leaf-btn-login leaf-btn-default'>" 
                       + "<input value='De-Identified' type='radio' name='options' id='option1' autocomplete='off' checked>" + "De-Identified" 
                       + "</label>" 
                       + "<label class='btn leaf-btn-login leaf-btn-default " + identifiedIsDisabled + "'>" 
                       + "<input value='Identified' type='radio' name='options' autocomplete='off'>" + "Identified" 
                       + "</label>" 
                       + "</div>";

    return newButtonGroup;
};

Leaf.HtmlGenerators.RCImportChooseMrnField = function () {

    var template = "<p>" +
                        "Great, your API Token worked!" +
                   "</p>" +
                   "<p>" +
                        "Next, please select the field in your Project that holds the UW MRN for each patient. " +
                        "Remember, Leaf will only import data for patients for which it finds a matching MRN. Any " +
                        "records without a matching MRN in the system will not be imported." +
                   "</p>" +
                   "<div class='rcimport-input-wrapper'>" +
                        "<div class='form-group has-feedback'>" +
                            "<label for='rcimport-MRN' class='col-md-2 col-lg-2 control-label'>Project MRN field</label>" +
                            "<input type='text' class='typeahead form-control' id='rcimport-mrn' placeholder='Enter MRN field...'>" +
                            "<span class='glyphicon form-control-feedback'></span>" +
                        "</div>" +
                   "</div>";

    return template;

};

Leaf.HtmlGenerators.RCImportAddToken = function () {


    var template = "<p>" +
                            "One of Leaf's most powerful features is the REDCap Project Import tool, " +
                            "which allows you to copy live project data directly from REDCap into Leaf, " +
                            "tying patient data in REDCap to data for the same patients in the Clinical " +
                            "Data Warehouse (Amalga)." +
                        "</p>" +
                        "<p>" +
                            "In order to import your Project, you must enter your REDCap Project Token and tell Leaf which field in your project represents " +
                            "UW MRNs ( e.g. U1234567 or H987654 ), and Leaf will import your Project." +
                        "</p>" +
                        "<p>" +
                            "<strong>Your Project will only be visible to you and the same users that can already access your existing REDCap Project.</strong>" +
                        "</p>" +
                        "<div class='rcimport-input-wrapper'>" +
                            "<div class='form-group'>" +
                                "<label for='rcimport-token' class='col-md-2 col-lg-2 control-label'>REDCap API Token</label>" +
                                "<input type='text' class='form-control' id='rcimport-token' placeholder='Enter Token here...'>" +
                            "</div>" +
                        "</div>" /*+
                        "<div class='row'>" +
                            "<div class='col-md-5 col-lg-5 rcimport-example-wrapper'>" +
                                "<span class='rcimport-ref'>REDCap data</span>" +
                                "<img id='img-rcimport-example'  src='css/ExampleRCProject.jpg'>" +
                            "</div>" +
                            "<div class='col-md-2 col-lg-2 text-center'>" +
                                "<span class='glyphicon glyphicon-arrow-right'></span>" +
                            "</div>" +
                            "<div class='col-md-5 col-lg-5 rcimport-example-wrapper'>" +
                                "<span class='rcimport-ref'>Imported into Leaf</span>" +
                                "<div id='rcimport-example-tree'>" +
                                "</div>" +
                            "</div>" +
                        "</div>"*/;

    return template;
};

Leaf.HtmlGenerators.RCImportAddForms = function (forms) {

    var template = "<p>Okay, the final stretch!</p>" +
                      "<p>This last step is <strong>optional but strongly recommended!</strong> Please select a date field in each form to represent the date for that form. " +
                      " For example, if you have a Project form for lab values, you can use this feature to tie " +
                      "queries for the lab values to the lab date.</p>";


    for (var i = 0; i < forms.length; i++) {

        template += "<div class='form-group rcimport-formdate has-feedback'>" +
                        "<label></label>" +
                        "<input type='text' class='form-control typeahead' placeholder='Enter Date Field (Optional)'>" +
                        "<span class='glyphicon form-control-feedback'></span>" +
                      "</div>";
    }

    return template;
}

Leaf.HtmlGenerators.RCImportSummary = function (summaryData) {


    var template = "<p>Your REDCap Project was successfully imported!</p>" +
                   "<p><strong>Your imported data can be found in the Concept List under the " +
                   "My REDCap Imports folder</strong>, and will only be visible to you and any user able to access your existing REDCap Project.</p>";


    template += "<table class='rcimport-summary'>" +
                      "<tbody>" +
                        "<tr>" +
                            "<td>" + Leaf.Utils.addCommasToNumber(summaryData.TotalPatientsAdded) + "</td>" +
                            "<td>" + Leaf.Utils.addCommasToNumber(summaryData.TotalDataRowsAdded) + "</td>" +
                            "<td>" + Leaf.Utils.addCommasToNumber(summaryData.TotalPatientsDeleted) + "</td>" +
                       "</tr>" +
                        "<tr>" +
                            "<th>Patients Added</th>" +
                            "<th>Data Rows Added</th>" +
                            "<th>Patients Not Imported</th>" +
                        "</tr>" +
                    "</tbody>" +
                  "</table>" +
                  "<div class='row rcimport-summary-users'>" + summaryData.UsersWithAccess + "</div>" +
                  "<p class='rcimport-summary-userstext'>Permitted Users</p>";

    return template;

};

Leaf.HtmlGenerators.myQueriesSummaryTable = function () {

    var savedQueries = "";

    $.each(Leaf.SavedQueries.List, function (index) {

        savedQueries += "<tr>" +
                            "<td>" + Leaf.SavedQueries.List[index].SavedQueryID + "</td>" +
                            "<td>" + Leaf.SavedQueries.List[index].QueryName + "</td>" +
                            "<td>" + Leaf.SavedQueries.List[index].QueryCategory + "</td>" +
                            "<td>" + Leaf.SavedQueries.List[index].CurrentPatientCount + "</td>" +
                            "<td>" + Leaf.SavedQueries.List[index].CreateDateTime + "</td>" +
                            "<td>" + Leaf.SavedQueries.List[index].LastRefreshDateTime + "</td>" +
                            "<td>" + Leaf.SavedQueries.List[index].UserID + "</td>" +
                            "<td>" + "<span class='myqueries-open'>Open</span>" + "</td>" +
                            "<td>" + "<span class='glyphicon glyphicon-remove'></span>" + "</td>" +
                        "</tr>";
    })


    var template = "<table id='myqueries-table' class='myqueries-table table table-hover'>" +
                        "<thead>" +
                            "<tr>" +
                                "<th>ID</th>" +
                                "<th>Query Name</th>" +
                                "<th>Category</th>" +
                                "<th>Total Patients</th>" +
                                "<th>Created Date</th>" +
                                "<th>Last Refreshed Date</th>" +
                                "<th>UserID</th>" +
                                "<th></th>" +
                                "<th></th>" +
                            "</tr>" +
                        "</thead>" +
                        "<tbody>" +
                            savedQueries +
                        "</tbody>" +
                    "</table>";

    return template;

};

Leaf.HtmlGenerators.RCImportProjectsTable = function () {


    var projects = "";


    $.each(Leaf.RCImport.Projects, function (index) {
    
        projects += "<tr>" +
                        "<td>" + Leaf.RCImport.Projects[index].ProjectTitle + "</td>" +
                        "<td>" + Leaf.RCImport.Projects[index].REDCapProjectID + "</td>" +
                        "<td>" + Leaf.RCImport.Projects[index].ProjectImporter + "</td>" +
                        "<td>" + Leaf.RCImport.Projects[index].ProjectImportDateTime + "</td>" +
                        "<td class='wordwrap'>" + Leaf.RCImport.Projects[index].UsersWithAccess + "</td>" +
                        "<td>" + "<span class='glyphicon glyphicon-remove'></span>" + "</td>" +
                    "</tr>";
    })


    var template = "<table id='rcimport-projects' class='rcimport-projects table table-hover'>" +
                        "<thead>" +
                            "<tr>" +
                                "<th>Project Name</th>" +
                                "<th>Project ID</th>" +
                                "<th>Imported By</th>" +
                                "<th>Import Date</th>" +
                                "<th>Permitted Users</th>" +
                                "<th></th>" +
                            "</tr>" +
                        "</thead>" +
                        "<tbody>" +
                            projects +
                        "</tbody>" +
                    "</table>";

    return template;
};

Leaf.HtmlGenerators.otherLanguagesTooltip = function (languages) {

    var template = "";

    for (var i = 0; i < languages.length; i++) {

        template += "<p class='tooltip-body-limitheight'>" + languages[i].Language + " - " + languages[i].TotalPatients + "</p>";
    }

    return template;
}
//================================================
// Models
//================================================
Leaf.Models.Panel = function () {
    this.SubPanels = [];
    this.PanelItemCount = 0;
    this.PanelType = 1;
    this.isDateFiltered = false;
    this.DateFrom = "";
    this.DateTo = "";
    this.includePanel = true;
    this.Domain = "Panel"
};

Leaf.Models.SubPanel = function () {
    this.PanelItems = [];
    this.includePanel = true;
    this.hasCountFilter = false;
    this.MinimumCount = 0;
    this.DateRangeType = "DAY";
    this.DateRangeNumber = 0;
    this.SequenceType = 0;
};

Leaf.Models.PanelItem = function () {
    this.ConceptID = "";
    this.SqlSetName = "";
    this.SqlWhereClause = "";
    this.SqlFieldDate = "";
    this.SqlFieldText = "";
    this.SqlFieldNumeric = "";
    this.SqlEqualityOperator = "";
    this.SqlNumericFilter = "";
    this.SqlTextFilter = "";
    this.useTextFilter = false;
    this.useNumericFilter = false;
    this.useDropdownElement = false;
    this.SqlDropdown = "";
    this.useRecencyFilter = false;
    this.SqlRecencyFilter = "";
    this.isEncounterBased = true;
};

//================================================
// Ui
//================================================


/**
Populates the Find Patients view with the contents of a query.
Takes a blank Find Patients screen, and populates the panels and filters.
*/
Leaf.Ui.setQueryDefinition = function (queryDefinition, conceptItems, queryFilterItems) {

    // disable all query filters in Leaf.AuxiliaryQueries 
    $.each(Leaf.AuxiliaryQueries, function (index) {
      Leaf.AuxiliaryQueries[index].isChecked = false;
    });
    
    if (queryFilterItems != null){              // Were any filters saved in the query ? 
      Leaf.AuxiliaryQueries = queryFilterItems; // Yes, Replace our current filters.
    }
      
    // Turn on the popups for any enabled filters
    Leaf.Utils.SetFilterPopups( Leaf.AuxiliaryQueries );
    


    if (conceptItems != null) {
        Leaf.Utils.addToConceptList(conceptItems);
    }

    for (var panel = 0; panel < queryDefinition.length; panel++) {

        Leaf.Ui.setPanelInclusion(panel, queryDefinition[panel].includePanel);

        if (queryDefinition[panel].isDateFiltered) {
            Leaf.Ui.setPanelDateFilter(panel, queryDefinition[panel].DateFrom, queryDefinition[panel].DateTo, queryDefinition[panel].isDateFiltered)
        }

        for (var subpanel = 0; subpanel < queryDefinition[panel].SubPanels.length; subpanel++) {

            for (var panelItem = 0; panelItem < queryDefinition[panel].SubPanels[subpanel].PanelItems.length; panelItem++) {

                var conceptID = queryDefinition[panel].SubPanels[subpanel].PanelItems[panelItem].ConceptID;

                Leaf.Ui.addPanelItem(conceptID, panel, subpanel);

                if (queryDefinition[panel].SubPanels[subpanel].PanelItems[panelItem].useRecencyFilter) {
                    Leaf.Ui.setPanelItemRecencyFilter(panel, subpanel, panelItem, queryDefinition[panel].SubPanels[subpanel].PanelItems[panelItem].useRecencyFilter, queryDefinition[panel].SubPanels[subpanel].PanelItems[panelItem].SqlRecencyFilter);
                }

                if (queryDefinition[panel].SubPanels[subpanel].PanelItems[panelItem].useNumericFilter) {
                    Leaf.Ui.setPanelItemNumericFilter(panel, subpanel, panelItem, queryDefinition[panel].SubPanels[subpanel].PanelItems[panelItem].SqlEqualityOperator, queryDefinition[panel].SubPanels[subpanel].PanelItems[panelItem].SqlNumericFilter, queryDefinition[panel].SubPanels[subpanel].PanelItems[panelItem].useNumericFilter);
                }

                if (queryDefinition[panel].SubPanels[subpanel].PanelItems[panelItem].useDropdownElement) {
                    Leaf.Ui.setPanelItemSqlDropdownFilter(panel, subpanel, panelItem, null, queryDefinition[panel].SubPanels[subpanel].PanelItems[panelItem].SqlDropdown, queryDefinition[panel].SubPanels[subpanel].PanelItems[panelItem].useDropdownElement);
                }
            }

            if (queryDefinition[panel].SubPanels[subpanel].hasCountFilter) {
                Leaf.Ui.setCountFilter(panel, subpanel, queryDefinition[panel].SubPanels[subpanel].MinimumCount)
            }

            if (!queryDefinition[panel].SubPanels[subpanel].includePanel) {
                Leaf.Ui.setSubPanelInclusion(panel, subpanel, queryDefinition[panel].SubPanels[subpanel].includePanel);
            }

            Leaf.Ui.setSubPanelType(panel, subpanel, queryDefinition[panel].SubPanels[subpanel].SequenceType, queryDefinition[panel].SubPanels[subpanel].DateRangeType, queryDefinition[panel].SubPanels[subpanel].DateRangeNumber);
        };
    };
};


/**
* Sets the filter popups above the Panels, for filters that are selected.
*/
Leaf.Utils.SetFilterPopups = function ( AuxiliaryQueries_Data ) {
    // remove all filters from the UI
    $(".filter-highlight").remove();
    
    // Then add all the active filters to the UI
    if ( AuxiliaryQueries_Data != null ){
      Leaf.Ui.Reset_Optional_Filters( AuxiliaryQueries_Data );
      for ( var qfi in AuxiliaryQueries_Data ){
        var filterID = qfi;
        var is_filter_checked = AuxiliaryQueries_Data[filterID].isChecked;    

        if ( is_filter_checked === true ){
          $("#" + filterID).prop("checked", is_filter_checked);
          var $newHighlight = Leaf.Ui.Build_newHightlight( filterID, Leaf.AuxiliaryQueries[filterID].QueryText );
          $("#btn-options").append($newHighlight);
        
          Leaf.Utils.updateQueryBuilderStatus(1);         
          }
       }
    }
};


Leaf.Ui.Build_newHightlight = function( filterID, filter_text ){
  var $newHighlight = $("<button id='filter-" + filterID + "' class='filter-highlight'>" + filter_text + "</button>")
    .hide()
    .fadeIn(250);
  $newHighlight.data("id", filterID);
  return $newHighlight;  
};
          
Leaf.Ui.Reset_Optional_Filters = function ( AuxiliaryQueries_Data, reset_filterID ){
    if ( reset_filterID == undefined ) {
      var $optionButton = $("#btn-options")
      .find("button"),
      $queriesHtml = $(Leaf.HtmlGenerators.filtersPopover( AuxiliaryQueries_Data ));
    } else {
    var $optionButton = $("#btn-options")
      .find("button"),
      $queriesHtml = $(Leaf.HtmlGenerators.filtersPopover( AuxiliaryQueries_Data )),
      $toggle = $("#" + reset_filterID);
      $toggle.prop("checked", false);
    }

    // Set the popover
    $optionButton
    .data("bs.popover")
    .options
    .content = $queriesHtml.html();

    $optionButton
    .data("bs.popover")
    .tip()
    .addClass("customFilter-popover");
};



Leaf.Ui.openUpdatingModal = function (headerText, bodyText) {

    var $modal = $("#modal-patientlist-updating"),
        $header = $("#modal-patientlist-header"),
        $text = $("#modal-patientlist-text");

    $modal.modal("show");
    $header.text(headerText);
    $text.text(bodyText);
};

Leaf.Ui.syncSaveQueryPreviewTree = function (queryText, categoryText) {

    var $previewTree = $("#query-previewtree").jstree(true),
        $categoryNode = $previewTree.get_node("category"),
        $queryNode = $previewTree.get_node("query"),
        queryConcept = {};



    // override the category and query names if they are blank
    categoryText = categoryText === "" ? "New Category" : categoryText;
    queryText = queryText === "" ? "New Query" : queryText;
    queryConcept.PatientCount = Leaf.Status.CurrentTotalPatients;
    queryConcept.text = queryText;


    // update the current query name in the upper left
    $("#current-query-name")
      .find("strong")
        .html(queryText);


    queryText = Leaf.Ui.setConceptDisplay(queryConcept);

    // update the nodes to the current names
    $previewTree.rename_node($categoryNode, categoryText);
    $previewTree.rename_node($queryNode, queryText);

};

Leaf.Ui.moveConcept = function (concept) {

    var $maintree = $("#list-parent").jstree(true),
        $searchtree = $("#list-search").jstree(true),
        $mainnode = $maintree.get_node(concept.id),
        $searchnode = $searchtree.get_node(concept.id);


    // add or move the node into the main tree
    if ($mainnode == false) {

        $maintree.create_node(concept.parent, { id: concept.id, text: Leaf.Ui.setConceptDisplay(concept) }, "last");
    }
    else if ($mainnode.parent != concept.parent) {

        $maintree.move_node($mainnode, $maintree.get_node(concept.parent), "last");
    }

    $maintree.rename_node($mainnode, Leaf.Ui.setConceptDisplay(concept));


    // add or move the node into the search tree
    if ($searchnode == false) {

        $searchtree.create_node(concept.parent, { id: concept.id, text: Leaf.Ui.setConceptDisplay(concept) }, "last");
    }
    else if ($searchnode.parent != concept.parent) {

        $searchtree.move_node($searchnode, $searchtree.get_node(concept.parent), "last");
    }

    $searchtree.rename_node($searchnode, Leaf.Ui.setConceptDisplay(concept));
};

Leaf.Ui.lockOrUnlockConceptWiki = function (isLocked) {

    // lock or unlock each input based on the isLocked parameter
    $("#modal-conceptWiki .cmn-toggle").prop("disabled", isLocked);
    $("#modal-conceptWiki input,#modal-conceptWiki textarea").prop("readonly", isLocked);


    // the concept ID property should never be set by a user or admin, so revert that back to locked 
    $("#conceptedit-id").prop("readonly", true);


    var $editButton = $("#btn-conceptWiki-edit");

    if (isLocked) {

        // revert edit button text to edit
        $editButton.text("Edit Concept");


        $("#modal-conceptWiki h3").text("Concept Wiki");


        // hide the save button
        $("#btn-conceptWiki-saveedit").hide();


        // revert the close button text to close
        $("#btn-conceptWiki-close").text("Close");


        // display the edit button if user is an admin
        if (Leaf.Session.isAdmin) {

            $editButton.show();
        }
        else {

            $editButton.hide();
        }
    }
    else {

        // revert to the edit button text to cancel edit
        $editButton.text("Cancel Edit");
        $("#modal-conceptWiki h3").text("Add/Edit Concept");

        // show the save button
        $("#btn-conceptWiki-saveedit").show();
        $("#btn-conceptWiki-close").text("Cancel");
    }

};

Leaf.Ui.clearConceptWiki = function () {

    // unlock the concept menu for editing
    Leaf.Ui.lockOrUnlockConceptWiki(false);


    // default all inputs 
    $("#modal-conceptWiki .cmn-toggle").prop("checked", false);
    $("#modal-conceptWiki input,#modal-conceptWiki textarea").val("");
};

Leaf.Ui.populateConceptWikiWithConceptInfo = function (conceptId) {

    $("#conceptedit-id").val(Leaf.ConceptList[conceptId].id);
    $("#conceptedit-parentid").val(Leaf.ConceptList[conceptId].parent);
    $("#conceptedit-name").val(Leaf.ConceptList[conceptId].ui_Display_Name);
    $("#conceptedit-permitteduser").val(Leaf.ConceptList[conceptId].PermittedUserOrGroup);
    $("#conceptedit-text").val(Leaf.ConceptList[conceptId].ui_Display_Text);
    $("#conceptedit-patientcount").val(Leaf.ConceptList[conceptId].PatientCount);
    $("#conceptedit-encounterbased").prop("checked", Leaf.ConceptList[conceptId].is_EncounterBased);
    $("#conceptedit-eventbased").prop("checked", Leaf.ConceptList[conceptId].is_EventBased);
    $("#conceptedit-numeric").prop("checked", Leaf.ConceptList[conceptId].is_Numeric);
    $("#conceptedit-parent").prop("checked", Leaf.ConceptList[conceptId].is_Parent);
    $("#conceptedit-hasdropdown").prop("checked", Leaf.ConceptList[conceptId].has_Dropdown);
    $("#conceptedit-sqlsetname").val(Leaf.ConceptList[conceptId].sql_Set_Name);
    $("#conceptedit-sqlwhereclause").val(Leaf.ConceptList[conceptId].sql_WhereClause);
    $("#conceptedit-tooltip").val(Leaf.ConceptList[conceptId].ui_Display_Tooltip);
    $("#conceptedit-numericfield").val(Leaf.ConceptList[conceptId].sql_Field_Numeric);
    $("#conceptedit-datefield").val(Leaf.ConceptList[conceptId].sql_Field_Date);
    $("#conceptedit-eventfield").val(Leaf.ConceptList[conceptId].sql_Field_Event);
    $("#conceptedit-dropdowndefaultmessage").val(Leaf.ConceptList[conceptId].ui_Dropdown_DefaultMessage);
    $("#conceptedit-numericdefaultmessage").val(Leaf.ConceptList[conceptId].ui_Numeric_DefaultMessage);
    $("#conceptedit-dropdownelements").val(Leaf.ConceptList[conceptId].ui_Dropdown_Elements);
};


/**
* Create the right-click menu for the Concept List
*/
Leaf.Ui.createConceptContextMenu = function ($node) {
    var options = {
        conceptWiki: {
            separator_before: false,
            separator_after: false,
            label: "About Concept",
            icon: "glyphicon glyphicon-info-sign",
            action: function () {

                // fill the modal data with properties for the selected node
                Leaf.Ui.populateConceptWikiWithConceptInfo($node.id);


                // lock the concept menu for editing
                Leaf.Ui.lockOrUnlockConceptWiki(true);


                // show the modal
                $("#modal-conceptWiki").modal("show");
            }
        },
        customFilter: {
            separator_before: false,
            separator_after: false,
            label: "Add as Filter",
            icon: "glyphicon glyphicon-tag",
            action: function () {
                var filterName = Leaf.ConceptList[$node.id].ui_Display_Name,
                    filterText = Leaf.ConceptList[$node.id].ui_Display_Text,
                    conceptID = $node.id,
                    isActive = true;
                Leaf.Ajax.addCustomFilter(filterName, filterText, conceptID, isActive);
                var $optionButton = $("#btn-options").find("button");
                $optionButton.popover("hide");
            }
        }
    };

    if (Leaf.Session.isAdmin) {

        options.addChildConcept = {

            separator_before: true,
            separator_after: false,
            label: "Add Child Concept",
            icon: "glyphicon glyphicon-plus-sign",
            action: function () {


                // unlock the concept menu for editing
                Leaf.Ui.lockOrUnlockConceptWiki(false);


                // default all inputs and add in the parent ID
                Leaf.Ui.clearConceptWiki();

                $("#conceptedit-parentid")
                    .val($node.id)
                    .prop("readonly", true);

                $("#modal-conceptWiki").modal("show");
            }

        };

        options.addSiblingConcept = {

            separator_before: false,
            separator_after: false,
            label: "Add Sibling Concept",
            icon: "glyphicon glyphicon-plus-sign",
            action: function () {


                // unlock the concept menu for editing
                Leaf.Ui.lockOrUnlockConceptWiki(false);


                // default all inputs and add in the parent ID
                Leaf.Ui.clearConceptWiki();

                $("#conceptedit-parentid")
                    .val($node.parent)
                    .prop("readonly", true);

                $("#modal-conceptWiki").modal("show");
            }

        };

        options.removeConcept = {

            separator_before: true,
            separator_after: false,
            label: "Remove Concept",
            icon: "glyphicon glyphicon-remove-sign",
            action: function () {


                var concept = Leaf.ConceptList[$node.id];

                var afterSaveCallBack = function (node) {
                    $("#list-parent").jstree("delete_node", node);
                    $("#list-search").jstree("delete_node", node);
                },
                    onYes = function () {
                        Leaf.Ui.openUpdatingModal("Concept Editor", "Removing Concept...");
                        Leaf.Ajax.saveConcept(concept, false, afterSaveCallBack);
                    },
                    onNo = function () { },
                    bodyText = "Are you sure you want to remove the concept " + concept.ui_Display_Name + " (ID:" + concept.id + ")? Note: this action will only disable the concept from the concept list. " +
                               "Actual concept deletions can only be performed from the database via SQL.";

                Leaf.Ui.openConfirmationModal("Remove Concept", bodyText, onYes, onNo, "Yes, Remove Concept", "No");
            }
        }
    }

    return options;

};



Leaf.Ui.initializeUserInterface = function () {

    // Prompt the user for login
    $("#modal-login").addClass("fade");

    $("#ajax-load-login").hide();

    $("#modal-confirmation")
        .modal("hide");

    //make sure the highlight is the same height as the node text
    $("#list-parent,#list-search").bind("hover_node.jstree", function () {
        var $bar = $(this).find(".jstree-wholerow-hovered");

        $bar.css("height", $bar.parent().children("a.jstree-anchor").height() + "px");
    });

    $("#resultCarousel").carousel({
        pause: true,
        interval: false,
        keyboard: false
    });

    // Initialize the date pickers
    $(".datetimepicker").datetimepicker({
        inline: true,
        sideBySide: false,
        format: "MM/DD/YYYY"
    });

    $("#modal-myleaf")
        .modal("hide");

    $("#modal-frequent")
    .modal("hide");

    $("#iteration-modal")
        .modal("hide");

    $("#modal-save-query")
        .modal("hide");

    $("#processing-modal")
        .modal("hide");

    // Hide the save query progress bar
    $("#progress-save-query")
        .prop("hidden", true);

    // Hide the search Concept List for now
    $("#list-search")
        .hide();

    // Hide all ajax loading gifs
    $(".ajax-loader")
        .hide();

    // Set up the panel objects
    var $newSubpanel = $("<div></div>")
                           .addClass("panel-body")
                           .data("subpanelID", 0);

    // Append the subpanel and panel-body-fillers
    $("#resultCarousel .panel-default")
        .append($newSubpanel);
    $("#resultCarousel .panel-body")
        .append("<div class='panel-body-filler'></div>");

    // Hide the visualize and patient list tabs
    $(".carousel-button-toggle")
        .addClass("hidden");


    // initialize popovers
    $("#popoverHelpConceptList").popover({
        trigger: "hover",
        html: "true",
        placement: "bottom",
        content: function () {
            return $('#popoverHelpConceptList-container').html();
        },
        // We specify a template in order to set a class (an ID is overwritten) to the popover for styling purposes
        // Add display:none to turn off the arrow when the box is repositioned
        template: '<div class="popover popoverHelpConceptList" role="tooltip"><div class="arrow" style="display:none" ></div><div class="popover-content"></div></div>'
    });

    $("#popoverHelpQueryCriteria").popover({
        content: Leaf.QuestionMarkHelp.PopoverHelpQueryCriteria_Content,
        trigger: "hover"
    });

    $("#popoverHelpMyLeaf_ImportProj").popover({
        content: Leaf.QuestionMarkHelp.popoverHelpMyLeaf_ImportProj_Content,
        placement: "bottom",
        trigger: "hover"
    });

    $("#popoverHelpMyLeaf_MyImported").popover({
        content: Leaf.QuestionMarkHelp.popoverHelpMyLeaf_MyImported_Content,
        placement: "bottom",
        trigger: "hover"
    });

    $("#popoverHelpMyLeaf_MyQueries").popover({
        content: Leaf.QuestionMarkHelp.popoverHelpMyLeaf_MyQueries_Content,
        trigger: "hover"
    });

    $("#popoverHelpPL_Search").popover({
        content: Leaf.QuestionMarkHelp.popoverHelpPL_Search_Content,
        placement: "top",
        trigger: "hover"
    });

    $("#popoverHelpPL_SavedView").popover({
        content: Leaf.QuestionMarkHelp.popoverHelpPL_SavedView_Content,
        placement: "top",
        html: "true",
        trigger: "hover"
    });

    $("#popoverHelpPL_PatientList").popover({
        content: Leaf.QuestionMarkHelp.popoverHelpPL_PatientList_Content,
        html: "true",
        trigger: "hover"
    });


    $("#popoverHelpPL_Datasets").popover({
        content: Leaf.QuestionMarkHelp.popoverHelpPL_Datasets_Content,
        html: "true",
        trigger: "hover"
    });

    $("#popoverHelpLogin_Filters").popover({
        content: Leaf.QuestionMarkHelp.popoverHelpLogin_Filters_Content,
        html: "true",
        trigger: "hover"
    });
};

Leaf.Ui.confirmConceptMove = function (id, parent) {


    var concept = JSON.parse(JSON.stringify(Leaf.ConceptList[id])),
        newParent = parent == "#" ? parent : Leaf.ConceptList[parent],
        conceptText = concept.ui_Display_Name + " (ID " + concept.id + ")",
        newParentText = newParent == "#" ? "Concept List Root Concepts" : newParent.ui_Display_Name + " (ID " + newParent.id + ")";

    concept.parent = newParent == "#" ? "#" : newParent.id;

    var onYes = function () {
        Leaf.Ui.openUpdatingModal("Concept Editor", "Moving Concept...");
        Leaf.Ajax.saveConcept(concept, true, Leaf.Ui.moveConcept);
    },
        onNo = function () { Leaf.Ui.moveConcept(Leaf.ConceptList[id]); },
        bodyText = "Are you sure you want to move the concept " + conceptText + " under " + newParentText + "?" +
                   " This will take immediate effect and be visible to users.";

    Leaf.Ui.openConfirmationModal("Move Concept", bodyText, onYes, onNo, "Yes, Move Concept", "No");
};

Leaf.Ui.setConceptDisplay = function (concept) {

    var patientCount = concept.PatientCount === "" || concept.PatientCount == null  ? ""
                                                        : "<span class='concept-patientcount'><span class='glyphicon glyphicon-user'></span>" + concept.PatientCount + "</span>";
    var textContainer = "<span" + (concept.PatientCount == "0" ? " class='no-patients'" : "") + ">" + concept.text + "</span>";

    return (textContainer + patientCount);
};

Leaf.Ui.initializeConceptTrees = function () {

    var tooltipDelayInSeconds = 1500;

    // Primary Concept List
    $("#list-parent")

        .on("move_node.jstree", function (node, parent, data) {


            // jstree seems to have a bug with finding children of the root node, so work around here
            parent.parent = parent.parent == "#" ? Leaf.Status.LatestHoveredNode : parent.parent;

            var concept = Leaf.ConceptList[parent.node.id],
                newParent = parent.parent,
                oldParent = concept.parent;


            Leaf.Ui.moveConcept(concept);


            if (newParent != oldParent) {

                if (Leaf.Session.isAdmin) {

                    Leaf.Ui.confirmConceptMove(concept.id, newParent);
                }
            }
        })

        .on("dehover_node.jstree", function (node, data) {

            var id = data.node.id;

            $(".tooltip").tooltip("destroy");
        })

        .on("hover_node.jstree", function (node, data) {

            var id = data.node.id,
                concept = Leaf.ConceptList[id],
                title = concept.ui_Display_Name,
                body = concept.ui_Display_Tooltip || "No information provided for this concept",
                separator = "<div class='tooltip-separator'></div>";

            Leaf.Status.LatestHoveredNode = id;

            var $node = $("#" + id + ".jstree-node");

            $node.tooltip({
                html: true,
                title: "<p class='tooltip-title'>" + title + "</p>" + separator + "<p class='tooltip-body'>" + body + "</p>",
                trigger: "hover",
                delay: { "show": tooltipDelayInSeconds, "hide": 0 },
                container: "body",
                placement: "top"
            });
            // $node.tooltip("show");
        })

        .jstree({
            core: {
                check_callback: true,
                data: function (node, cb) {

                    var pNode;

                    pNode = node.id;

                    var nodeObject = {
                        parentNode: pNode,
                        authToken: Leaf.Session.AuthToken
                    };

                    $.ajax({
                        type: "POST",
                        url: uriPrefix + "AppMetaData",
                        contentType: "application/json; charset=utf-8",
                        async: true,
                        cache: false,
                        data: JSON.stringify(nodeObject),
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);
                        },
                        success: function (data) {

                            var topParents = [],
                                standardConcepts = [];

                            var newConcepts = data["GetAppMetaDataResult"]; 
                            Leaf.Utils.addToConceptList(newConcepts);

                            $.each(newConcepts, function (i) {

                                newConcepts[i].text = Leaf.Ui.setConceptDisplay(newConcepts[i]);

                                // Set 1 of 4 icon combos - clock-blue, clock-orange, user-blue user-orange
                                if ( newConcepts[i].is_Parent == true ){  // it is a parent
                                  if ( newConcepts[i].is_EncounterBased == true ){ 
                                      newConcepts[i].type = "parent_is_EncounterBased"; 
                                    } else {
                                      newConcepts[i].type = "parent_NotEncounterBased"; 
                                    }
                                  } else { // it is a child
                                  
                                  if ( newConcepts[i].is_EncounterBased == true ){ 
                                      newConcepts[i].type = "child_is_EncounterBased"; 
                                    } else {
                                      newConcepts[i].type = "child_NotEncounterBased"; 
                                    }
                                  }
                                  
                                if (newConcepts[i].parent == "#") {
                                    topParents.push(newConcepts[i]);
                                }

                                standardConcepts.push(newConcepts[i]);

                            });

                            if (node.id == "#" && $("#concept-list-btn-group").find("li").length <= 2)
                                Leaf.Utils.addTopParentsToFilterList(topParents);

                            cb(standardConcepts);

                            $("#modal-login").modal("hide");
                            // $(".modal-backdrop").removeClass("in");
                        },
                        error: function (xmlHttpRequest, status, errorThrown) {
                            console.log(status);
                        }
                    });
                }
            },
            types: {
                parent_is_EncounterBased: { icon: "glyphicon glyphicon-time parent-time-icon" },                
                parent_NotEncounterBased: { icon: "glyphicon glyphicon-user parent-user-icon" },
                child_is_EncounterBased:  { icon: "glyphicon glyphicon-time child-time-icon" },                
                child_NotEncounterBased:  { icon: "glyphicon glyphicon-user child-user-icon" },
                "default": {
                    icon: "glyphicon glyphicon-plus-sign"
                }
            },
            plugins: ["dnd", "types", "wholerow", "contextmenu"],


            contextmenu: {
                items: function ($node) {

                    return Leaf.Ui.createConceptContextMenu($node);
                }
            }

        });


    // Secondary Search Concept List
    $("#list-search")

        // Autorun string search when data is refreshed
        .on("refresh.jstree", function (e, data) {

            try {

                $("#list-search").jstree("open_all");
            }
            catch (error) {
            }

        })

        .on("move_node.jstree", function (node, parent, data) {


            // jstree seems to have a bug with finding children of the root node, so work around here
            parent.parent = parent.parent == "#" ? Leaf.Status.LatestHoveredNode : parent.parent;

            var concept = Leaf.ConceptList[parent.node.id],
                newParent = parent.parent,
                oldParent = concept.parent;


            Leaf.Ui.moveConcept(concept);


            if (newParent != oldParent) {

                if (Leaf.Session.isAdmin) {

                    Leaf.Ui.confirmConceptMove(concept.id, newParent);
                }
            }
        })

        .on("dehover_node.jstree", function (node, data) {

            var id = data.node.id;

            $(".tooltip").tooltip("destroy");
        })

        .on("hover_node.jstree", function (node, data) {

            var id = data.node.id,
                concept = Leaf.ConceptList[id],
                title = concept.ui_Display_Name,
                body = concept.ui_Display_Tooltip || "No information provided for this concept",
                separator = "<div class='tooltip-separator'></div>";

            Leaf.Status.LatestHoveredNode = id;

            var $node = $("#" + id + ".jstree-node");

            $node.tooltip({
                html: true,
                title: "<p class='tooltip-title'>" + title + "</p>" + separator + "<p class='tooltip-body'>" + body + "</p>",
                trigger: "hover",
                delay: { "show": tooltipDelayInSeconds, "hide": 0 },
                container: "body",
                placement: "top"
            });
            // $node.tooltip("show");
        })



        .jstree({
            core: {
                check_callback: true,
                data: [{ "id": "0", "parent": "#", "text": " " }] // Initial placeholder for data

            },
            types: {                       
                parent_is_EncounterBased: { icon: "glyphicon glyphicon-time parent-time-icon" },                
                parent_NotEncounterBased: { icon: "glyphicon glyphicon-user parent-user-icon" },             
                child_is_EncounterBased:  { icon: "glyphicon glyphicon-time child-time-icon" },                
                child_NotEncounterBased:  { icon: "glyphicon glyphicon-user child-user-icon" },

                "default": {
                    icon: "glyphicon glyphicon-plus-sign"
                }
            },
            plugins: ["dnd", "types", "wholerow", "contextmenu"],

            contextmenu: {
                items: function ($node) {

                    return Leaf.Ui.createConceptContextMenu($node);
                }
            }
        });


    // save query example tree
    Leaf.Ui.createSaveQueryExampleTree();
};

Leaf.Ui.populatePatientListTemplateDropDown = function () {

    var $wrapper = $("#patientlist-currentview-wrapper");

    $wrapper.find("li.patientlist-template").remove();

    $.each(Leaf.PatientList.Templates, function (key, value) {


        if (value.isActive) {

            var $newTemplate = $("<li class='patientlist-template'><a>" + value.PatientListName + "</a></li>");

            $newTemplate.data("id", value.PatientListID);
            $wrapper
                .find("ul")
                .append($newTemplate);
        }
    });
};

Leaf.Ui.setPatientListDatasets = function (datasets) {

    var $datasetsWrapper = $("#patientlist-openmodal-wrapper"),
        columnsObject = {};

    for (var i = 0; i < datasets.length; i++) {

        var id = "patientlist-dataset-" + datasets[i].DatasetName.replace(" ", "-"),
            $newDataSet = $("<span id='" + id + "' class='patientlist-dataset'>" + datasets[i].DatasetName + "<span class='caret'></span></span>");


        for (var j = 0; j < datasets[i].Columns.length; j++) {

            var column = datasets[i].Columns[j];
            column.ordinalPosition = i + j;
            //column.visible = typeof (columnsObject[column.name]) == "undefined" ? false : true;

            Leaf.PatientList.Columns[column.name] = column;
        }

        // Set the popover
        $newDataSet.popover({
            trigger: "click",
            content: $(Leaf.HtmlGenerators.patientListDatasetsPopover(datasets[i].Columns)).html(),
            html: true,
            container: "body",
            placement: "bottom",
            title: "Configure Columns for " + datasets[i].DatasetName + "<span id='datasets-popover-close' class='glyphicon glyphicon-remove'></span>"
        });

        $datasetsWrapper.append($newDataSet);
    }
};

Leaf.Ui.addPanelItem = function (conceptID, panel, subpanel) {

    // Revert the getCount button to RUN QUERY
    Leaf.Utils.updateQueryBuilderStatus(1);

    var $subpanel = $("#resultCarousel .panel")
                      .eq(panel)
                      .find(".panel-body")
                      .eq(subpanel);

    // Update the Panels array
    var droppedConcept = Leaf.ConceptList[conceptID],
        newPanelItem = {
            ConceptID: droppedConcept.id,
            SqlSetName: droppedConcept.sql_Set_Name,
            isEncounterBased: droppedConcept.is_EncounterBased,
            isEventBased: droppedConcept.is_EventBased,
            isNumeric: droppedConcept.is_Numeric,
            SqlWhereClause: droppedConcept.sql_WhereClause,
            SqlFieldDate: droppedConcept.sql_Field_Date,
            SqlFieldText: droppedConcept.sql_Field_Text,
            SqlFieldNumeric: droppedConcept.sql_Field_Numeric,
            SqlFieldEventID: droppedConcept.sql_Field_EventID,
            SqlEqualityOperator: "",
            SqlNumericFilter: "",
            SqlTextFilter: "",
            useTextFilter: false,
            useNumericFilter: false
        };

    // Add the new concept to the Panels array
    Leaf.Panels[panel].SubPanels[subpanel].PanelItems.push(newPanelItem);
    Leaf.Panels[panel].PanelItemCount += 1;

    // Update the DOM
    //================================================
    var $newItem = $(Leaf.HtmlGenerators.panelItemDropdown(droppedConcept.ui_Display_Text)),
        $newItemWrapper = $("<div></div>").addClass("panel-item-wrapper");

    // Set references for the DOM panel-item object
    // (These will be used if the object is removed, etc.)
    $newItem.data("conceptID", droppedConcept.id)
            .data("subpanelID", subpanel)
            .data("panelID", panel)
            .data("arrayPosition", (Leaf.Panels[panel].SubPanels[subpanel].PanelItems.length) - 1);

    // Remove the .dragHover class from all panel objects again for good measure
    $(".panel-body")
        .removeClass("dragHover");

    // If the subpanel already contains other panel-items
    if (Leaf.Panels[panel].SubPanels[subpanel].PanelItems.length > 1) {

        // Add an "or" element between the two panel-items
        var $newOr = $("<div></div>")
                        .addClass("panel-item-or")
                        .append($("<span>or</span>"));

        $subpanel.append($newOr);
    }

    // Append the panel-item to the item-wrapper
    $newItemWrapper
        .append($newItem);

    // Append the item-wrapper to the subpanel
    $subpanel
        .append($newItemWrapper);

    // Update the panel class and colors
    if (Leaf.Panels[panel].includePanel) {

        $subpanel
          .parent(".panel")
            .removeClass("panel-default")
            .addClass("panel-primary")
          .children(".panel-heading")
            .addClass("panel-heading-items");
    }


    // Update the subpanel header with .hasItems class
    $subpanel
        .prev(".panel-subpanel")
        .removeClass("noItems")
        .addClass("hasItems");

    // Remove the panel-body-filler
    $subpanel
      .find(".panel-body-filler")
        .remove();

    // If the subpanel is now activated and has a panel-item
    if (Leaf.Panels[panel].SubPanels[subpanel].PanelItems.length == 1 && subpanel != 0) {

        $subpanel.prev(".panel-subpanel")
            .html("")
            .append($(Leaf.HtmlGenerators.subPanelInclusionDropdown()))
            .append($(Leaf.HtmlGenerators.subpanelTypeDropdown()))
            .append($(Leaf.HtmlGenerators.havingFilter()));
    }

    // If we need to create a new following subpanel
    if (typeof Leaf.Panels[panel].SubPanels[subpanel + 1] == "undefined") {

        var newSubPanelIndex = Leaf.Panels[panel].SubPanels.length;

        var $newSubpanel = $("<div></div>")
              .addClass("panel-subpanel")
              .addClass("noItems")
              .html("In the Same Encounter"),
            $newPanelbody = $("<div></div>")
              .addClass("panel-body")
              .data("subpanelID", newSubPanelIndex);

        Leaf.Panels[panel].SubPanels[subpanel + 1] = new Leaf.Models.SubPanel();

        $subpanel
          .parents(".panel")
            .append($newSubpanel)
            .append($newPanelbody);
    }


    // If the panel-item allows a numeric filter, add a popover and clickable text
    if (droppedConcept.is_Numeric) {

        var $newModifier = $(Leaf.HtmlGenerators.panelItemModifier(droppedConcept.ui_Numeric_DefaultMessage));

        // Append the modifier to the item-wrapper
        $newItemWrapper
            .append($newModifier);

        // Set the popover
        $newModifier.popover({
            trigger: "click",
            content: Leaf.HtmlGenerators.numericFilterPopover().html(),
            html: true,
            container: "body",
            placement: "bottom auto",
            title: "Filter " + droppedConcept.text + " " + IsNull(droppedConcept.ui_Display_Units)
        });
    }

    // If the panel-item has a custom sql dropdown, add it
    if (droppedConcept.has_Dropdown) {

        var $newSqlDropdown = Leaf.HtmlGenerators.panelItemCustomSqlDropdown(droppedConcept.ui_Dropdown_Elements, droppedConcept.ui_Dropdown_DefaultMessage);

        $newItemWrapper
            .append($newSqlDropdown);
    }
};

Leaf.Ui.setSubPanelInclusion = function (panel, subpanel, includeSubpanel) {

    var $subpanel = $("#resultCarousel .panel")
                      .eq(panel)
                      .find(".panel-subpanel")
                      .eq(subpanel - 1),
        $subHeader = $subpanel
                        .find(".in-filter-subpanel .dropdown-toggle");

    /*if (includeSubpanel) {

        $subpanel
          .find(".panel-item-not")
            .remove();
    }
    else {

        var newNot = $("<span class='panel-item-not'>Not</span>");

        $subpanel
          .find(".panel-item-wrapper")
            .prepend(newNot);
    }*/
    if (includeSubpanel) {
        $subpanel.removeClass("subpanel-danger");
        if (Leaf.Panels[panel].includePanel) {
            $subpanel.addClass("subpanel-primary");
        }
        $subHeader.html("And<span class='caret'></span>");
    }
    else {
        $subpanel.removeClass("subpanel-primary");
        $subpanel.addClass("subpanel-danger");
        $subHeader.html("And Not<span class='caret'></span>");
    }

    Leaf.Panels[panel].SubPanels[subpanel].includePanel = includeSubpanel;
    Leaf.Utils.updateQueryBuilderStatus(1);
};

Leaf.Ui.setPanelItemRecencyFilter = function (panel, subpanel, panelItem, useRecencyFilter, recencyFilter) {

    var $panelItem = $("#resultCarousel .panel")
                      .eq(panel)
                      .find(".panel-body")
                      .eq(subpanel)
                      .find(".panel-item-wrapper")
                      .eq(panelItem),
        recencyFilterDisplay;

    // Clear any other recency objects for this panel item
    $panelItem
      .find(".panel-item-recency")
        .remove();

    if (useRecencyFilter) {

        switch (recencyFilter) {

            case "MIN":

                recencyFilterDisplay = "for the First Time";
                break;

            case "MAX":

                recencyFilterDisplay = "for the Most Recent Time";
                break;
        }

        var $newRecencyFilter = $("<span class='panel-item-recency'>" + recencyFilterDisplay + "</span>");

        $panelItem
            .append($newRecencyFilter);
    }

    Leaf.Panels[panel].SubPanels[subpanel].PanelItems[panelItem].useRecencyFilter = useRecencyFilter;
    Leaf.Panels[panel].SubPanels[subpanel].PanelItems[panelItem].SqlRecencyFilter = recencyFilter;
    Leaf.Utils.updateQueryBuilderStatus(1);
};

/**
* after a panel item has been clicked, this figures out what to do about it.
*/
Leaf.Ui.panelItemClicked = function ($clickedPanelItem) {

    var panel = $clickedPanelItem.parents(".panel").data("panelID"),
        subpanel = $clickedPanelItem.parents(".panel-body").data("subpanelID"),
        panelItem = $clickedPanelItem.parents(".panel-item-dropdown").data("arrayPosition"),
        dropdownValue = $clickedPanelItem.parent().attr("value");


    // First, find out which drop down option the user picked
    //========================================================
    switch (parseInt(dropdownValue)) {

        // Exclude
        // Prepend a "Not" before the text and update the includePanel attribute
        /* case 0:
 
             Leaf.Ui.setSubPanelInclusion(panel, subpanel, false);
             break;
 
             // Include
             // Remove any "Not"s before the text and update the include attribute
 
         case 1:
 
             Leaf.Ui.setSubPanelInclusion(panel, subpanel, true);
             break;
             */
        // Any Occurance
        // Remove any MIN/MAX date restrictions
        case 2:

            Leaf.Ui.setPanelItemRecencyFilter(panel, subpanel, panelItem, false);
            break;

            // First Time
            // Set Recency restriction to the first time
        case 3:

            Leaf.Ui.setPanelItemRecencyFilter(panel, subpanel, panelItem, true, "MIN");
            break;

            // Most Recent
            // Set Recency restriction to the most recent time
        case 4:

            Leaf.Ui.setPanelItemRecencyFilter(panel, subpanel, panelItem, true, "MAX");
            break;

            // Delete the panel-item
        case -1:

            // Update the Panels array and remove the panel-item
            Leaf.Panels[panel].SubPanels[subpanel].PanelItems.splice(panelItem, 1);
            Leaf.Panels[panel].PanelItemCount -= 1;

            if (Leaf.Panels[panel].SubPanels[subpanel].PanelItems.length == 0) {

                Leaf.Panels[panel].SubPanels.splice(subpanel, 1);
            }

            var newQueryDefinition = JSON.parse(JSON.stringify(Leaf.Panels));

            Leaf.Ui.clearPanels();
            Leaf.Ui.setQueryDefinition(newQueryDefinition, null);

            Leaf.Panels = newQueryDefinition;
            break;
    }
};

Leaf.Ui.clearPanels = function () {

    var $newPanelBody = $("<div class='panel-body'><div class='panel-body-filler'></div></div>");

    $newPanelBody
        .data("subpanelID", 0);

    // Update the class on the panels to "panel-default"
    $("#resultCarousel .panel")
        .removeClass("panel-primary")
        .removeClass("panel-danger")
        .addClass("panel-default")

      // Remove the "panel-heading-items" class from the header
      .find(".panel-heading")
        .removeClass("panel-heading-items")

       // Remove all following "panel-body" and "panel-subpanel" objects
      .nextAll()
        .remove();

    // Remove the word not from each panel
    $("#resultCarousel .panel")
      .find(".main-header")
        .html(function () {
            var $header = $(this);
            return $header.text().replace("Not", "") + "<span class='caret'></span>";
        });

    // Revert date filter to 'Anytime'
    $("#resultCarousel .panel")
      .find(".date-filter").children("a")
        .html("Anytime <span class='caret'></span>");

    // Revert count filter to 'At least 1x'
    $("#resultCarousel .panel")
      .find(".count-filter").children("a")
        .html("At Least 1x <span class='caret'></span>")
    $(".a-disabled")
        .removeClass("a-disabled");

    $("#resultCarousel .panel")
        .append($newPanelBody);              // Add a new panel body

    // Reset the Panels array
    Leaf.Utils.initializePanels();

    Leaf.Utils.updateQueryBuilderStatus(1);
};

Leaf.Ui.setPanelDateFilter = function (panel, dateFrom, dateTo, filterDate) {

    var $panel = $("#resultCarousel .panel")
                    .eq(panel),
        newText;

    if (filterDate) {
      if (dateFrom != "GETDATE()") {
        switch (dateFrom) {
            case "DATEADD(HOUR,-24,GETDATE())": newText = "In Past 24 Hours"; break;
            case "DATEADD(HOUR,-48,GETDATE())": newText = "In Past 48 Hours"; break;
            case "DATEADD(HOUR,-72,GETDATE())": newText = "In Past 72 Hours"; break;
            case "DATEADD(DAY,-7,GETDATE())": newText = "In Past 7 Days"; break;
            case "DATEADD(WEEK,-1,GETDATE())": newText = "In Past Week"; break;
            case "DATEADD(DAY,-30,GETDATE())": newText = "In Past 30 Days"; break;
            case "DATEADD(MONTH,-1,GETDATE())": newText = "In Past Month"; break;
            case "DATEADD(MONTH,-6,GETDATE())": newText = "In Past 6 Months"; break;
            case "DATEADD(MONTH,-12,GETDATE())": newText = "In Past 12 Months"; break;
            case "DATEADD(YEAR,-2,GETDATE())": newText = "In Past 2 Years"; break;
            case "DATEADD(YEAR,-3,GETDATE())": newText = "In Past 3 Years"; break;
            default:
              newText = dateFrom + " - " + dateTo;
          }
        } else {
          switch (dateTo) {
            case "DATEADD(DAY,10,GETDATE())": newText = "In Next 10 Days"; break;
            case "DATEADD(DAY,30,GETDATE())": newText = "In Next 30 Days"; break;
            case "DATEADD(MONTH,1,GETDATE())": newText = "In Next Month"; break;
            case "DATEADD(MONTH,6,GETDATE())": newText = "In Next 6 Months"; break;
            case "DATEADD(MONTH,12,GETDATE())": newText = "In Next 12 Months"; break;
            default:
              newText = dateFrom + " - " + dateTo;
         }
      }
    }
    else {

        newText = "Anytime";
    }

    $panel
      .find(".date-filter")
      .children("a")
        .html(newText + "<span class='caret'></span>");

    Leaf.Panels[panel].isDateFiltered = filterDate;
    Leaf.Panels[panel].DateFrom = dateFrom;
    Leaf.Panels[panel].DateTo = dateTo;

    Leaf.Utils.updateQueryBuilderStatus(1);
};

Leaf.Ui.setSubPanelType = function (panel, subpanel, sequenceType, dateType, dateRange) {

    var newText,
        dateRangeDisplay,
        $subpanel = $("#resultCarousel .panel")
                      .eq(panel)
                      .find(".panel-subpanel")
                      .eq(subpanel - 1);

    if (sequenceType == 1 || sequenceType == 2) {

        dateRangeDisplay = dateType[0] + dateType.substring(1, dateType.length).toLowerCase() + "(s)"

        Leaf.Panels[panel].SubPanels[subpanel].DateRangeType = dateType;
        Leaf.Panels[panel].SubPanels[subpanel].DateRangeNumber = dateRange;
    }

    switch (parseInt(sequenceType)) {

        case 0:
            newText = "In the Same Encounter";
            break;

        case 4:
            newText = "In the Same Event";
            break;

        case 1:
            newText = "Within +/- " + dateRange + " " + dateRangeDisplay;
            break;

        case 2:
            newText = "In the Following " + dateRange + " " + dateRangeDisplay;
            break;

        case 3:
            newText = "Anytime Afterward";
            break;
    }

    $subpanel
      .find(".subpanel-type")
      .children("a")
        .html(newText + "<span class='caret'></span>");

    Leaf.Panels[panel].SubPanels[subpanel].SequenceType = sequenceType;

    Leaf.Utils.updateQueryBuilderStatus(1);
};

Leaf.Ui.setPanelItemSqlDropdownFilter = function (panel, subpanel, panelItem, dropdownText, dropdownSql, useSqlDropdown) {

    var $panelItem = $("#resultCarousel .panel")
                      .eq(panel)
                      .find(".panel-body")
                      .eq(subpanel)
                      .find(".panel-item-wrapper")
                      .eq(panelItem),
        newText;

    if (dropdownText == null) {

        var $dropdownItems = $panelItem
                              .find(".panel-item-sqldropdown")
                              .find("li");

        $dropdownItems.each(function (index) {

            var newSql = $(this).attr("value");

            if (newSql == dropdownSql) {

                newText = $(this)
                            .children("a")
                            .text();
            }
        });
    }
    else {

        newText = dropdownText;
    }

    if (useSqlDropdown) {

        Leaf.Panels[panel].SubPanels[subpanel].PanelItems[panelItem].SqlDropdown = dropdownSql;
    }
    else {

        Leaf.Panels[panel].SubPanels[subpanel].PanelItems[panelItem].SqlDropdown = "";
    }

    Leaf.Panels[panel].SubPanels[subpanel].PanelItems[panelItem].useDropdownElement = useSqlDropdown;

    $panelItem
      .find(".panel-item-sqldropdown")
      .children("a")
        .html(newText);

    Leaf.Utils.updateQueryBuilderStatus(1);
};

Leaf.Ui.setPanelItemNumericFilter = function (panel, subpanel, panelItem, numericOperator, number, useNumericFilter) {

    var $panelItem = $("#resultCarousel .panel")
                      .eq(panel)
                      .find(".panel-body")
                      .eq(subpanel)
                      .find(".panel-item-wrapper")
                      .eq(panelItem),
        conceptID = $panelItem
                      .find(".panel-item-dropdown")
                        .data("conceptID"),
        defaultMessage = Leaf.ConceptList[conceptID].ui_Numeric_DefaultMessage,
        units = Leaf.ConceptList[conceptID].ui_Display_Units,
        newText;

    if (useNumericFilter) {

        newText = numericOperator + " " + number + ' ' + IsNull(units);

        Leaf.Panels[panel].SubPanels[subpanel].PanelItems[panelItem].SqlEqualityOperator = numericOperator;
        Leaf.Panels[panel].SubPanels[subpanel].PanelItems[panelItem].SqlNumericFilter = number;
    }
    else {

        newText = defaultMessage;

        Leaf.Panels[panel].SubPanels[subpanel].PanelItems[panelItem].SqlEqualityOperator = "";
        Leaf.Panels[panel].SubPanels[subpanel].PanelItems[panelItem].SqlNumericFilter = "";
    }

    $panelItem
      .children(".panel-item-modifier")
        .html(newText);

    Leaf.Panels[panel].SubPanels[subpanel].PanelItems[panelItem].useNumericFilter = useNumericFilter;

    Leaf.Utils.updateQueryBuilderStatus(1);
}

Leaf.Ui.getPanelItemNumericFilterData = function ($item) {

    var $popover = $item.parents(".popover"),
        $panelItem = $("[aria-describedby=" + $popover.attr("id") + "]").parent(".panel-item-wrapper"),
        panel = $panelItem.parents(".panel").data("panelID"),
        subpanel = $panelItem.parents(".panel-body").data("subpanelID"),
        panelItem = $panelItem.children(".panel-item-dropdown").data("arrayPosition"),
        operator = $popover.find(".dropdown-toggle").text(),
        number = operator == "BETWEEN" ? $popover.find("input").eq(0).val() + " AND " + $popover.find("input").eq(1).val()
                                       : $popover.find("input").val();

    number = number || "";

    var useNumericFilter = number.replace("AND","").trim() == "" ? false : true;

    Leaf.Ui.setPanelItemNumericFilter(panel, subpanel, panelItem, operator, number, useNumericFilter);
}

Leaf.Ui.checkSavedQueryInformation = function () {

    var $queryName = $("#query-name"),
        queryName = $queryName.val().substring(0,30),
        $queryCategory = $("#query-category"),
        queryCategory = $queryCategory.val().substring(0,30),
        queryDescription = $("#query-description").val();



    if (queryName.length > 0 && queryCategory.length > 0) {

        $("#btn-save-query, #btn-save-querynew")
            .prop("disabled", false);
    }
    else {

        $("#btn-save-query, #btn-save-querynew")
            .prop("disabled", true);
    }

    Leaf.Ui.syncSaveQueryPreviewTree(queryName, queryCategory);
};

Leaf.Ui.centerModals = function () {

    $(".modal-centered").each(function (i) {

        var $clone = $(this)
                        .clone()
                        .css("display", "block")
                        .appendTo("body"),
            top = Math.round(($clone.height() - $clone.find(".modal-content").height()) / 2);

        top = top > 0 ? top : 0;
        $clone
            .remove();
        $(this)
          .find(".modal-content")
            .css("margin-top", top);
    });
};

Leaf.Ui.setCountFilter = function (panel, subpanel, minimumCount) {

    var newText = "At Least " + minimumCount + "x",
        $subpanel = $("#resultCarousel .panel")
                      .eq(panel)
                      .find(".panel-body")
                      .eq(subpanel)
                      .prev(".panel-heading, .panel-subpanel");

    if (minimumCount > 1) {

        Leaf.Panels[panel].SubPanels[subpanel].hasCountFilter = true;
        Leaf.Panels[panel].SubPanels[subpanel].MinimumCount = minimumCount;
    }
    else {

        Leaf.Panels[panel].SubPanels[subpanel].hasCountFilter = false;
        Leaf.Panels[panel].SubPanels[subpanel].MinimumCount = 1;
    }

    $subpanel
      .find(".count-filter")
      .children("a")
        .html(newText + "<span class='caret'></span>");

    Leaf.Utils.updateQueryBuilderStatus(1);
};

Leaf.Ui.setPanelInclusion = function (panel, includePanel) {

    var $panel = $("#resultCarousel .panel").eq(panel),
        newText,
        classToAdd,
        classToRemove;

    if (includePanel) {

        newText = panel == 0 ? "Patients Who" : "And";
        classToAdd = Leaf.Panels[panel].PanelItemCount > 0 ? "panel-primary" : "panel-default";
        Leaf.Panels[panel].includePanel = true;
        classToRemove = "panel-danger";
    }
    else {

        newText = panel == 0 ? "Not Patients Who" : "And Not";
        classToRemove = Leaf.Panels[panel].PanelItemCount > 0 ? "panel-primary" : "panel-default";
        Leaf.Panels[panel].includePanel = false;
        classToAdd = "panel-danger";
    }

    $panel
        .removeClass(classToRemove)
        .addClass(classToAdd)
      .find(".main-header")
        .html(newText + "<span class='caret'></span>");

    Leaf.Utils.updateQueryBuilderStatus(1);
};

/**
* Build a new query.
*/
Leaf.Ui.startNewQuery = function () {

    Leaf.Utils.updateQueryBuilderStatus(1);

    $("#current-query-name")
      .find("strong")
        .html("New Query");

    $("#totalCount").html("");

    // Hide the visualize and patient list tabs
    $(".carousel-button-toggle")
        .addClass("hidden");
    $(".carousel-button-placeholder")
        .removeClass("hidden");

    Leaf.Status.CurrentSavedQueryID = 0;

    Leaf.Ui.clearPanels();
};


/**
* Called in cases where we want to get rid of the current contents of the Find Patients page.
* If there is a query on the page,
* we need to verify that the user wants to get rid of the query that is currently built in the Find Patients page.
*/
Leaf.Ui.confirmNewQuery = function (callbackEvent) {

    var modalTitle,
        modalContent,
        onClickYes,
        onClickNo,
        openModal = false,
        $panelsWithData = $(".panel-primary"),
        queryDefinitionChanged = Leaf.Status.CurrentSavedQueryID == 0 ? false : JSON.stringify(Leaf.Panels) !== Leaf.SavedQueries.List[Leaf.Status.CurrentSavedQueryID].QueryJson,
        onClickYes = function () {

            Leaf.Ui.openSaveQueryModal();
        },
        onClickNo = function () {

            callbackEvent();
        };


    if (Leaf.Status.CurrentSavedQueryID != 0 && queryDefinitionChanged) {

        modalTitle = "Update Saved Query";
        modalContent = "Do you want to save changes to the Saved Query? This will overwrite the previous query definition.";
        openModal = true;
    }
    else if ($panelsWithData.length > 0 && Leaf.Status.CurrentSavedQueryID == 0) {

        modalTitle = "Save Query";
        modalContent = "Do you want to save the current query?";
        openModal = true;
    }

    if (openModal) {

        Leaf.Ui.openConfirmationModal(modalTitle, modalContent, onClickYes, onClickNo, "Save", "Don't Save");
    }
    else {
        callbackEvent();
    }
};

Leaf.Ui.openConfirmationModal = function (title, content, onClickYes, onClickNo, yesButtonText, noButtonText) {

    var $updateModal = $("#modal-confirmation"),
        $yesButton = $("#btn-confirm-yes"),
        $noButton = $("#btn-confirm-no"),
        yesButtonText = yesButtonText || "Save",
        noButtonText = noButtonText || "Don't Save";

    $updateModal
      .find(".modal-title")
        .html(title);

    $updateModal
      .find("p")
        .html(content);

    $updateModal
      .find(".progress")
        .hide();

    $yesButton
        .data("onclick", onClickYes)
        .text(yesButtonText);

    $noButton
        .data("onclick", onClickNo)
        .text(noButtonText);

    $updateModal.modal("show");
};

Leaf.Ui.openAndUpdateProgressModal = function (progress, message, title) {

    var $progressModal = $("#processing-modal"),
        $progressBar = $progressModal.find(".progress-bar"),
        $currentMessage = $progressModal.find("p"),
        $title = $progressModal.find(".modal-title");

    $progressModal
        .modal("show");
    $progressBar
        .css("width", progress + "%")
        .attr("aria-valuenow", progress);

    $currentMessage
        .html(message);
    $title
       .html(title);
};

Leaf.Ui.closeProgressModal = function () {

    var $progressModal = $("#processing-modal"),
        $progressBar = $progressModal.find(".progress-bar"),
        $currentMessage = $progressModal.find("p"),
        $title = $progressModal.find(".modal-title");

    $progressModal
        .modal("hide");
    $progressBar
        .css("width", 100 + "%")
        .attr("aria-valuenow", 100);

    $currentMessage
        .html("");
    $title
       .html("");
};

Leaf.Ui.updatePatientListConfiguration = function (updateColumns) {


    // Clear the selected data sets in the data set selection modal
    var $wrapper = $("#patientlist-selected");

    $wrapper.find(".patientlist-selected").remove();


    // Default all data set checkboxes to unchecked
    $("#patientlist-tree")
        .find("input")
        .prop("checked", false);


    // Update the currently loaded data sets
    Leaf.PatientList.Configuration.Datasets = [];

    $.each(Leaf.PatientListDatasets, function (key, value) {

        if (value.isChecked) {

            Leaf.PatientList.Configuration.Datasets.push(value.QueryOutputName);

            var $selected = $("<div class='patientlist-selected'>" + value.QueryOutputDisplay + "</div>");
            $selected.data("id", value.id);

            $wrapper.append($selected);

            $("#patientlist-tree #" + value.id)
                .find("input")
                .prop("checked", true);
        }
    })

    if (updateColumns) {

        // Update the currently selected columns 
        var $columns = $("#patientTable th");

        Leaf.PatientList.Configuration.ColumnOrder = [];

        if ($columns.length > 0) {

            $columns.each(function () {

                Leaf.PatientList.Configuration.ColumnOrder.push($(this).text());
            });
        }
    }
};

Leaf.Ui.setPatientListTemplate = function (templateId, refreshList) {

    var $dropdown = $("#patientlist-currentview"),
        template = Leaf.PatientList.Templates[templateId],
        displayName,
        dataSetMapping = {};


    Leaf.Status.CurrentPatientListTemplateID = templateId;


    $.each(Leaf.PatientListDatasets, function (key, value) {

        dataSetMapping[value.QueryOutputName] = value.id;

        Leaf.PatientListDatasets[key].isChecked = false;
    });

    if (templateId != 0) {

        displayName = template.PatientListName;

        Leaf.PatientList.Configuration = JSON.parse(template.PatientListConfigurationJson);

        for (var i = 0; i < Leaf.PatientList.Configuration.Datasets.length; i++) {

            var id = dataSetMapping[Leaf.PatientList.Configuration.Datasets[i]];

            Leaf.PatientListDatasets[id].isChecked = true;
        }

        Leaf.Ui.updatePatientListConfiguration(false);
    }
    else {

        Leaf.PatientList.Configuration.ColumnOrder = [];
        Leaf.PatientList.Configuration.Datasets = [];
        displayName = "Open Saved List View";
    }

    $dropdown.html(displayName + "<span class='caret'></span>");

    if (refreshList) {

        Leaf.Ui.openUpdatingModal("Patient List", "Updating Patient List...");
        Leaf.Ajax.getPatients();
    }
};

Leaf.Ui.openMessageModal = function (title, message) {

    var $modal = $("#modal-message");

    $modal.find(".modal-title").html(title);
    $modal.find("p").html(message);


    // Center modal
    var $clone =
      $modal
        .clone()
        .css("display", "block")
        .appendTo("body"),
        top = Math.round(($clone.height() - $clone.find(".modal-content").height()) / 2);

    top = top > 0 ? top : 0;
    $clone.remove();

    $modal
      .find(".modal-content")
        .css("margin-top", top);

    $modal.modal("show");
};

Leaf.Ui.openSaveQueryModal = function () {

    var $queryName = $("#query-name"),
        $queryCategory = $("#query-category"),
        $queryDescription = $("#query-description"),
        $querySaveNew = $("#btn-save-querynew"),
        $querySave = $("#btn-save-query");

    if (Leaf.Status.CurrentTotalPatients > Leaf.Global.SaveQueryPatientLimit) {
        var message = "Queries of more than " + Leaf.Utils.addCommasToNumber(Leaf.Global.SaveQueryPatientLimit) + " patients cannot be saved. Please refine your criteria to return a smaller cohort size.";
        Leaf.Ui.openMessageModal("Cannot Save Query", message);
    }
    else if (Leaf.Status.CurrentSavedQueryID !== 0) {

        currentSavedQuery = Leaf.SavedQueries.List[Leaf.Status.CurrentSavedQueryID];

        $queryName.val(currentSavedQuery.QueryName);
        $queryCategory.val(currentSavedQuery.QueryCategory);
        $queryDescription.val(currentSavedQuery.QueryDescription);
        $querySaveNew.show();
        $querySave.prop("disabled", false);
        Leaf.Ui.syncSaveQueryPreviewTree(currentSavedQuery.QueryName, currentSavedQuery.QueryCategory);

        $("#modal-save-query").modal("show");
    }
    else {

        $queryName.val("");
        $queryCategory.val("");
        $queryDescription.val("");
        $querySaveNew.hide();
        $querySave.prop("disabled", true);
        Leaf.Ui.syncSaveQueryPreviewTree("", "");

        $("#modal-save-query").modal("show");
    }

    
    // populate the query category box with a typeahead of all unique categories so far
    var unique = {};
    var distinct = [];
    for (var i in Leaf.SavedQueries.List) {
        if (typeof (unique[Leaf.SavedQueries.List[i].QueryCategory]) === "undefined") {
            distinct.push(Leaf.SavedQueries.List[i].QueryCategory);
        }
        unique[Leaf.SavedQueries.List[i].QueryCategory] = 0;
    }

    Leaf.Ui.initializeClientSearch($queryCategory.parent(), distinct);
};

Leaf.Ui.openPatientListSave = function () {

    var $saveNewButton = $("#btn-savePatientList-new"),
        $removeButton = $("#btn-savePatientList-delete"),
        $listName = $("#patientlist");

    if (Leaf.Status.CurrentPatientListTemplateID == 0) {

        $listName.val("");
        $removeButton.hide();
        $saveNewButton.hide();
    }
    else {

        $listName.val(Leaf.PatientList.Templates[Leaf.Status.CurrentPatientListTemplateID].PatientListName);
        $saveNewButton.show();
    }

    $("#modal-savePatientList").modal("show");
};

Leaf.Ui.setInputValidationState = function ($element, classToAdd, classToRemove, iconToAdd, iconToRemove) {

    var $form = $element.parents(".has-feedback"),
        $icon = $form.find(".form-control-feedback");

    $form
          .removeClass(classToRemove)
          .addClass(classToAdd);

    $icon
      .removeClass(iconToRemove)
      .addClass(iconToAdd);
};

Leaf.Ui.initializeClientSearch = function ($parentNode, strings) {


    var $typeahead = $parentNode.find(".typeahead");

    // constructs the suggestion engine
    var bloodhound = new Bloodhound({
        datumTokenizer: function (strings) {

            var a = Bloodhound.tokenizers.whitespace(strings);

            $.each(a, function (k, v) {
                var i = 0;
                while ((i + 1) < v.length) {
                    a.push(v.substr(i, v.length));
                    i++;
                }
            })
            return a;
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: strings
    });


    // destroy any existing typeaheads
    $typeahead.typeahead("destroy");

    function stringsWithDefaults(q, sync) {
        if (q === '') {
            sync(bloodhound.all().slice(0, (strings.length > 10 ? 10 : strings.length)));
        }

        else {
            bloodhound.search(q, sync);
        }
    }

    $typeahead
        .typeahead({
            hint: true,
            highlight: true,
            minLength: 0
        },
        {
            limit: 10,
            source: stringsWithDefaults
        });
};

Leaf.Ui.createSavedQueriesTable = function () {

    // remove any previously created table
    $("#myqueries-table").DataTable().destroy({ remove: true });


    // generate and append the table 
    var $importedProjectsTable = $(Leaf.HtmlGenerators.myQueriesSummaryTable());
    $("#myqueries-table-wrapper").append($importedProjectsTable);



    // and convert it to a data table
    Leaf.SavedQueries.Table = $("#myqueries-table")
        .DataTable({
            paging: false,
            dom: "t",
            columnDefs: [
                 {
                     searchable: true
                 }
            ]
        });
};

Leaf.Ui.createSaveQueryExampleTree = function () {

    var exampleData = [
        { id: 'topParent', parent: '#', text: "My Saved Cohorts", icon: 'glyphicon glyphicon-user parent-user-icon', state: { opened: true} },
        { id: 'user', parent: 'topParent', text: $("#user-name").text(), icon: 'glyphicon glyphicon-user parent-user-icon', state: { opened: true} },
        { id: 'category', parent: 'user', text: 'New Category', icon: 'glyphicon glyphicon-user parent-user-icon', state: { opened: true} },
        { id: 'query', parent: 'category', text: 'New Query', icon: 'glyphicon glyphicon-user child-user-icon', state: { opened: true} }
    ];

    $('#query-previewtree').jstree({
        core: {
            check_callback: true,
            data: exampleData,
            themes: {
                dots: false
            }
        }
    });
};

this.IsNull = function (s) {

    if (s === null)
        return "";
    else
        return s;
}

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};



//================================================
// Event listeners 
//================================================
$("#btn-conceptWiki-edit").on("click", function () {


    if (Leaf.Status.isConceptEditModeOn) {


        // lock the UI, and revert the items back to the previous concept properties
        Leaf.Ui.lockOrUnlockConceptWiki(true);

        var conceptId = $("#conceptedit-id").val();


        if (conceptId != "") {

            Leaf.Ui.populateConceptWikiWithConceptInfo(conceptId);
        }

        Leaf.Status.isConceptEditModeOn = false;

    }
    else {

        Leaf.Status.isConceptEditModeOn = true;

        // unlock the inputs and show the save button
        Leaf.Ui.lockOrUnlockConceptWiki(false);

    }
});

$("#btn-conceptWiki-saveedit").on("click", function () {


    // hide the edit button, and revert the close button text back to close
    $("#btn-conceptWiki-edit").hide();
    $("#btn-conceptWiki-close").text("Close");


    // lock the concept wiki
    Leaf.Ui.lockOrUnlockConceptWiki(true);


    // save the changes via Ajax call
    var concept = Leaf.Utils.getConceptInfoFromWiki();
    Leaf.Ui.openUpdatingModal("Concept Editor", "Adding/Updating Concept...");


    Leaf.Ajax.saveConcept(concept, true, Leaf.Ui.moveConcept);
});

$(document).on("click", "#btn-patientlist-update", function () {


    $("#modal-patientlist").modal("hide");
    Leaf.Ui.openUpdatingModal("Patient List", "Updating Patient List...");

    Leaf.Ui.updatePatientListConfiguration(true);

    Leaf.Ajax.getPatients();
});

$(document).on("click", ".patientlist-selected", function () {

    var selected = $(this).text();

    $.each(Leaf.PatientListDatasets, function (key, value) {

        if (value.QueryOutputDisplay == selected) {
            $("#patientlist-tree #" + value.id)
                .find("input")
                .prop("checked", false);
            Leaf.PatientListDatasets[value.id].isChecked = false;
        }
    });

    $(this).remove();
});

$(document).on("click", "#btn-login-identification .btn", function () {

    var identificationType = $(this).children("input").val(),
        isDisabled = $(this).hasClass("display-only");

    if (!isDisabled) {

        var useType = Leaf.Session.SessionType + " - " + identificationType;
        Leaf.Session.IdentificationType = identificationType;

        $("#login-usetype").text(useType);
        $("#login-carousel").carousel("next");
    }
});

$(document).on("click", "#btn-login-goback", function () {

    $("#login-carousel").carousel("prev");
    $("#btn-login-identification .btn").removeClass("active");

    var $sections = $(".login-section");

    $sections.hide();

    $sections.each(function (index) {
        
        $(this).delay(500 * index).fadeIn(1000);
    });
});

$(document).on("click", "#btn-login-consent", function () {

    var footer = $("#modal-login .modal-footer");

    footer
      .find("button")
        .remove();

    $("#ajax-load-login").show();
    $("#login-status").text("Logging in user...");

    Leaf.Ajax.logInUser();
});

$(document).on("show.bs.tooltip", function () {


    $(".tooltip").tooltip("destroy");
});

$(".datetimepicker").on("dp.change", function (e) {

    var $picker = $(this);

    var $input = $picker
                    .parents(".row")
                    .prev(".row")
                    .find("input")
                    .eq($picker.data("input")),
        $form = $input.parent(".form-group"),
        $icon = $input.siblings(".form-control-feedback");


    //  place the date picker date in the input
    $input.val(moment(e.date).format("MM/DD/YYYY"));


    //  indicate that the date is valid
    var classToRemove = "has-warning",
        classToAdd = "has-success",
        iconToRemove = "glyphicon-warning-sign",
        iconToAdd = "glyphicon-ok";

    Leaf.Ui.setInputValidationState($input, classToAdd, classToRemove, iconToAdd, iconToRemove);
});

$(".custom-date-input").on("keyup", function () {

    var $input = $(this),
        dateFormat = "MM/DD/YYYY",
        convertedValue = moment(new Date($input.val())),
        isValidDate = convertedValue._isValid,
        $form = $input.parent(".form-group"),
        $icon = $input.siblings(".form-control-feedback"),
        classToAdd,
        classToRemove,
        iconToAdd,
        iconToRemove;


    // if the input is a valid date
    if (isValidDate && $input.val().length == dateFormat.length) {


        //  put the input date in the datepicker
        $input
          .parents(".row")
          .next(".row")
          .find(".datetimepicker")
          .eq($input.data("picker"))
            .data("DateTimePicker")
            .date(convertedValue);


        //  indicate that the date is valid
        classToRemove = "has-warning";
        classToAdd = "has-success";

        iconToRemove = "glyphicon-warning-sign";
        iconToAdd = "glyphicon-ok";
    }
    else {

        //  indicate that the date is invalid
        classToAdd = "has-warning";
        classToRemove = "has-success";

        iconToAdd = "glyphicon-warning-sign";
        iconToRemove = "glyphicon-ok";
    }

    Leaf.Ui.setInputValidationState($input, classToAdd, classToRemove, iconToAdd, iconToRemove);
});

$("#get-count").click(function (evt) {
    evt.preventDefault();

    /* 
        1 = Run Query
        2 = Cancel Query
        3 = Save Query
        4 = Query Saved
    */

    switch (Leaf.Status.CurrentQueryBuilderStatus) {
        case 1:

            // Run query for patient count
            Leaf.Ajax.getPatientCount();
            break;

        case 2:

            // Cancel the current query and revert to state 1
            Leaf.Status.CurrentQueryBuilderStatus = 1;
            Leaf.Xhr.Clinical.abort();
            Leaf.Utils.updateQueryBuilderStatus(1);


            $("#totalCount").html("");
            $("#patientcount-total").html("");
            $("#patientcount-time").html("");
            break;

        case 3:

            // Save current query
            Leaf.SavedQueries.callBackOnComplete = function (id) { Leaf.Status.CurrentSavedQueryID = id; };
            Leaf.Ui.openSaveQueryModal();
            break;

        case 4:

            // Do nothing, the query is saved and no new criteria have been added
            break;
    }
});

$("#tab-visualize").click(function (evt) {

    if (!Leaf.Status.areDemographicsCurrent) {

        Leaf.Status.areDemographicsCurrent = true;

        Leaf.Ajax.getDemographics();
        // Leaf.Ajax.getOutpatientVisits();
        // Leaf.Ajax.getHospitalVisits();

        if ($(".panel-primary").length > 0) {
            Leaf.Ajax.getPatientCountByIteration();
        }
    }
});

$("#tab-patient-list").click(function (evt) {


    var $chooseDataSets = $("#patientlist-openmodal"),
        $currentDataSet = $("#patientlist-currentview"),
        $saveDataSet = $("#patientlist-save");


    if (Leaf.Status.CurrentTotalPatients > Leaf.Global.SaveQueryPatientLimit) {

        $chooseDataSets
            .off("click")
            .addClass("disabled");

        $currentDataSet
            .prop("disabled", true)
            .addClass("disabled");

        $saveDataSet
            .off("click")
            .addClass("disabled");

        Leaf.Ui.setPatientListTemplate(0);
        Leaf.Ui.updatePatientListConfiguration(true);
    }
    else {

        $chooseDataSets
            .removeClass("disabled")
            .on("click", function () {
                $("#modal-patientlist").modal("show");
            });

        $currentDataSet
            .prop("disabled", false)
            .removeClass("disabled");

        $saveDataSet
            .removeClass("disabled")
            .on("click", function () {
                Leaf.Ui.openPatientListSave();
            });
    }

    if (!Leaf.Status.isPatientListCurrent) {

        Leaf.Status.isPatientListCurrent = true;

        Leaf.Ajax.getPatients();
    }

});

$(".carousel-button").on("click", function () {

    var $clicked = $(this);

    $(".carousel-button")
        .removeClass("carousel-button-selected");
    $clicked
        .addClass("carousel-button-selected");
});

$("#clearCriteria").on("click", function () {

    Leaf.Ui.clearPanels();
    $(".popover").popover("hide");
});

$(".date-filter").on("click", "ul li a", function (e) {

    var clicked = $(this),
        dateFrom,
        dateTo,
        filterDate;

    var selectedText = clicked.text(),
        selectedValue = clicked.parent().attr('value'),
        panel = clicked.parents('.panel').data('panelID');


    if (selectedText != "Custom Date Range") {

        if (selectedText != "Anytime") {

            filterDate = true;

            if (selectedText == "In Next 10 Days"
          || selectedText == "In Next 30 Days"
          || selectedText == "In Next Month"
          || selectedText == "In Next 6 Months") {

                dateFrom = "GETDATE()";
                dateTo = selectedValue;
            }
            else {

                dateFrom = selectedValue;
                dateTo = "GETDATE()";
            }
        }
        else if (selectedText == "Anytime") {

            filterDate = false;
            dateFrom = "";
            dateTo = "";
        }


        Leaf.Ui.setPanelDateFilter(panel, dateFrom, dateTo, filterDate);
    }
    else {

        e.stopPropagation();
    }
});

$(".input-small").datepicker()
    .on("changeDate", function (ev) {
        $(".input-small")
            .datepicker("hide");
    });

$(".input-small").click(function (e) {
    e.stopPropagation();
});

$(".add-date-filter").click(function () {

    var $selected = $(this);
    var panel = $selected.parents(".panel").data("panelID"),
        startDate = $selected.parents(".custom-range-box").find(".start-date").val(),
        endDate = $selected.parents(".custom-range-box").find(".end-date").val(),
        startIsValid = moment(new Date(startDate))._isValid,
        endIsValid = moment(new Date(endDate))._isValid;


    //  if dates are valid  update the panel, else warn the user
    if (startIsValid && endIsValid) {

        Leaf.Ui.setPanelDateFilter(panel, startDate, endDate, true);
    }
    else {

        var warningText = "One or both of the selected dates is not a correctly formatted date. Be sure that both start and end dates are in the MM/DD/YYYY format.";

        Leaf.Ui.openMessageModal("Invalid Dates", warningText);
    }

});

/**
* handles clicking on a panel item like "any occurance", "first item", "most recent time", "delete"
*/
$(document).on("click", ".panel-item-dropdown ul li a", function (e) {
    Leaf.Ui.panelItemClicked($(this));
});

$(document).on("click", "#patientlist-currentview-wrapper ul li a", function () {

    var $clicked = $(this).parent("li"),
        $dropdown = $("#patientlist-currentview"),
        templateId = $clicked.data("id");

    if (templateId != Leaf.Status.CurrentPatientListTemplateID) {

        if ($clicked.hasClass("patientlist-template")) {

            Leaf.Ui.setPatientListTemplate(templateId, true);
        }
        else {

            Leaf.Ui.setPatientListTemplate(0, true);
        }
    }
});

$(document).on("click", ".code-equivalent", function (e) {

    var code = $(this).data("code");

    // Clear the code equivalent wrapper
    $("#code-equivalent-wrapper").html("");

    // Update the search box with the code
    $("#conceptSearch").val(code);

    // Run a new search
    Leaf.Utils.runStringSearch(true);
});

$(document).on("click", "#concept-list-btn-group ul li a", function () {

    var $topParent = $(this),
        topParentID = $topParent.parent("li").attr("value");

    Leaf.Status.TopParentSearchFilter = topParentID;

    var $dropdown = $("#concept-list-btn");


    // get just the text contents, filter out HTML
    var categoryText = $topParent.contents().filter(function () {
                            return this.nodeType == 3;
                        })[0].nodeValue.trim();

    $dropdown.html(categoryText + "<span class='caret'></span>");

    Leaf.Utils.runStringSearch(true);
});

$("#conceptSearch").on("input change paste keyup", function () {

    Leaf.Utils.runStringSearch(false);
});

$("#search-myqueries").on("input change paste keyup", function () {

    
    Leaf.SavedQueries.Table
        .search($(this).val())
        .draw();

});

$("#rcimport-projects-search").on("input change paste keyup", function () {


    Leaf.RCImport.Table
        .search($(this).val())
        .draw();

});

$(document).on("click", ".subpanel-type .multi-level li a", function (e) {

    var clicked = $(this),
        panel = clicked.parents(".panel").data("panelID"),
        subpanel = clicked.parents(".panel-subpanel").next(".panel-body").data("subpanelID"),
        sequenceType,
        dateType,
        dateRangeNumber;

    sequenceType = clicked.closest("ul").parent().attr("value");

    if (typeof sequenceType !== "undefined") {

        dateType = clicked.parent().attr("value");
        dateRangeNumber = clicked.closest("ul").prev("a").children().val();
    }
    else {
        sequenceType = clicked.parent().attr("value");
    }

    Leaf.Ui.setSubPanelType(panel, subpanel, sequenceType, dateType, dateRangeNumber);
});

$(document).on("input", ".subpanel-type .multi-level li a input", function (e) {

    var clicked = $(this),
        panel = clicked.parents(".panel").data("panelID"),
        subpanel = clicked.parents(".panel-subpanel").next(".panel-body").data("subpanelID"),
        sequenceType,
        dateType,
        dateRangeNumber;

    sequenceType = clicked.closest("li").attr("value");

    if (typeof sequenceType !== "undefined") {

        dateType = Leaf.Panels[panel].SubPanels[subpanel].DateRangeType;
        dateRangeNumber = clicked.val();
    }
    else {
        sequenceType = Leaf.Panels[panel].SubPanels[subpanel].DateRangeType;
    }

    Leaf.Ui.setSubPanelType(panel, subpanel, sequenceType, dateType, dateRangeNumber);
});

$("#search-patientlist").keyup(function () {

    var searchString = $(this).val().trim();

    $("#patientlist-tree").jstree("search", searchString);
});

$(document).on("click", ".panel-item-sqldropdown ul li a", function () {

    var $clicked = $(this),
        $panelItem = $clicked.parents(".panel-item-wrapper").find(".panel-item-dropdown"),
        selectedValue = $clicked.parent().attr("value"),
        selectedText = $clicked.text(),
        panel = $panelItem.data("panelID"),
        subpanel = $panelItem.data("subpanelID"),
        panelItem = $panelItem.data("arrayPosition");

    var useSqlDropdown = selectedValue == 0 ? false : true;

    Leaf.Ui.setPanelItemSqlDropdownFilter(panel, subpanel, panelItem, selectedText, selectedValue, useSqlDropdown);
})

$(document).on("click", ".count-filter ul li a", function (e) {

    var clicked = $(this),
        selectedValue = clicked.parent().attr("value"),
        panel = clicked.parents(".panel").data("panelID"),
        subpanel = clicked.parents(".panel-heading, .panel-subpanel").next(".panel-body").data("subpanelID");

    Leaf.Ui.setCountFilter(panel, subpanel, selectedValue);
});

$(document).on("click", ".in-filter ul li a", function (e) {

    var $clicked = $(this),
        selectedValue = $clicked.parent().attr("value"),
        panel = $clicked.parents(".panel").data("panelID");

    selectedValue = selectedValue == 1 ? true : false;

    Leaf.Ui.setPanelInclusion(panel, selectedValue);
});

$(document).on("click", ".in-filter-subpanel ul li a", function (e) {

    var $clicked = $(this),
        selectedValue = $clicked.parent().attr("value"),
        panel = $clicked.parents(".panel").data("panelID"),
        $subpanel = $clicked.parents(".panel-subpanel").next(".panel-body"),
        subpanel = $subpanel.data("subpanelID");

    selectedValue = selectedValue == 1 ? true : false;

    Leaf.Ui.setSubPanelInclusion(panel, subpanel, selectedValue);
});

$(".modal-centered").on("show.bs.modal", Leaf.Ui.centerModals());

$(window).on("resize", Leaf.Ui.centerModals());

$(document).on("click", ".dropdown-menu input", function (e) {

    e.stopPropagation();
});

$("#query-name, #query-category").on("input change paste keyup", function (e) {

    Leaf.Ui.checkSavedQueryInformation();
});

$(document).on("click", ".subpanel-type ul li a", function (e) {

    var clicked = $(this).parent();

    if (clicked.attr("value") == 1 || clicked.attr("value") == 2) {
        e.stopPropagation();
    }

});

$(document).on("shown.bs.popover", ".panel-item-modifier", function (e) {

    var $clicked = $(this),
        $popover = $("#" + $clicked.attr("aria-describedby")),
        $inputs = $popover.find("input"),
        isBetween = $inputs.length > 1 ? true : false,
        panel = $clicked.parents(".panel").data("panelID"),
        subpanel = $clicked.parents(".panel-body").data("subpanelID"),
        panelItem = $clicked.siblings(".panel-item-dropdown").data("arrayPosition"),
        value = Leaf.Panels[panel].SubPanels[subpanel].PanelItems[panelItem].SqlNumericFilter;


    var value1 = isBetween ? value.substring(0, value.indexOf("AND")).trim() : value,
        value2 = isBetween ? value.substring(value.indexOf("AND") + 3, value.length).trim() : "";

    // Add the current numeric filter number to the first input
    $inputs.eq(0).val(value1)

    if (isBetween) {
        $inputs.eq(1).val(value2);
    }
});

$(document).on("click", ".numeric-filter-trigger li a", function (e) {

    var $clicked = $(this),
        newOperator = $clicked.parent().attr("value"),
        $popover = $clicked.parents(".popover-content"),
        $inputs = $clicked.parents(".numeric-filter-wrapper").find("input"),
        newStateIsBetween = newOperator == "BETWEEN" ? true : false,
        currentStateIsBetween = $inputs.length > 1 ? true : false,
        numericValue1 = $inputs.eq(0).val(),
        numericValue2 = currentStateIsBetween ? $inputs.eq(1).val() : null;


    // Update the button with the selected operator
    $clicked
      .parents(".popover")
      .find(".dropdown-toggle")
        .html(newOperator + "<span class='caret'></span>");


    //  if the new state of the popover doesn't match the old state, update the HTML
    if (newStateIsBetween != currentStateIsBetween) {


        var $newHtml = Leaf.HtmlGenerators.numericFilterPopover(newOperator, numericValue1, numericValue2);
        $newHtml.hide();


        $popover.find(".numeric-filter-wrapper").remove();
        $popover.append($newHtml);

        $newHtml.fadeIn(300);


        // The object that was click will be removed, so update the variable to the new equivalent
        $clicked = $newHtml.find(".numeric-filter-trigger li a");

    }


    Leaf.Ui.getPanelItemNumericFilterData($clicked);

});

$(document).on("click", "#btn-myleaf", function (e) {

    $("#modal-myleaf")
        .modal("show");
});

$(document).on("click", "#btn-frequent", function (e) {			//CHANGES NEEDED TO BE TRACKED

    $("#modal-frequent")
        .modal("show");
});

$(document).on("click", "#current-query-name li a", function (e) {

    var $clicked = $(this),
        newVal = $clicked.parent().attr("value");

    Leaf.Status.clearPanelsOnSaveQueryEvent = true;

    //  start new query
    if (newVal == 0) {
        Leaf.Ui.confirmNewQuery(Leaf.Ui.startNewQuery);
    }
        // save query
    else if (newVal == 1) {

        $("#modal-save-query").modal("show");
    }
});

$(document).on("click", "#options-newquery", function (e) {

    
    // reset the current saved query id if the user chooses to save
    var callback = function () {

        Leaf.Ui.startNewQuery();
    };

    Leaf.SavedQueries.callBackOnComplete = callback;


    //  start new query
    Leaf.Ui.confirmNewQuery(Leaf.Ui.startNewQuery);
    $(".carousel-button").removeClass("carousel-button-selected");
    $("#tab-find-patients").addClass("carousel-button-selected");

});

$(document).on("input change paste keyup", ".rcimport-formdate input", function () {


    Leaf.RCImport.validateFormDateField($(this));
});

$(document).on("input change paste keyup", "#rcimport-mrn", function () {

    Leaf.RCImport.validateMrnField();
});

$(document).on("input", ".numeric-filter-trigger", function (e) {

    var $input = $(this),
        value = $input.val(),
        isNumeric = Leaf.Utils.isNumeric(value),
        classToAdd = isNumeric ? "has-success" : "",
        classToRemove = isNumeric ? "" : "has-success",
        iconToAdd = isNumeric ? "glyphicon-ok" : "",
        iconToRemove = isNumeric ? "" : "glyphicon-ok";


    Leaf.Ui.setInputValidationState($input, classToAdd, classToRemove, iconToAdd, iconToRemove);


    Leaf.Ui.getPanelItemNumericFilterData($(this));
});

$(document).on("click", ".numeric-filter-remove", function (e) {

    var $popover = $(this).parents(".popover"),
        selectorId = "[aria-describedby=" + $(this).parents(".popover").attr("id") + "]",
        $panelItem = $(selectorId).parent(".panel-item-wrapper"),
        panel = $panelItem.parents(".panel").data("panelID"),
        subpanel = $panelItem.parents(".panel-body").data("subpanelID"),
        panelItem = $panelItem.children(".panel-item-dropdown").data("arrayPosition");

    $(selectorId)
        .data("bs.popover")
        .options
        .content = Leaf.HtmlGenerators.numericFilterPopover().html();
    
    $(selectorId).popover("hide");

    Leaf.Ui.setPanelItemNumericFilter(panel, subpanel, panelItem, "", "", false);
});

$(document).on("click", "#btn-confirm-yes, #btn-confirm-no", function (e) {

    var onClickEvent = $(this).data("onclick");
    $("#modal-confirmation").modal("hide");

    onClickEvent();
});

$(document).on("click", "#btn-cancel-query", function (e) {

    if (Leaf.Status.CurrentSavedQueryID === 0) { 
        $("#current-query-name").find("strong").html("New Query");
    }
});

$(document).on("click", ".popover-closer", function (e) {

    var $clicked = $(this),
        selectorId = "[aria-describedby=" + $clicked.parents(".popover").attr("id") + "]",
        $currentState = $clicked.parents(".numeric-filter-wrapper").parent(),
        $popover = $clicked.parents(".popover-content"),
        $inputs = $clicked.parents(".numeric-filter-wrapper").find("input"),
        isBetween = $inputs.length > 1 ? true : false,
        numericValue1 = $inputs.eq(0).val(),
        numericValue2 = isBetween ? $inputs.eq(1).val() : null,
        inputIsValid = true;


    if (!isBetween && Leaf.Utils.isNumeric(numericValue1) == false) {
        inputIsValid = false;
    }
    else if (isBetween && (Leaf.Utils.isNumeric(numericValue1) == false || Leaf.Utils.isNumeric(numericValue2) == false)) {
        inputIsValid = false;
    }


    if (inputIsValid) {

        $(selectorId)
            .data("bs.popover")
            .options
            .content = $currentState.html();

        $(selectorId).popover("hide");
    }
    else {

        Leaf.Ui.openMessageModal("Invalid Numeric Filter", "The number(s) you have entered to filter are invalid or blank. If you are filtering between two numbers, make sure both have a valid number entered.");
    }
});

$(document).on("click", "#session-login-button", function (e) {

    var sessionType = $(this).parent("div").siblings(".modal-body").find("input:checked").val();

    Leaf.Session.SessionType = sessionType;

    Leaf.Ajax.logInUser();
});

$(document).on("click", "#btn-save-query", function (e) {

    var $queryName = $("#query-name"),
        $queryCategory = $("#query-category"),
        $queryDescription = $("#query-description"),
        isActive = true;

    Leaf.Ajax.saveQuery($queryName.val(), $queryCategory.val(), $queryDescription.val(), isActive);

    $("#modal-save-query").modal("hide");
});

$(document).on("click", "#btn-save-querynew", function (e) {

    var $queryName = $("#query-name"),
        $queryCategory = $("#query-category"),
        $queryDescription = $("#query-description"),
        isActive = true;

    Leaf.Status.CurrentSavedQueryID = 0;

    Leaf.Ajax.saveQuery($queryName.val(), $queryCategory.val(), $queryDescription.val(), isActive);

    $("#modal-save-query").modal("hide");
});


/**
* called when click on the "X" of Optional Filters
*/
$(document).on("click", "#options-popover-close", function () {

    var $optionButton = $("#btn-options").find("button");

    $optionButton.popover("hide");
});

$(document).on("click", "#datasets-popover-close", function () {

    var popoverID = $(this).closest("div").attr("id");

    $("#" + popoverID).popover("hide");
});


/**
* An activated filter ( in the row above the panels ) was clicked.
* Deactivate the filter
*/
$(document).on("click", ".filter-highlight", function () {
  Leaf.Utils.Deactivate_a_filter( $(this) )
});

/**
* Deactivate / Remove a filter from the UI
*/
Leaf.Utils.Deactivate_a_filter = function ( theFilter ) {	
    var $clicked = theFilter,
        id = $clicked.data("id");

    $clicked.remove();
    Leaf.AuxiliaryQueries[id].isChecked = false;
    Leaf.Ui.Reset_Optional_Filters( Leaf.AuxiliaryQueries, id );

    // Revert the getCount button to RUN QUERY
    Leaf.Utils.updateQueryBuilderStatus(1);
};


/**
* Deactivate / Remove a filter from the UI , by ID like CF_77
*/
Leaf.Utils.Deactivate_a_filter_by_ID = function ( theFilter_ID ) {	
 Leaf.AuxiliaryQueries[ theFilter_ID ].isChecked = false;
    Leaf.Ui.Reset_Optional_Filters( Leaf.AuxiliaryQueries, theFilter_ID );

    // Revert the getCount button to RUN QUERY
    Leaf.Utils.updateQueryBuilderStatus(1);
    }


/**
* An "X" on a filter in the Optional filters modal dialog was clicked.
* Delete the filter from the optional filters list
* Remove the filter from the filter-highlight row
*/
$(document).on("click", ".optional-filter", function () {
    var $filter = $(this).parent().parent();
    var filterName = $filter.text(),
        filterText = $filter.next(".filter-2ndrow").text(),
        conceptID  = $filter[0].attributes["conceptList_ID"].nodeValue
        conceptKey = $filter[0].attributes["conceptList_Key"].nodeValue
        isActive = false;
   // $.each(Leaf.AuxiliaryQueries, function (index) {
   //     if (Leaf.AuxiliaryQueries[index].QueryText == filterName) {
   //         Leaf.AuxiliaryQueries[index].isActive = false;
   //         conceptID = index.replace(/cf_/, "");
   //     }
    // });
    $filter.next(".filter-2ndrow").remove(); // delete 2nd row
    $filter.remove();                        // delete 1st row
    // $(".filter-highlight").remove();         // delete any ( all ! ) filters from the top bar
    Leaf.Utils.Deactivate_a_filter_by_ID( conceptID )
    Leaf.Utils.SetFilterPopups( Leaf.AuxiliaryQueries );
    Leaf.Ajax.addCustomFilter(filterName, filterText, conceptKey, isActive); // delete the filter from the database
});

$(document).on("click", "#btn-csv-export", function (e) {

    Leaf.Ajax.getDataExport(null, null);
});


/**
* An "X" was clicked on the My Queries tab of the MyLeaf modal dialog.
* Delete the query from the list.
*/
$(document).on("click", "#myqueries-table .glyphicon-remove", function () {

    var $thisRow = $(this).parents("tr"),
        savedQueryId = $thisRow.children("td").eq(0).text().trim(),
        savedQuery = Leaf.SavedQueries.List[savedQueryId],
        onYes = function () {

            // call back for when the Ajax call to delete the query finishes
            var callback = function () {


                // clear the UI if they just deleted the currently opened query 
                if (+savedQueryId == +Leaf.Status.CurrentSavedQueryID) {
                    
                    $(".carousel-button").removeClass("carousel-button-selected");
                    $("#tab-find-patients").addClass("carousel-button-selected");

                    Leaf.Ui.startNewQuery();
                    Leaf.Status.CurrentSavedQueryID = 0;
                }

                $thisRow.fadeOut(500);

                // remove this row in the saved queries table
                Leaf.SavedQueries.Table
                    .row($thisRow)
                    .remove()
                    .draw();
            };


            // delete the query
            Leaf.SavedQueries.callBackOnComplete = callback;
            Leaf.Ajax.saveQuery(savedQuery.QueryName, savedQuery.QueryCategory, savedQuery.QueryDescription, false, +savedQueryId);
        },
        onNo = function () {

            // do nothing
        },
        onYesText = "Yes, delete this query",
        onNoText = "No, nevermind",
        title = "Delete Saved Query",
        message = "Are you sure you want to delete the query '" + savedQuery.QueryName + "'?";


    Leaf.Ui.openConfirmationModal(title, message, onYes, onNo, onYesText, onNoText);
});

$(document).on("click", ".patientlist-column-checkbox input[type=checkbox]", function () {


        var isChecked = $(this).prop("checked"),
            columnName = $(this).parent().siblings(".query-options-text").text(),
            columns = Leaf.PatientList.Table.columns().header(),
            columnIndex;

        for (var i = 0; i < columns.length; i++) {

            if (columns[i].textContent == columnName) {

                columnIndex = +columns[i].getAttribute("data-column-index");
                break;
            }
        }

        Leaf.PatientList.Table.columns(columnIndex).visible(isChecked);

        Leaf.PatientList.Columns[columnName].visible = isChecked;



        Leaf.Utils.getPatientListColumns();
    });


/**
* An enabled filter button was clicked to disable a filter ( "click" )
* A button was clicked in the filters-popover to enable a filter ( ".filter-toprow input[type=checkbox]" )
*/
$(document).on("click", ".filter-toprow input[type=checkbox]", function () {

        var isChecked = $(this).prop("checked"),
            id = $(this).attr("id").replace("#", "");

        Leaf.AuxiliaryQueries[id].isChecked = isChecked;

        if (isChecked) {
            var $newHighlight = Leaf.Ui.Build_newHightlight( id, Leaf.AuxiliaryQueries[id].QueryText );
            $("#btn-options").append($newHighlight);
        }
        else {
            $("#filter-" + id).remove();
        }

        // Revert the getCount button to RUN QUERY
        Leaf.Utils.updateQueryBuilderStatus(1);
    });


/**
* "Filters" was clicked on the Find Patients page.
* Close the Optional filters modal dialog.
*/
$("#btn-options").on("hidden.bs.popover", function (e) {
    Leaf.Ui.Reset_Optional_Filters( Leaf.AuxiliaryQueries );
    });

$(document).on("hide.bs.popover", ".patientlist-dataset", function (e) {

        var $dataset = $(this),
            $columns = $("#" + $dataset.attr("aria-describedby"))
                            .find(".patientlist-column-checkbox"),
            columns = [];

        $columns.each(function (index) {

            var column = $(this).find(".query-options-text").text();

            columns.push(Leaf.PatientList.Columns[column]);
        });

        $queriesHtml = $(Leaf.HtmlGenerators.patientListDatasetsPopover(columns));

        $dataset
            .data("bs.popover")
            .options
            .content = $queriesHtml.html();
    });

$(".drag").on("mousedown", function (e) {
        return $.vakata.dnd.start(e, {
            jstree: true, id: $(this).id,
            obj: $(this),
            nodes: [{ id: $(this).id, text: $(this).text() }]
        },
        //"<div id="jstree-dnd" class="jstree-default"><i class="jstree-icon jstree-er"></i>" + $(this).text() + "</div>");
        "<div id='jstree-dnd' class='dnd-item'>" + $(this).text() + "</div>");
    });

$(document).on("dnd_move.vakata", function (e, data) {
        var t = $(data.event.target);
        if (t.closest(".panel-body").length) {
            //data.helper.find(".jstree-icon").removeClass("jstree-er").addClass("jstree-ok");
            t.closest(".panel-body").addClass("dragHover");
        }
        else {
            //data.helper.find(".jstree-icon").removeClass("jstree-ok").addClass("jstree-er");
            $(".panel-body").removeClass("dragHover");
        }
    })

$(document).on("dnd_stop.vakata", function (e, data) {
        var t = $(data.event.target);


        if (t.closest(".panel-body").length) {

            var droppedConcept = Leaf.ConceptList[data.data.nodes[0].toString()],
                $subpanel = $(t.closest(".panel-body")),
                subpanel = $subpanel.data("subpanelID"),
                panel = $subpanel.parent(".panel").data("panelID");

            Leaf.Ui.addPanelItem(data.data.nodes[0].toString(), panel, subpanel);

            Leaf.Ajax.logConceptSelection(data.data.nodes[0].toString());
        }
    });

$(document).on("click", "#patientTable tbody tr td", function () {

        var $tr = $(this).closest("tr");
        var $symbol = $tr.find(".details-control").children("div");
        var row = Leaf.PatientList.Table.row($tr);


        if (row.length > 0) {

            if (row.child.isShown()) {

                // This row is already open - close it
                $("div.slider", row.child()).slideUp(function () {
                    row.child.hide();
                    $tr.removeClass("shown");
                    $symbol.removeClass("selected");
                });
            }
            else {

                // Open this row
                var childTable = Leaf.PatientList.HistorySubTable[row.data()[1]];

                row.child(childTable, "no-padding").show();
                $tr.addClass("shown");
                $symbol.addClass("selected");
                $("div.slider", row.child()).slideDown(2000);
            }
        }

    });

$("#btn-login-sessiontype .btn").on("click", function () {

        var sessionType = $(this).children("input").val(),
            nextSection;

        Leaf.Session.SessionType = sessionType;

        $("#login-sessiontype")
          .nextAll(".login-section")
            .remove();

        if (sessionType == "QI") {
            nextSection = Leaf.HtmlGenerators.loginHaveDocumentation("I have Approved QI documentation");
        }
        else if (sessionType == "Research") {
            nextSection = Leaf.HtmlGenerators.loginHaveDocumentation("I have an Approved IRB");
        }
        else if (sessionType == "Other") {

            nextSection = Leaf.HtmlGenerators.loginPurposeOther();
        }

        var nextSection = $(nextSection)
                                .hide()
                                .fadeIn(1000);

        $("#login-carousel-options").append(nextSection);
    });

$(document).on("click", "#btn-login-documentation .btn", function () {

        var hasDocumentation = $(this).children("input").val(),
            documentationType = Leaf.Session.SessionType == "Research" ? "IRB Number" : "QI Document Title",
            identifiedIsDisabled = false,
            nextSection;

        $("#login-documentation")
          .nextAll(".login-section")
            .remove();

        // If the user has an approved IRB or QI documentation
        if (hasDocumentation == 1) {

            nextSection = Leaf.HtmlGenerators.loginDocumentationInformation(documentationType);
        }
        else if (hasDocumentation == 0) {

            if (Leaf.Session.SessionType != "Other") {
                identifiedIsDisabled = true;
            }

            // 3031 -   allow only de-identified mode
            // nextSection = Leaf.HtmlGenerators.loginIdentificationType(true);
            nextSection = Leaf.HtmlGenerators.loginIdentificationType(identifiedIsDisabled);
        }

        nextSection = $(nextSection)
                                .hide()
                                .fadeIn(1000);

        $("#login-carousel-options").append(nextSection);
    });

$(document).on("input propertychange", "textarea[name='login-purposeother']", function () {

        var userText = $(this).val(),
            $existingIdentificationHeader = $("#login-identificationtype");

        if (userText != "" && $existingIdentificationHeader.length == 0) {

            var nextSection = Leaf.HtmlGenerators.loginIdentificationType(false);


            nextSection = $(nextSection)
                                    .hide()
                                    .fadeIn(1000);

            $("#login-carousel-options").append(nextSection);

            Leaf.Session.isSessionDocumentationComplete = true;
        }
        else if (userText == "") {

            Leaf.Session.isSessionDocumentationComplete = false;
            $existingIdentificationHeader.remove();
        }
    });

$(document).on("keyup", "#modal-login .form-group input", function () {

        var documentId = $("#documentation-id").val().trim(),
            documentInstitution = $("#documentation-institution").val().trim(),
            documentExpireDate = $("#documentation-date").val().trim(),
            submitStatus = $("#documentation-status"),
            statusMessage,
            dataIsComplete = true,
            $existingIdentificationHeader = $("#login-identificationtype"),
            documentationType = Leaf.Session.SessionType == "Research" ? "IRB Number" : "QI Document Title";



        if (documentId == "") {
            statusMessage = "Please add a valid " + documentationType;
            dataIsComplete = false;
        }
        else if (documentInstitution == "") {
            statusMessage = "Please add an approving institution";
            dataIsComplete = false;
        }
        else if (documentExpireDate == "") {
            statusMessage = "Please add the date the document is valid until";
            dataIsComplete = false;
        }

        if (dataIsComplete && $existingIdentificationHeader.length == 0) {

            var nextSection = Leaf.HtmlGenerators.loginIdentificationType(false);

            nextSection = $(nextSection)
                                .hide()
                                .fadeIn(1000);

            $("#login-carousel-options").append(nextSection);

            submitStatus.text("");
            Leaf.Session.isSessionDocumentationComplete = true;
        }
        else if (!dataIsComplete) {

            submitStatus.text(statusMessage);
            Leaf.Session.isSessionDocumentationComplete = false;

            $existingIdentificationHeader.remove();
        }
    });


$(document).on("contextmenu", "#list-parent .jstree-anchor", function (e) {
        $(".vakata-context").css({
            display: "block",
            left: e.pageX,
            top: e.pageY
        });
        return false;
    });

$(document).on("contextmenu", "#list-search .jstree-anchor", function (e) {
        $(".vakata-context").css({
            display: "block",
            left: e.pageX,
            top: e.pageY
        });
        return false;
    });

$(".vakata-context").mouseleave(function (e) {
        $(".vakata-context").hide();
    });

$(document).on("click", "#btn-export", function () {

    if (Leaf.Status.PatientListTotalCount_data > Leaf.Global.RedcapExportWarning && Leaf.Status.PatientListTotalCount_data < Leaf.Global.RedcapExportLimit) {

        // warn the user if they are potentially exporting a lot of records
        Leaf.Ui.openMessageModal( "Export Warning", "Export of more than "
            + Leaf.Utils.addCommasToNumber(Leaf.Global.RedcapExportWarning)
            + " records may take a long time, and cannot be canceled. The current selection contains "
            + Leaf.Utils.addCommasToNumber(Leaf.Status.PatientListTotalCount_data) + " total records. Please only export datasets that you need for analysis."
        );
    } 



    if (Leaf.Status.PatientListTotalCount_data > Leaf.Global.RedcapExportLimit) {

        // and restrict export if it is over the row limit
        Leaf.Ui.openMessageModal("Can't Export Data", "Leaf cannot export more than "
            + Leaf.Utils.addCommasToNumber(Leaf.Global.RedcapExportLimit)
            + " records."
        );
    }

    else {
        if (Leaf.Status.CurrentSavedQueryID != 0) {

            if (Leaf.SavedQueries.List[Leaf.Status.CurrentSavedQueryID].REDCapProjectID == null) {

                $("#modal-exportToRedcap").modal("show");
            } 
            else {

                Leaf.Ajax.getDataExport_REDCap();
            }
        }
        else if (Leaf.Status.CurrentSavedQueryID == 0) {

            var onYes = function () {
                
                Leaf.Ui.openSaveQueryModal();
                Leaf.SavedQueries.callBackOnComplete = function () { $("#modal-exportToRedcap").modal("show"); };
                },
                onNo = function () { },
                bodyText = "Only Saved Queries can be exported. Would you like to save the current query?";

            Leaf.Ui.openConfirmationModal("Save Query before Export", bodyText, onYes, onNo, "Yes, Save Query then Export Data", "No");
        }
    }
});

$(document).on("click", "#btn-ExportData", function () {
        $("#modal-exportToRedcap").modal("hide");

        Leaf.Ajax.getDataExport_REDCap();

    });

$("#patientlist-tree").on("select_node.jstree", function (e, data) {

        var $this = $("#patientlist-tree #" + data.node.id),
            dataset = Leaf.PatientListDatasets[data.node.id],
            newState = !dataset.isChecked;

        if (dataset.is_Queryable) {
            $this.find("input").prop("checked", newState);
            data.node.isChecked = newState;
            Leaf.PatientListDatasets[data.node.id].isChecked = newState;

            var $wrapper = $("#patientlist-selected");

            if (newState) {

                var $selected = $("<div class='patientlist-selected'>" + dataset.QueryOutputDisplay + "</div>");
                $selected.data("id", dataset.id);

                $wrapper.append($selected);
            }
            else {

                $wrapper.find(":contains(" + dataset.QueryOutputDisplay + ")").remove();
            }
        }
    });

$(document).on("click", "#btn-savePatientList-new", function () {

        var name = $("#patientlist").val().trim(),
            isActive = true;

        Leaf.Status.CurrentPatientListTemplateID = 0;

        Leaf.Ajax.savePatientListTemplate(name, isActive);
        $("#modal-savePatientList").modal("hide");
    });

$(document).on("click", "#btn-savePatientList-delete", function () {

        var name = $("#patientlist").val().trim(),
            isActive = false;

        var modalTitle = "Delete Patient List View",
            modalContent = "Are you sure you want to delete the Patient List View '" + name + "'?",
            yesButtonText = "Yes",
            noButtonText = "No",
            onClickYes = function () {

                Leaf.Ajax.savePatientListTemplate(name, isActive);
                $("#modal-savePatientList").modal("hide");
            },
            onClickNo = function () {

                $("#modal-confirmation").modal("hide");
            };

        Leaf.Ui.openConfirmationModal(modalTitle, modalContent, onClickYes, onClickNo, yesButtonText, noButtonText);
    });

$(document).on("click", "#btn-savePatientList", function () {

        var name = $("#patientlist").val().trim(),
            isActive = true;

        Leaf.Ajax.savePatientListTemplate(name, isActive);
        $("#modal-savePatientList").modal("hide");
    });

$(document).ready(function () {

        // Show or hide the sticky footer button
        $(window).scroll(function () {
            if ($(this).scrollTop() > 200) {
                $(".go-top").fadeIn(200);
            } else {
                $(".go-top").fadeOut(200);
            }
        });

        // Animate the scroll to top
        $(".go-top").click(function (event) {
            event.preventDefault();

            $("html, body").animate({ scrollTop: 0 }, 300);
        })
    });

$(document).on("click", "#btn-rcimport-forward", function () {


        var callback = function () {

            // save whatever input data we have
            Leaf.RCImport.saveInputData();


            // increment the UI step
            var nextStep = Leaf.RCImport.CurrentUiStep += 1;


            // move to the next screen
            Leaf.RCImport.moveStep(nextStep);
        }


        // if the user is just putting in an API token, do the Ajax call
        if (Leaf.RCImport.CurrentUiStep == 1) {


            var token = $("#rcimport-token").val().trim();


            if (token.length > 0) {

                // generate binding
                Leaf.Ajax.generateREDCapLeafBinding(token, callback);
            }

            else {

                // tell the user to input a token
                Leaf.Ui.openMessageModal("Enter API Token", "Enter a valid API token to proceed and import your Project");
            }
        }


            // else the user is selecting the MRN field
        else if (Leaf.RCImport.CurrentUiStep == 2) {


            var mrnfield = $("#rcimport-mrn").val().trim();


            if (mrnfield.length == 0) {

                // tell the user to select and MRN field
                Leaf.Ui.openMessageModal("Enter MRN Field", "Enter a valid MRN field for Leaf to identify patients in your Project.");
            }

            else {

                var isValidField = $.inArray(mrnfield, Leaf.RCImport.Binding.AvailableFields) !== -1 ? true : false; 


                // if it includes a proper field
                if (isValidField) {

                    callback();
                }

                else {

                    // tell the user to enter a valid MRN field
                    Leaf.Ui.openMessageModal("Enter MRN Field", "The field you have entered does not appear to be in the REDCap Project. Enter a valid MRN field for Leaf to identify patients in your Project.");
                }

            }
        }

            // else if the user has requested the import, do that
        else if (Leaf.RCImport.CurrentUiStep == 3) {


            // check that all form dates are either valid or have blanks
            var isValid = Leaf.RCImport.validateAllFormDateFields();


            if (isValid) {

                callback();
            }

                // else let the user know that the bindings are invalid
            else {

                Leaf.Ui.openMessageModal("Invalid Form Dates", "One or more of the date fields does not appear to exist within the Project. Check that all date fields are correct or are blank.");
            }

        }

            // else just move the modal forward
        else {

            callback();
        }


    
    });

$(document).on("click", "#btn-rcimport-back", function () {


        // save whatever input data we have
        Leaf.RCImport.saveInputData();


        // increment the UI step
        var nextStep = Leaf.RCImport.CurrentUiStep -= 1;


        // move to the next screen
        Leaf.RCImport.moveStep(nextStep);
    });

$("#btn-rcimport-newproject").on("click", function () {
    

        // close the my leaf model
        $("#modal-myleaf").modal("hide");

    
        // open the RcImport modal
        Leaf.RCImport.moveStep(1);
    });

$(document).on("click", ".rcimport-projects .glyphicon-remove", function () {


        // initialize variables to confirm deletion of the project
    var $clicked = $(this),
        $thisRow = $clicked.parents("tr"),
        projectId = $clicked.parent("td").siblings("td").eq(1).text(),
        project = Leaf.RCImport.Projects[projectId],
        title = "Delete Imported REDCap Project",
        message = "Are so you sure you want to delete the Project '" + project.ProjectTitle + "'? This will only delete data in Leaf; your original data in REDCap will not be touched.",
        onYes = function () {

            // call back for when the Ajax call to delete the project finishes
            var callback = function () {

                $thisRow.fadeOut(500);

                // remove this row in the saved queries table
                Leaf.RCImport.Table
                    .row($thisRow)
                    .remove()
                    .draw();
            };

            Leaf.Ajax.deleteREDCapProject(JSON.parse(project.PreviousLeafBinding), callback);
        },
        onNo = function () {
                // do nothing
            },
        onYesText = "Yes, delete the imported Project",
        onNoText = "No, nevermind";

        Leaf.Ui.openConfirmationModal(title, message, onYes, onNo, onYesText, onNoText);
    });

/**
* An "Open" was clicked on My Queries tab of the the MyLeaf modal dialog.
* Open the query.
*/
$(document).on("click", ".myqueries-open", function () {

    var $thisRow = $(this).parents("tr"),
        savedQueryId = $thisRow.children("td").eq(0).text().trim(),
        savedQuery = Leaf.SavedQueries.List[savedQueryId];

    // this is the function that will be called if there is no data to be saved,
    // or if they choose not to save whatever there is
    var callbackEvent = function () {

        $("#resultCarousel").carousel(0);
        $("#modal-myleaf").modal("hide");

        var queryMetadata = JSON.parse(savedQuery.QueryJson),
            queryPanelItems = JSON.parse(savedQuery.QueryPanelItems),
            $currentQueryHeader = $("#current-query-name").find("strong");
        var queryFilterItems = JSON.parse(savedQuery.FilterJson);

        // start a new query depending on the user's answer
        Leaf.Ui.startNewQuery();
        Leaf.Ui.setQueryDefinition(queryMetadata, queryPanelItems, queryFilterItems);

        // reset the header in the UI to indicate a new query opened
        $currentQueryHeader.text(savedQuery.QueryName);
        $("#totalCount").html("");

        Leaf.Panels = queryMetadata;
        Leaf.Status.CurrentSavedQueryID = savedQueryId;
    };


    Leaf.Ui.confirmNewQuery(callbackEvent);
});

//================================================
// REDCap Import functions
//================================================
Leaf.RCImport.setProcessStepStatus = function () {

        var $steps = $(".process-steps li");

        $.each($steps, function () {

            var step = +this.dataset.step,
                $dot = $(this);


            // if the step is ahead of the current UI step,
            // remove the checked and done classes
            if (step > Leaf.RCImport.CurrentUiStep) {

                $dot.removeClass("done")
                    .removeClass("checked")
                    .addClass("todo");
            }

                // else if it is the step, remove the checked class
            else if (step == Leaf.RCImport.CurrentUiStep) {

                $dot.removeClass("todo")
                    .removeClass("checked")
                    .addClass("done");
            }

                // else if the UI is ahead of the step, check it as complete
            else if (step < Leaf.RCImport.CurrentUiStep) {

                $dot.removeClass("todo")
                    .addClass("done")
                    .addClass("checked");
            }
        })
    };

Leaf.RCImport.moveStep = function (step) {


        // update the current UI step
        Leaf.RCImport.CurrentUiStep = step;


        // select the RC import body element
        var $RCImportBody = $("#rcimport-body"),
            $modal = $("#modal-rcimport"),
            $newContent;


        // remove the overflow limit
        $RCImportBody.removeClass("no-overflow");


        // update the text for buttons in the lower left and right
        Leaf.RCImport.setButtonText();


        // close the modal 
        if (Leaf.RCImport.CurrentUiStep == 0) {


            $modal.modal("hide");
        }


            // move to the enter API token screen
        else if (Leaf.RCImport.CurrentUiStep == 1) {


            $newContent = $(Leaf.HtmlGenerators.RCImportAddToken());


            // we need to reinitialize the JS tree as well
            Leaf.RCImport.loadExampleTree($newContent);


            // add the API token
            $newContent
              .find("#rcimport-token")
                .val(Leaf.RCImport.Binding.ApiToken);
        }


            // move to the choose MRN field screen
        else if (Leaf.RCImport.CurrentUiStep == 2) {


            $newContent = $(Leaf.HtmlGenerators.RCImportChooseMrnField());


            // add the MRN field Leaf found, if any
            if (Leaf.RCImport.Binding.PatientIDFieldName != "") { 


                $newContent
                  .find("#rcimport-mrn")
                    .val(Leaf.RCImport.Binding.PatientIDFieldName);
        

                $newContent
                  .find(".has-feedback")
                    .addClass("has-success");


                $newContent
                  .find(".form-control-feedback")
                    .addClass("glyphicon-ok");
            }

            // add the search functionality
            Leaf.Ui.initializeClientSearch($newContent, Leaf.RCImport.Binding.AvailableFields);
        }


            // move to the form detail screen
        else if (Leaf.RCImport.CurrentUiStep == 3) {


            // some projects have a lot of forms, so disallow overflow and add a scrollbar
            $RCImportBody.addClass("no-overflow");


            $newContent = $(Leaf.HtmlGenerators.RCImportAddForms(Leaf.RCImport.Binding.Forms));


            // add the search functionality and date fields for each form
            $.each($newContent.siblings(".form-group"), function (index) {


                var $form = $(this),
                    $input = $form.children("input"),
                    data = Leaf.RCImport.Binding.Forms[index];
                

                // populate the form with data
                $form.children("label")
                    .text(data.FormName)
                    .prop("for","rcimport-form-" + data.FormName);


                $input.prop("id","rcimport-form-" + data.FormName);


                // add the search functionality
                Leaf.Ui.initializeClientSearch($form, data.AvailableDateFields);

 
                // populate the value with the field Leaf found, if any
                if (data.DateField !== "" && data.DateField !== null) { 

                    $input.val(data.DateField);
                    Leaf.Ui.setInputValidationState($input, "has-success", "", "glyphicon-ok", "");
                }
            });
        }


            // import the project
        else if (Leaf.RCImport.CurrentUiStep == 4) {


            // reset the form and hide the modal
            $RCImportBody.addClass("no-overflow");
            $modal.modal("hide");


            Leaf.Ajax.importREDCapProject();
        }



        // check if we need to update the DOM
        if (typeof ($newContent) !== "undefined") {


            // remove the previous content
            $RCImportBody
              .children()
                .remove();


            // just to be fancy, let's fade in the new content
            $newContent.hide();


            // add the new content
            $RCImportBody
                .append($newContent);


            // fade it in
            $newContent.fadeIn(1000);
            $modal.modal("show");
        }

        // update the process steps at the top for the user
        Leaf.RCImport.setProcessStepStatus();
    };

Leaf.RCImport.validateAllFormDateFields = function () {


    
        // initialize forms and values
        var forms = {},
            $forms = $(".rcimport-formdate"),
            isValid = true;


        // put each form name into an object array
        for (var i = 0; i < Leaf.RCImport.Binding.Forms.length; i++) {

            var form = Leaf.RCImport.Binding.Forms[i];

            forms[form.FormName] = form;
        }



        // validate each form
        $.each($forms, function (index) {


            var $form = $(this),
                $input = $form.find("input.tt-input"),
                formName = $form.children("label").text(),
                value = $input.val(),
                data = Leaf.RCImport.Binding.Forms[index];


            // check if it is a valid field or not
            var isValidField = $.inArray(value, forms[formName].AvailableDateFields) !== -1 ? true : false; 


            if (!isValidField && value !== "") {

                isValid = false;
            }
        });

        return isValid;
    };

Leaf.RCImport.validateMrnField = function () {

    var $input = $("#rcimport-mrn"),
        value = $input.val(),
        isValidField = $.inArray(value, Leaf.RCImport.Binding.AvailableFields) !== -1 ? true : false, 
        classToAdd = isValidField ? "has-success" : "has-warning",
        classToRemove = isValidField ? "has-warning" : "has-success",
        iconToAdd = isValidField ? "glyphicon-ok" : "glyphicon-warning-sign",
        iconToRemove = isValidField ? "glyphicon-warning-sign" : "glyphicon-ok";


    Leaf.Ui.setInputValidationState($input, classToAdd, classToRemove, iconToAdd, iconToRemove);
};

Leaf.RCImport.validateFormDateField = function ($input) {


        // initialize forms and values
        var forms = {},
            $form = $input.parents(".form-group"),
            formName = $form.children("label").text(),
            // $input = $form.children("#rcimport-form-" + formName),
            value = $input.val();


        // put each form name into an object array
        for (var i = 0; i < Leaf.RCImport.Binding.Forms.length; i++) {

            var form = Leaf.RCImport.Binding.Forms[i];

            forms[form.FormName] = form;
        }


        // check if it is a valid field or not
        var isValidField = $.inArray(value, forms[formName].AvailableDateFields) !== -1 ? true : false; //  .includes(value);


        // initialize validation state parameters
        var classToAdd,
            classToRemove,
            iconToAdd,
            iconToRemove;


        // if the field is valid, indicate that
        if (isValidField) {

            classToAdd = "has-success",
            classToRemove = "has-warning",
            iconToAdd = "glyphicon-ok",
            iconToRemove = "glyphicon-warning-sign";

            Leaf.Ui.setInputValidationState($input, classToAdd, classToRemove, iconToAdd, iconToRemove);
        }


            // else if the field is not valid and not blank, indicate a warning
        else if (!isValidField && value != "") {

            classToAdd = "has-warning",
            classToRemove = "has-success",
            iconToAdd = "glyphicon-warning-sign",
            iconToRemove = "glyphicon-ok";

            Leaf.Ui.setInputValidationState($input, classToAdd, classToRemove, iconToAdd, iconToRemove);
        }


            // else the field is blank, so remove all indications
        else {

            Leaf.Ui.setInputValidationState($input, "", "has-success", "", "glyphicon-ok");
            Leaf.Ui.setInputValidationState($input, "", "has-warning", "", "glyphicon-warning-sign");
        }
    }

Leaf.RCImport.setButtonText = function () {

        var $left = $("#btn-rcimport-back"),
            $right = $("#btn-rcimport-forward");


        // the initial setup screen with token
        if (Leaf.RCImport.CurrentUiStep == 1) {

            $left.text("Cancel");
            $right.text("Load Project Info from REDCap");
        }

            // the set MRN screen
        else if (Leaf.RCImport.CurrentUiStep == 2) {

            $left.text("Go Back");
            $right.text("Continue");
        }

        // the set form info screen
        if (Leaf.RCImport.CurrentUiStep == 3) {

            $left.text("Go Back");
            $right.text("Import my Project");
        }
    };

Leaf.RCImport.loadExampleTree = function ($parentNode) {


        var patientCountMarkup = "<span class='concept-patientcount'><span class='glyphicon glyphicon-user'></span>";

        var exampleData = [
            { id: 'exForm', parent: '#', text: 'Follow-up - Month 1' + patientCountMarkup + '43</span>', icon: 'glyphicon glyphicon-user glyphicon-parent' },
            { id: 'exMonth', parent: 'exForm', text: 'Date of Month 1 visit' + patientCountMarkup + '42</span>', icon: 'glyphicon glyphicon-user' },
            { id: 'exICD', parent: 'exForm', text: 'ICD9' + patientCountMarkup + '19</span>', icon: 'glyphicon glyphicon-user' },
            { id: 'exSerumAlbumin', parent: 'exForm', text: 'Serum Albumin (g/dL)' + patientCountMarkup + '29</span>', icon: 'glyphicon glyphicon-user' },
            { id: 'exSerumPrealbumin', parent: 'exForm', text: 'Serum Prealbumin (mg/dL)' + patientCountMarkup + '43</span>', icon: 'glyphicon glyphicon-user' },
            { id: 'exCreatinine', parent: 'exForm', text: 'Creatinine (mg/dL)' + patientCountMarkup + '43</span>', icon: 'glyphicon glyphicon-user' }
        ];

        $parentNode.find('#rcimport-example-tree').jstree({
            core: {
                data: exampleData,
                themes: {
                    dots: false
                }
            }
        });
    };

Leaf.RCImport.saveInputData = function () {


        // the initial setup screen with token
        if (Leaf.RCImport.CurrentUiStep == 1) {


            Leaf.RCImport.Binding.ApiToken = $("#rcimport-token").val().trim();
        }

            // the set MRN screen
        else if (Leaf.RCImport.CurrentUiStep == 2) {


            Leaf.RCImport.Binding.PatientIDFieldName = $("#rcimport-mrn").val().trim();
        }

        // the set form info screen
        if (Leaf.RCImport.CurrentUiStep == 3) {


            var $forms = $(".rcimport-formdate");


            // reset the forms
            $.each($forms, function (index) {


                var $form = $(this),
                    $input = $form.children("input"),
                    value = $input.val(),
                    data = Leaf.RCImport.Binding.Forms[index];

            
                Leaf.RCImport.Binding.Forms[index].DateField = value;
            });


        }
    };

Leaf.RCImport.createProjectsTable = function () {

    // remove any previously created table
    $("#rcimport-projects").DataTable().destroy({ remove: true });


    // generate and append the table 
    var $importedProjectsTable = $(Leaf.HtmlGenerators.RCImportProjectsTable());
    $("#myrcimports-table-wrapper").append($importedProjectsTable);



    // and convert it to a data table
    Leaf.RCImport.Table = $("#rcimport-projects")
        .DataTable({
            dom: "t"
        });
    };

//================================================
// Ajax functions 
//================================================
Leaf.Ajax.getUserSessionOptions = function () {

        var sessionObject = {
            authToken: Leaf.Session.AuthToken
        };

        $.ajax({
            type: "POST",
            url: uriPrefix + "GetUserSessionOptions",
            contentType: "application/json; charset=utf-8",
            async: true,
            cache: false,
            data: JSON.stringify(sessionObject),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);
            },
            success: function (data) {

                console.log(data);

                Leaf.Session.isAdmin = data["GetUserSessionOptionsResult"].isAdmin;
                Leaf.Session.isUser = data["GetUserSessionOptionsResult"].isUser;
                Leaf.Session.isDeidentifiedOnlyUser = data["GetUserSessionOptionsResult"].isDeidentifiedOnlyUser;


                // show the login screen
                $("#login-loading-ajax").hide();
                $("#login-sessiontype").fadeIn(500);


                // limit to de- identified and show the user if flag is set
                if (Leaf.Session.isDeidentifiedOnlyUser) {

                    $("#login-loading-deidentified").fadeIn(500);
                }

            },
            error: function (xmlHttpRequest, status, errorThrown) {

                Leaf.Ui.openMessageModal("Cannot Login User", "Leaf encountered an error while trying to load user permissions. Please try closing and reopening your browser and try again, and if this does not work, contact a Leaf administrator.");
                $("#modal-login .modal-dialog").remove()

                console.log(errorThrown);
            }
        });
    };

Leaf.Ajax.saveConcept = function (concept, isEnabled, callback) {


        var conceptObject = {
            concept: concept,
            authToken: Leaf.Session.AuthToken,
            isEnabled: isEnabled
        };

        $.ajax({
            type: "POST",
            url: uriPrefix + "SaveConcept",
            contentType: "application/json; charset=utf-8",
            async: true,
            cache: false,
            data: JSON.stringify(conceptObject),
            complete: function () {
                $("#modal-patientlist-updating").modal("hide")
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);
            },
            success: function (data) {

                var returnedConcept = data["SaveConceptResult"];


                console.log(data);


                // check first that a concept was actually returned
                if (returnedConcept != null) {

                    // update the concept list with the returned concept
                    Leaf.ConceptList[returnedConcept.id] = returnedConcept;


                    // update the concept wiki with the new info
                    Leaf.Ui.populateConceptWikiWithConceptInfo(returnedConcept.id);
                }


                // hide the modal
                $("#modal-conceptWiki").modal("hide");
                Leaf.Status.isConceptEditModeOn = false;


                // run the callback, if applicable
                if (typeof (callback) != "undefined") {

                    callback(returnedConcept);
                }
            },
            error: function (xmlHttpRequest, status, errorThrown) {

                Leaf.Ui.openMessageModal("Cannot Add/Update Concept", "Leaf encountered an error while trying to update a concept. Please try again later.");

                console.log(errorThrown);
            }
        });

    };

Leaf.Ajax.getDataExport_CSV = function (selectedExportTypes, currentType, currentProgress) {

        var beginningPercent = 25,
            totalExports;

        if (selectedExportTypes == null) {

            selectedExportTypes = $("#export-list")
                                      .jstree("get_selected");
            currentType = 0;
            currentProgress = 0;
        }

        totalExports = selectedExportTypes.length;
        currentProgress += beginningPercent / totalExports;

        Leaf.Ui.openAndUpdateProgressModal(currentProgress, "Export " + (currentType + 1) + " of " + totalExports + " - Querying Database...", "CSV Download");

        var conceptItems = Leaf.Utils.getCurrentQueryConceptItems(),
            queryMetadata = JSON.parse(JSON.stringify(Leaf.Panels));

        queryMetadata = Leaf.Utils.addSelectedAuxiliaryQueries(queryMetadata);

        var panelObject = {
            panels: queryMetadata,
            panelsJson: JSON.stringify(queryMetadata),
            authToken: Leaf.Session.AuthToken,
            conceptItems: JSON.stringify(conceptItems),
            queryType: Leaf.DataExportTypes[selectedExportTypes[currentType]].QueryOutputName
        };

        $.ajax({
            type: "POST",
            url: uriPrefix + "GetDataExportCSV",
            contentType: "application/json; charset=utf-8",
            async: true,
            cache: false,
            data: JSON.stringify(panelObject),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);

            },
            complete: function () {

            },
            success: function (data) {

                currentProgress += beginningPercent / totalExports;

                Leaf.Ui.openAndUpdateProgressModal(currentProgress, "Export " + (currentType + 1) + " of " + totalExports + " - Preparing Dataset...", "CSV Download");

                Leaf.BackgroundWorker.postMessage({ cmd: "ProcessCsv", data: JSON.stringify(data["GetDataExportResult"]), currentProgress: currentProgress, selectedExportTypes: selectedExportTypes, currentType: currentType });
            },
            error: function (xmlHttpRequest, status, errorThrown) {

                console.log(errorThrown);
            }
        });
    };

Leaf.Ajax.getSearchCodeConversion = function (searchVal) {

        var searchObject = {
            searchString: searchVal
        };

        $.ajax({
            type: "POST",
            url: uriPrefix + "GetSearchCodeConversion",
            contentType: "application/json; charset=utf-8",
            async: true,
            cache: false,
            data: JSON.stringify(searchObject),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);
            },
            success: function (data) {

                var newCode = {};

                // If the search returns any results
                if (data["GetSearchCodeConversionResult"].length) {

                    newCode.TargetCode = data["GetSearchCodeConversionResult"][0][0].Value.value;
                    newCode.TargetCodeType = data["GetSearchCodeConversionResult"][0][1].Value.value;
                    newCode.ui_Display_TargetName = data["GetSearchCodeConversionResult"][0][2].Value.value;

                    // The user may have cleared/changed the search field since the query was
                    // ran, so at least check to make sure the search field is not currently blank
                    var searchStringLength = $("#conceptSearch").val().trim().length

                    if (searchStringLength > 0) {
                        Leaf.Utils.updateSearchCodeEquivalent(newCode);
                    }
                }
            },
            error: function (xmlHttpRequest, status, errorThrown) {
                console.log(errorThrown);
            }
        });
    };

Leaf.Ajax.logInUser = function () {

        var loginObject = {
            authToken: Leaf.Session.AuthToken,
            sessionType: Leaf.Session.SessionType,
            identificationType: Leaf.Session.IdentificationType,
            documentationID: $("#documentation-id").val(),
            documentationApprovingBody: $("#documentation-institution").val(),
            documentationExpireDate: $("#documentation-date").val(),
            sessionPurposeDescription: $("#login-purposeother").val()
        };

        $.ajax({
            type: "POST",
            url: uriPrefix + "LogInUser",
            contentType: "application/json; charset=utf-8",
            async: true,
            cache: false,
            data: JSON.stringify(loginObject),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);
            },
            success: function (data) {

                $("#login-status").text("Initializing Concept Tree...");
                $("#splash-background").remove();


                var resultData = data["LoginUserResult"];
                $("#user-name").text(resultData.UserID);
                Leaf.Session.UserID = resultData.UserID;
                $("#session-type").text(resultData.SessionType + " (" + Leaf.Session.IdentificationType + ")");

                // User logged in, so initialize the Concept Tree
                Leaf.Ui.initializeConceptTrees();



                if (resultData.AuxiliaryQueries.length > 0) {

                    for (var i = 0; i < resultData.AuxiliaryQueries.length; i++) {

                        var newPanel = new Leaf.Models.Panel(),
                            newSubpanel = new Leaf.Models.SubPanel(),
                            newPanelItem = new Leaf.Models.PanelItem();

                        newPanel.PanelItemCount = 1;
                        newPanel.PanelType = 1;
                        newPanel.includePanel = resultData.AuxiliaryQueries[i].isInclusionCriteria;
                        newPanel.isDateFiltered = false;
                        newPanel.Domain = "Filter - " + resultData.AuxiliaryQueries[i].QueryName;

                        newPanelItem.ConceptID = resultData.AuxiliaryQueries[i].ID;
                        newPanelItem.SqlSetName = resultData.AuxiliaryQueries[i].SqlSetFrom;
                        newPanelItem.SqlWhereClause = resultData.AuxiliaryQueries[i].SqlSetWhere;

                        newSubpanel.PanelItems.push(newPanelItem);
                        newPanel.SubPanels.push(newSubpanel);

                        var newQueryId = resultData.AuxiliaryQueries[i].ID;

                        Leaf.AuxiliaryQueries[newQueryId] = {};

                        Leaf.AuxiliaryQueries[newQueryId].isChecked = false;
                        Leaf.AuxiliaryQueries[newQueryId].Panel = newPanel;
                        Leaf.AuxiliaryQueries[newQueryId].ID = resultData.AuxiliaryQueries[i].ID;
                        Leaf.AuxiliaryQueries[newQueryId].QueryText = resultData.AuxiliaryQueries[i].QueryText;
                        Leaf.AuxiliaryQueries[newQueryId].QueryDescription = resultData.AuxiliaryQueries[i].QueryDescription;
                        Leaf.AuxiliaryQueries[newQueryId].isActive = resultData.AuxiliaryQueries[i].isActive;
                        Leaf.AuxiliaryQueries[newQueryId].isCustomFilter = resultData.AuxiliaryQueries[i].isCustomFilter;


                    }
                }

                var $optionButton = $("#btn-options")
                                        .find("button"),
                    $queriesHtml = $(Leaf.HtmlGenerators.filtersPopover(Leaf.AuxiliaryQueries));

                // Set the popover
                $optionButton.popover({
                    trigger: "click",
                    content: $queriesHtml.html(),
                    html: true,
                    container: "body",
                    placement: "bottom",
                    title: "Optional Filters" + "<span id='options-popover-close' class='glyphicon glyphicon-remove'></span>"
                });

                $optionButton
                    .data("bs.popover")
                    .tip()
                    .addClass("customFilter-popover");
    

                for (var i = 0; i < resultData.PatientListTemplates.length; i++) {

                    Leaf.PatientList.Templates[resultData.PatientListTemplates[i].PatientListID] = {};

                    Leaf.PatientList.Templates[resultData.PatientListTemplates[i].PatientListID] = resultData.PatientListTemplates[i];

                }

                Leaf.Ui.populatePatientListTemplateDropDown();



                for (var i = 0; i < resultData.PatientListDatasets.length; i++) {

                    Leaf.PatientListDatasets[resultData.PatientListDatasets[i].id] = {};
                    Leaf.PatientListDatasets[resultData.PatientListDatasets[i].id] = resultData.PatientListDatasets[i];
                    if (resultData.PatientListDatasets[i].is_Queryable) {
                        resultData.PatientListDatasets[i].text = resultData.PatientListDatasets[i].text +
                                                                    "<span class='patientList-checkbox switch'><input type='checkbox' class='cmn-toggle cmn-toggle-round' style='width: 360px;' id='" + resultData.PatientListDatasets[i].QueryOutputName + "'>" +
                                                                  "<label for='" + resultData.PatientListDatasets[i].QueryOutputName + "'></label></span>";
                        resultData.PatientListDatasets[i].isChecked = false;
                    }

                }



                // populate the saved queries data table
                for (var i = 0; i < resultData.SavedQueries.length; i++) {

                    Leaf.SavedQueries.List[resultData.SavedQueries[i].SavedQueryID] = {};
                    Leaf.SavedQueries.List[resultData.SavedQueries[i].SavedQueryID] = resultData.SavedQueries[i];
                    Leaf.SavedQueries.List[resultData.SavedQueries[i].SavedQueryID].ExportedREDCapProjects = JSON.parse(resultData.SavedQueries[i].ExportedREDCapProjects)
                }

                // Leaf.Ui.initializeSavedQueryList();
                Leaf.Ui.createSavedQueriesTable();
            

                // populate the redcap imports data table
                for (var i = 0; i < resultData.ImportedREDCapProjects.length; i++) {

                    var project = resultData.ImportedREDCapProjects[i];

                    Leaf.RCImport.Projects[project.REDCapProjectID] = project;
                }


                // create the redcap imports project table
                Leaf.RCImport.createProjectsTable();


                $("#patientlist-tree")
                            .jstree({
                                core: {
                                    check_callback: false,
                                    data: resultData.PatientListDatasets
                                },
                                types: {
                                    parent: {
                                        icon: "glyphicon glyphicon-menu-hamburger"
                                    },
                                    "default": {
                                        //icon: "glyphicon glyphicon-user"
                                        icon: "glyphicon glyphicon-plus-sign"
                                    }
                                },
                                search: {
                                    fuzzy: false,
                                    case_insensitive: true,
                                    show_only_matches: true
                                },
                                plugins: ["sort", "types", "wholerow", "search"]
                            })

                        .bind("before_open.jstree", function (event, data) {

                            var $selected = $("#modal-patientlist .patientlist-selected");

                            $selected.each(function () {

                                var id = $(this).data("id");

                                if (Leaf.PatientListDatasets[id].isChecked) {

                                    $("#patientlist-tree #" + Leaf.PatientListDatasets[id].QueryOutputName)
                                        .prop("checked", true);
                                }
                            });
                        });


            },
            error: function (xmlHttpRequest, status, errorThrown) {

                Leaf.Ui.openMessageModal("Cannot Login User", "Leaf encountered an error while trying to login. Please try closing and reopening your browser and try again, and if this does not work, contact a Leaf administrator.");
                $("#modal-login .modal-dialog").remove()

                console.log(errorThrown);
            }
        });
    };

Leaf.Ajax.savePatientListTemplate = function (name, isActive) {

        Leaf.Ui.updatePatientListConfiguration(true);

        var patientListTemplateObject = {
            patientListConfigurationJson: JSON.stringify(Leaf.PatientList.Configuration),
            patientListID: Leaf.Status.CurrentPatientListTemplateID,
            patientListName: name,
            is_Active: isActive,
            authToken: Leaf.Session.AuthToken
        };


        $.ajax({
            type: "POST",
            url: uriPrefix + "SavePatientListTemplate",
            contentType: "application/json; charset=utf-8",
            async: true,
            cache: false,
            data: JSON.stringify(patientListTemplateObject),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);
            },
            success: function (data) {

                var newTemplate = data["SavePatientListTemplateResult"];
                Leaf.PatientList.Templates[newTemplate.PatientListID] = newTemplate;


                Leaf.Ui.setPatientListTemplate(newTemplate.PatientListID, false);

                Leaf.Ui.populatePatientListTemplateDropDown();


            },
            error: function (xmlHttpRequest, status, errorThrown) {

                Leaf.Ui.openMessageModal("Cannot Save Patient List View", "Leaf encountered an error while trying to save the Patient List View. Please try again later or contact a Leaf administrator.");

                console.log(errorThrown);
            }
        });
    };


Leaf.Ajax.saveQuery = function (queryName, queryCategory, queryDescription, isActive, savedQueryId) {

    var title,
        message = "This may take a moment...",
        savedQueryId = savedQueryId || Leaf.Status.CurrentSavedQueryID;

        // if the query is being created or refreshed vs. Deleted
        if (isActive) {
            // Leaf.Ui.openAndUpdateProgressModal(100, "Saving Query. This may take a moment.", "Save Query");
            title = "Saving Query";
        } else { // else if it is being deleted
            title = "Deleting Query";
        }

        // open the progress modal
        Leaf.Ui.openUpdatingModal(title, message);

        var conceptItems = Leaf.Utils.getCurrentQueryConceptItems();
        var saveQueryObject = {
            authToken		: Leaf.Session.AuthToken,
            panels			: Leaf.Panels,
            panelsJson	: JSON.stringify(Leaf.Panels),
            queryName		: queryName,
            queryCategory	: queryCategory,
            queryDescription: queryDescription,
            queryID			  : savedQueryId,
            conceptItems	: JSON.stringify(conceptItems),
            isActive		  : isActive,
            filterJson    : JSON.stringify(Leaf.AuxiliaryQueries)
        };

        $.ajax({
            type		: "POST",
            url			: uriPrefix + "SaveQuery",
            contentType	: "application/json; charset=utf-8",
            async		: true,
            cache		: false,
            data		: JSON.stringify(saveQueryObject),
            beforeSend	: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);
            },
            complete: function () {
                $("#modal-patientlist-updating").modal("hide");
            },
            success: function (data) {
                var result = data["SaveQueryResult"];
                console.log(data);

                $("#list-parent").jstree("destroy");
                Leaf.Ui.initializeConceptTrees();

                // if the query was saved, add to the list of saved queries
                if (isActive) {
                    Leaf.SavedQueries.List[result.SavedQueryID] = result;
                    Leaf.Ui.createSavedQueriesTable();

                    var $panelsWithData = $(".panel-primary");

                    // no panels with data indicates that the user cleared the interface but saved the previous query,
                    // in which case we don't want to update the current saved query ID
                    if ($panelsWithData.length > 0) {
                        Leaf.Status.CurrentSavedQueryID = result.SavedQueryID;
                    }
                }

                // if there is a callback, do it
                if (typeof (Leaf.SavedQueries.callBackOnComplete) != "undefined") {
                    Leaf.SavedQueries.callBackOnComplete(result.SavedQueryID);
                }
                
                
                if (!isActive) { // else delete from the list                
                    delete Leaf.SavedQueries.List[savedQueryId];
                }
            },
            error: function (xmlHttpRequest, status, errorThrown) {
                console.log(errorThrown);
                Leaf.Ui.openMessageModal("Cannot Save Query", "Leaf experienced an error while trying to save the query. Please try again later or contact a Leaf administrator.");
            }
        });
    };

Leaf.Ajax.logConceptSelection = function (conceptID) {

        var searchString = $("#conceptSearch")
                                .val()
                                .trim()
                                .substring(0, 30),
            selectionType,
            isNotNumeric = isNaN(conceptID);

        // If the conceptSearch box is blank assume the user found 
        // the concept by drilling down, else likely by search

        selectionType = searchString == "" ? "Drilldown" : "Search";

        var conceptSelectionObject = {
            conceptID: conceptID,
            selectionType: selectionType,
            searchString: searchString,
            authToken: Leaf.Session.AuthToken
        };

        $.ajax({
            type: "POST",
            url: uriPrefix + "LogConceptSelection",
            contentType: "application/json; charset=utf-8",
            async: true,
            cache: false,
            data: JSON.stringify(conceptSelectionObject),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);
            },
            success: function (data) {

                // Do nothing
            },
            error: function (xmlHttpRequest, status, errorThrown) {

                console.log(errorThrown);
            }
        });

    };

Leaf.Ajax.refreshSearchConceptList = function (searchVal) {

        var searchObject = {
            searchString: searchVal,
            topParentId: Leaf.Status.TopParentSearchFilter,
            authToken: Leaf.Session.AuthToken
        },
            treeItems = [],
            $listSearch = $("#list-search"),
            $loader = $("#ajax-load-search");

        if (Leaf.Xhr.Search.readyState == 1) {
            Leaf.Xhr.Search.abort();
        }

        Leaf.Xhr.Search = $.ajax({
            type: "POST",
            url: uriPrefix + "GetSearchConcepts",
            contentType: "application/json; charset=utf-8",
            async: true,
            cache: false,
            data: JSON.stringify(searchObject),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);
                $loader.show();
            },
            complete: function () {
                $loader.hide();
            },
            success: function (data) {


                var newConcepts = data["GetSearchConceptsResult"];

                $.each(newConcepts, function (i) {

                    var concept = {};

                    concept.text = Leaf.Ui.setConceptDisplay(newConcepts[i]);

                    concept.id = newConcepts[i].id;
                    concept.parent = newConcepts[i].parent;
                    
                    // Set 1 of 4 icon combos - clock-blue, clock-orange, user-blue user-orange
                    if ( newConcepts[i].is_Parent == true ){  // it is a parent
                      if ( newConcepts[i].is_EncounterBased == true ){ 
                          newConcepts[i].type = "parent_is_EncounterBased"; 
                        } else {
                          newConcepts[i].type = "parent_NotEncounterBased"; 
                        }
                      } else { // it is a child
                                  
                      if ( newConcepts[i].is_EncounterBased == true ){ 
                          newConcepts[i].type = "child_is_EncounterBased"; 
                        } else {
                          newConcepts[i].type = "child_NotEncounterBased"; 
                        }
                      }
          
                    concept.type = newConcepts[i].type;

                    treeItems.push(concept);
                });



                $listSearch
                    .jstree(true)
                    .settings
                    .core
                    .data = treeItems;
                $listSearch
                    .jstree(true)
                    .refresh();



                Leaf.Utils.addToConceptList(newConcepts);
            },
            error: function (xmlHttpRequest, status, errorThrown) {
                console.log(errorThrown);
            }
        });
    };

Leaf.Ajax.getPatientCountByIteration = function (dataArray, ob) {

        var $iterationSection = $("#iteration-section"),
            idx,
            $loader = $("#ajax-loader-viz-breakdown");

        // If first iteration
        if (ob == null) {

            $loader.show();

            // Remove any pre-existing iteration output results
            $iterationSection
              .find(".iteration-output-wrapper, .iteration-output-arrow, .iteration-output-ofthose")
                .remove();

            var ob = [],
                firstPanel = {},
                dataArray = [],
                firstPanelHasData = false;

            // for each panel
            for (var i = 0; i < Leaf.Panels.length; i++) {

                // for each subpanel
                for (var j = 0; j < Leaf.Panels[i].SubPanels.length; j++) {

                    // if subpanel has any panel items
                    if (Leaf.Panels[i].SubPanels[j].PanelItems.length > 0) {

                        // The intent here is to find the first panel that has a subpanel with data.
                        // Once one is found,  it's query will be the first to be displayed in the iteration query section
                        if (!firstPanelHasData) {
                            firstPanel = JSON.parse(JSON.stringify(Leaf.Panels[i]));

                            firstPanel.SubPanels = [];
                            firstPanel.SubPanels[0] = JSON.parse(JSON.stringify(Leaf.Panels[i].SubPanels[j]));
                            firstPanel.PanelItemCount = 1;
                            ob.push(firstPanel);

                            firstPanelHasData = true;
                        }

                        // the dataArray variable is an array of panel and subpanel indexes separated by hyphens.
                        // By splitting by hyphen  later in the sequence, we can dynamically add the next subpanel and panels
                        dataArray.push(i.toString() + "-" + j.toString());
                    }
                }
            }

            idx = dataArray[0].split("-");
        }
        else {

            // If the function has been called and already has existing data objects,
            // we then split the idx variable by hyphen,   and use the first and second integers
            // as indexes to find the next panel and sub panels to add to the iteration query
            idx = dataArray[0].split("-"),
                nextPanelIndex = parseInt(idx[0]),
                nextSubpanelIndex = parseInt(idx[1]),
                newPanel = JSON.parse(JSON.stringify(Leaf.Panels[nextPanelIndex])),
                newSubpanel = JSON.parse(JSON.stringify(Leaf.Panels[nextPanelIndex].SubPanels[nextSubpanelIndex]));

            newPanel.SubPanels = [];
            newPanel.PanelItemCount = 1;

            // "ob" is the object variable which contains the metadata for the next iteration query to produce a SQL statement. 
            // If it doesn't have an index for the next panel in the sequence, we add that in here.
            if (typeof ob[nextPanelIndex] == "undefined") {

                newPanel.SubPanels[0] = newSubpanel;
                ob.push(newPanel);
            }
            else {

                ob[nextPanelIndex].SubPanels.push(newSubpanel);
            }
        }

        // Now that the next sequence of panels and sub panels has been added to the iteration query,
        // splice them out of the dataArray variable
        dataArray.splice(0, 1);

        // isLastIteration is a variable used to check at the end of the function whether it needs to be called again for the next sequence
        var isLastIteration = dataArray.length > 0 ? false : true,

            // conceptItems is a JSON string that lists all of the current conceptIds used in the query
            conceptItems = Leaf.Utils.getCurrentQueryConceptItems(),

            // this is fairly important -- here we make a copy of our metadata "ob" and add in the optional filter queries
            // e.g. living patients, etc.  if we add in the optional queries to the ob variable directly,it makes the iterative sequence 
            // much harder to track and is very error-prone
            metadataWithAuxiliaryQueries = Leaf.Utils.addSelectedAuxiliaryQueries(JSON.parse(JSON.stringify(ob)));

        var panelObject = {
            panels: metadataWithAuxiliaryQueries,
            panelsJson: JSON.stringify(metadataWithAuxiliaryQueries),
            authToken: Leaf.Session.AuthToken,
            conceptItems: JSON.stringify(conceptItems)
        };

        $.ajax({
            type: "POST",
            url: uriPrefix + "GetPatientCountByIteration",
            contentType: "application/json; charset=utf-8",
            async: true,
            cache: false,
            data: JSON.stringify(panelObject),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);
            },
            complete: function () {
                $loader.hide();
            },
            success: function (data) {

                Leaf.PatientList.Counts = data["GetPatientCountByIterationResult"];

                // get the HTML structure for the next iteration panel
                var $newIterationOutput = $(Leaf.HtmlGenerators.iterationOutput())
                                            .hide()
                                            .fadeIn(1000),

                    // Grab a Jquery  object of the current panel referenced in the query. We'll use this for getting the text to display
                    $newDisplayPanel = $("#panel" + idx[0]),

                    // get the above panel's panel-body
                    $newDisplaySubpanel = $newDisplayPanel
                                            .find(".panel-body")
                                            .eq(parseInt(idx[1])),

                    // the iteration-section is divided into three columns, into which we add HTML objects.  Here we find which column to add
                    // hTML objects into (  i.e., where to put the next query info in )
                    $targetColumn = $("#iteration-section")
                                        .find(".iteration-output")
                                        .eq(parseInt(idx[0])),

                    // get a Jquery  array of  any panel items in our current subpanel
                    $newPanelItems = $newDisplaySubpanel
                                       .find(".panel-item-wrapper"),
                    newTimeData,
                    newCountData;

                // append the frame of the newquery info into the target column
                $targetColumn.append($newIterationOutput);

                // we have to use a slightly different strategy to get the  textual info for the current query,depending on if the current subpanel
                // is the first in the panel, or later in the sequence
                if (idx[1] == 0) {
                    newTimeData = $newDisplayPanel
                                    .find(".date-filter")
                                    .children("a")
                                      .text()
                                      .trim();
                    newCountData = $newDisplayPanel
                                     .find(".count-filter")
                                     .children("a")
                                     .eq(0)
                                        .text()
                                        .trim();
                }
                else {
                    newTimeData = $newDisplaySubpanel
                                     .prev(".panel-subpanel")
                                     .find(".subpanel-type")
                                     .children("a")
                                        .text()
                                        .trim();
                    newCountData = $newDisplaySubpanel
                                      .prev(".panel-subpanel")
                                      .find(".count-filter")
                                      .children("a")
                                         .text()
                                         .trim();
                }

                var exclusionHtml = "";

                // if the panel or subpanel is negated, add the word "Not"
                if (Leaf.Panels[idx[0]].includePanel == false || Leaf.Panels[idx[0]].SubPanels[idx[1]].includePanel == false) {

                    exclusionHtml = "<p class='iteration-not'>Not</p>";

                    $newIterationOutput
                        .addClass("iteration-output-not");
                }

                // put the time sequence and count data into a <div>
                var $metadata = $("<div>" + exclusionHtml + "<p>" + newTimeData + "</p>" + "<p>" + newCountData + "</p><div>"),

                    // add an object for the patient count, e.g. 100 patients
                    $iterationPatientCount = $("<span class='iteration-output-count'>" +
                                                Leaf.Utils.addCommasToNumber(data["GetPatientCountByIterationResult"]) +
                                                "</span><span>patients</span>"),

                    //  get Jquery objects for the query description, count, time and resulting patients
                    $iterationOutputDescription = $targetColumn
                                                    .find(".iteration-output-wrapper:last-child")
                                                    .find(".iteration-output-description"),
                    $iterationOutputMetadata = $targetColumn
                                                  .find(".iteration-output-wrapper:last-child")
                                                  .find(".iteration-output-metadata"),
                    $iterationOutputResult = $targetColumn
                                                .find(".iteration-output-wrapper:last-child")
                                                .find(".iteration-output-result"),
                    $descriptions;

                // append the time and count data
                $iterationOutputMetadata.append($metadata);

                // append the patient count
                $iterationOutputResult.append($iterationPatientCount);

                //  next, loop through each panel item to create a Jquery <div>  object containing the textual descriptions of all panel items
                $descriptions = "<div>";

                $newDisplaySubpanel
                  .find(".panel-item-wrapper").each(function () {

                      $descriptions += "<p>" + $(this).find(".panel-item").text() + " " +
                                              $(this).find(".panel-item-modifier").text() +
                                      "</p>";
                  });

                $descriptions = $($descriptions + "</div>");

                // append the descriptions
                $iterationOutputDescription.append($descriptions);

                // remove the previous ajax loading gif, as the DB call has now finished
                $iterationSection
                  .find("img")
                    .remove();

                // if there are still more subpanels within the sequence, recurse through and call the function again
                if (!isLastIteration) {

                    // update the idx variable as the index of zero is now replaced
                    var nextPanelIndex = idx[0];
                    idx = dataArray[0].split("-");

                    // the arrowType variable indicates which direction the next subpanel will appear in, below or to the right
                    // depending on if it is the same panel or the next
                    var arrowType = "down";

                    if (typeof ob[idx[0]] == "undefined") {

                        $targetColumn = $("#iteration-section")
                                          .find(".iteration-output")
                                          .eq(parseInt(nextPanelIndex))
                                          .next(".iteration-gap");
                        arrowType = "right";
                    }

                    // create Jquery object for the indicator arrow
                    var $newIterationOutputArrow = $(Leaf.HtmlGenerators.iterationOutputArrow(arrowType));

                    // append the arrow
                    $targetColumn.append($newIterationOutputArrow);

                    // call the function again
                    Leaf.Ajax.getPatientCountByIteration(dataArray, ob);
                }
            },
            error: function (xmlHttpRequest, status, errorThrown) {
                console.log(errorThrown);
            }
        });
    };

Leaf.Ajax.getPatientCount = function () {

        var conceptItems = Leaf.Utils.getCurrentQueryConceptItems(),
            queryMetadata = JSON.parse(JSON.stringify(Leaf.Panels));

        queryMetadata = Leaf.Utils.addSelectedAuxiliaryQueries(queryMetadata);

        var panelObject = {
            panels: queryMetadata,
            panelsJson: JSON.stringify(queryMetadata),
            authToken: Leaf.Session.AuthToken,
            conceptItems: JSON.stringify(conceptItems)
        };

        var $getCount = $("#get-count"),
            $topBarCount = $("#totalCount");


        var tooltipTitle,
            tooltipBody,
            tooltipSeparator = "<div class='tooltip-separator'></div>";

        $topBarCount.tooltip("destroy");

        var errorTitle = "Cannot Run Query",
            errorMessage = "<p>Leaf encountered an error while trying to run your query. If the query failed immediately, this may be due to a lack of permissions to run the specified query, or a Leaf-generated " + 
                "query syntax error.</p><p>If the query failed after running for a few minutes, it is most likely due to a query timeout and poor performance.</p><p>Please contact a Leaf administrator with this information.</p>";


    
    
        // Set the Run Query button to "CANCEL QUERY"
        Leaf.Utils.updateQueryBuilderStatus(2);


        Leaf.Xhr.Clinical = $.ajax({
            type: "POST",
            url: uriPrefix + "submit",
            contentType: "application/json; charset=utf-8",
            async: true,
            cache: false,
            data: JSON.stringify(panelObject),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);
            },
            complete: function () {

                clearInterval(interval);
            },
            success: function (data) {

                var result = data["GetPatientCountsResult"];

                if (result.isSuccess) {

                    Leaf.PatientList.Counts = result.TotalPatients;
                    Leaf.Status.CurrentTotalPatients = result.TotalPatients;


                    Leaf.Status.areDemographicsCurrent = false;
                    Leaf.Status.isPatientListCurrent = false;

            
                    // Set the Run Query button to "SAVE QUERY" if criteria not changed
                    if (!Leaf.Status.areQueryCriteriaChanged) {
                        Leaf.Utils.updateQueryBuilderStatus(3);
                    }


            
                    $topBarCount
                        .html("<span class='countStats'>total patients:</span><strong>" + Leaf.Utils.addCommasToNumber(result.TotalPatients) + "</strong>" +
                              "<span class='countStats'>found in:</span><strong>" + elapsedTime + "</strong>" + "<span class='countStats'>seconds<span>");
            

                    var tooltipTitle = "Executed Query:",
                        tooltipBody = result.ExecutedSql;


                    $topBarCount.tooltip("destroy");
                    $topBarCount.tooltip({
                        html: true,
                        title: "<p class='tooltip-title'>" + tooltipTitle + "</p>" + tooltipSeparator + "<p class='tooltip-body-sql'>" + tooltipBody + "</p>",
                        container: "body",
                        placement: "right"
                    });
                }

                else {
                    Leaf.Utils.updateQueryBuilderStatus(1);
                    $topBarCount.html("");

                    Leaf.Ui.openMessageModal(errorTitle, errorMessage);
                }

            },
            error: function (xmlHttpRequest, status, errorThrown) {

            
                if (errorThrown == "abort") {

                    errorTitle = "Query Canceled";
                    errorMessage = "Query successfully canceled. If to your query is running for a particularly long time or you have any questions, please contact a Leaf administrator.";
                }

                Leaf.Utils.updateQueryBuilderStatus(1);
                $topBarCount.html("");

                Leaf.Ui.openMessageModal(errorTitle, errorMessage);
                console.log(errorThrown);
            }
        });


        var elapsedTime = 0.0,
            secondsDisplay = " seconds";

        var interval = setInterval(function () {

            $topBarCount.html("<span class='countStats'>Time elapsed:</span>" + elapsedTime + secondsDisplay)
            elapsedTime = Math.round((+elapsedTime + 0.1) * 10) / 10;

            if (elapsedTime % 1 !== 0)
                secondsDisplay = " seconds";
            else
                secondsDisplay = ".0 seconds";

        }, 100);
    };

Leaf.Ajax.getDemographics = function () {

        var conceptItems = Leaf.Utils.getCurrentQueryConceptItems(),
            queryMetadata = JSON.parse(JSON.stringify(Leaf.Panels));

        queryMetadata = Leaf.Utils.addSelectedAuxiliaryQueries(queryMetadata);

        var panelObject = {
            panels: queryMetadata,
            panelsJson: JSON.stringify(queryMetadata),
            authToken: Leaf.Session.AuthToken,
            conceptItems: JSON.stringify(conceptItems)
        },
             $loader = $(".ajax-loader-visualization");

        if (Leaf.Xhr.Demographics.readyState == 1) {
            Leaf.Xhr.Demographics.abort();
        }

        Leaf.Xhr.Demographics = $.ajax({
            type: "POST",
            url: uriPrefix + "GetDemographic",
            contentType: "application/json; charset=utf-8",
            async: true,
            cache: false,
            data: JSON.stringify(panelObject),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);
                $loader.show();
            },
            complete: function () {


                $.each($loader, function (index) {
                    $(this).delay(500 * index).fadeOut(300);
                });
            },
            success: function (data) {

                console.log(data["GetDemographicResult"]);

                var returnData = data["GetDemographicResult"],
                    $otherLanguagesButton = $("#language-ethnic-chart-otherdetails");


                // if there are languages that have been put into the "Other" bin,
                // allow the user to see those by hovering over the button
                if (returnData.OtherLanguages.length > 0) {

                    var tooltipTitle = "Other Languages"
                    tooltipBody = Leaf.HtmlGenerators.otherLanguagesTooltip(returnData.OtherLanguages),
                    tooltipSeparator = "<div class='tooltip-separator'></div>";


                    $otherLanguagesButton.tooltip("destroy");
                    $otherLanguagesButton
                        .show()
                        .text("Other Languages detail (" + returnData.OtherLanguages.length + ")")
                        .tooltip({
                            html: true,
                            title: "<p class='tooltip-title'>" + tooltipTitle + "</p>" + tooltipSeparator + tooltipBody,
                            container: "body",
                            placement: "left"
                        });
                }
                else {
                    $otherLanguagesButton.hide();
                }

                // update the "Show All" buttons with the total count
                $("#religion-chart-nolimit").text("Show All (" + returnData.ReligionStatistics.length + " total)");
                $("#location-chart-nolimit").text("Show All (" + returnData.CurrentLocationStatistics.length + " total)");

                Leaf.Visualization.AgeByGender.drawChart(returnData.AgeByGenderStatistics);
                Leaf.Visualization.Binary.drawChart(returnData.BinaryChartStatistics);
                Leaf.Visualization.Religion.drawChart(returnData.ReligionStatistics);
                Leaf.Visualization.Location.drawChart(returnData.CurrentLocationStatistics);
                Leaf.Visualization.EmploymentInsurance.drawChart(returnData.InsuranceEmploymentStatistics);
                Leaf.Visualization.LanguageEthnicity.drawChart(returnData.LanguageEthnicityStatistics);
            },
            error: function (xmlHttpRequest, status, errorThrown) {
                console.log(errorThrown);
            }
        });
};

Leaf.Ajax.getPatients = function () {


    var conceptItems = Leaf.Utils.getCurrentQueryConceptItems(),
        queryMetadata = JSON.parse(JSON.stringify(Leaf.Panels));

    queryMetadata = Leaf.Utils.addSelectedAuxiliaryQueries(queryMetadata);

    $("#patientTable").DataTable().destroy({ remove: true });
    // $("#patientTable_wrapper, #patientTable").remove();

    var $datasetsWrapper = $("#patientlist-openmodal-wrapper");

    $datasetsWrapper.find(".patientlist-dataset").remove();

    var panelObject = {
        panels: queryMetadata,
        panelsJson: JSON.stringify(queryMetadata),
        authToken: Leaf.Session.AuthToken,
        conceptItems: JSON.stringify(conceptItems),
        additionalDataSets: Leaf.PatientList.Configuration.Datasets,
        displayedColumns: Leaf.PatientList.Configuration.ColumnOrder
    },
        $loader = $("#ajax-loader-output");

    if (Leaf.Xhr.PatientList.readyState == 1) {
        Leaf.Xhr.PatientList.abort();
    }

    Leaf.Xhr.PatientList = $.ajax({
        type: "POST",
        url: uriPrefix + "GetPersons",
        contentType: "application/json; charset=utf-8",
        async: true,
        cache: false,
        data: JSON.stringify(panelObject),
        beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);

                // Show the ajax loader gif
                $loader.show();
            },
        complete: function () {
                $loader.hide();
                $("#modal-patientlist-updating").modal("hide");
            },
        success: function (data) {
                var persons = data["GetPersonsResult"].Patients,
                    datasets = data["GetPersonsResult"].Datasets,
                    displayedColumns = data["GetPersonsResult"].DisplayedColumns,
                    patientIdColumn = data["GetPersonsResult"].PatientIdColumnIndex,
                    standardColumns = data["GetPersonsResult"].StandardColumns,
                    trendColumns = data["GetPersonsResult"].TrendColumns
              ;

                Leaf.Status.PatientListTotalCount_data = data["GetPersonsResult"].PatientListTotalCount;

                Leaf.Ui.setPatientListDatasets(datasets);
                Leaf.PatientList.HistorySubTable = {};

                var table = d3.select("#patient-table-column")
                    .append("table")
                    .attr("id", "patientTable")
                    .classed("table", true)
                    .classed("table-striped", true)
                    .classed("table-hover", true)
                    .classed("leaf-table", true)
                    .attr("cellspacing", 0);

                var thead = table.append("thead").append("tr");

                thead.selectAll("th")
                    .data(standardColumns)
                    .enter()
                  .append("th")
                    .text(function (d) { return d; });

                var tbody = table.append("tbody");

                var trows = tbody
                  .selectAll("tr")
                    .data(persons)
                    .enter()
                  .append("tr")
                    .each(function (d) {
                        Leaf.PatientList.HistorySubTable[d.CellData[patientIdColumn]] = d.History;
                    });

                var tcells = trows
                  .selectAll("td")
                    .data(function (d, i) { return d.CellData; })
                    .enter()
                  .append("td")
                    .text(function (d, i) { return d; });

                tcells.filter(function (d, i) { return i == 0; })
                    .classed("details-control", true)
                    .append("div");

                // update (add a column with graphs)
                thead.selectAll("th.trend-column")
                    .data(trendColumns)
                    .enter()
                  .append("th")
                    .attr("class", "trend-column")
                    .text(function (d) { return d; });

                trows.selectAll("td.sparkline")
                    .data(function (d) { return d.TrendData; })
                    .enter()
                  .append("td")
                    .attr("class", "sparkline")
                    .each(function (d, i) {

                        if (d.Dates.length > 0) { Leaf.Visualization.Sparkline.drawChart(d, this); }
                    });

                var $table = $("#patientTable");

                Leaf.PatientList.Table = $table.DataTable({
                    colReorder: true,
                    // scrollX: true,
                    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    columnDefs: [
                          { targets: displayedColumns, visible: true },
                          { targets: "_all", visible: false }
                    ]
                });

                var $paging = $("#patientTable_length").find("label");

                //
                // Create the message for the patient and record counts
                //

                // The message starts with a fixed string
                var PatientCountMessage = " Patients";

                // if the query is a subset of the total patients, then add a note to the message.
                if (Leaf.Status.CurrentTotalPatients > 499) {
                    // let the user know it is only a subset
                  // $paging.contents()[$paging.length + 1].nodeValue = " entries (limited to " + 499 + " of " +
                  // Leaf.Utils.addCommasToNumber(Leaf.Status.CurrentTotalPatients) + " total patients)";
                  PatientCountMessage = PatientCountMessage + " (limited to " + 499 + " of " +
                   Leaf.Utils.addCommasToNumber(Leaf.Status.CurrentTotalPatients) + " total patients)";
                }

                // Add the number of records to the message
                PatientCountMessage = PatientCountMessage
                + " with "
                + Leaf.Utils.addCommasToNumber(Leaf.Status.PatientListTotalCount_data)
                + " total data records.";

                // Send the built message to the web page
                $paging.contents()[$paging.length + 1].nodeValue = PatientCountMessage;

                $table.fadeIn(500);

                Leaf.Ui.updatePatientListConfiguration(true);
                /*  3688 experimental
         //      var $PatientListTotalCount = $("#PatientListTotalCount");
         //       $PatientListTotalCount
         //         .html(
         //         "<span class='countStats'>total Records:</span><strong>"      
         //         + Leaf.Utils.addCommasToNumber( Leaf.Status.PatientListTotalCount_data )
         //         );
                  */
            },
        error: function (xmlHttpRequest, status, errorThrown) {

                $("#modal-patientlist-updating").modal("hide");

                if (errorThrown != "abort") {

                    var message = "Leaf encountered an error while trying to generate the Patient List. Please try again later or contact a Leaf administrator."

                    Leaf.Ui.openMessageModal("Cannot Generate Patient List", message);
                }
                console.log(errorThrown);

            }
    });

    }

Leaf.Ajax.getDataExport_REDCap = function () {

        var conceptItems = Leaf.Utils.getCurrentQueryConceptItems(),
            queryMetadata = JSON.parse(JSON.stringify(Leaf.Panels));

        queryMetadata = Leaf.Utils.addSelectedAuxiliaryQueries(queryMetadata);


        var panelObject = {
            panels: queryMetadata,
            panelsJson: JSON.stringify(queryMetadata),
            authToken: Leaf.Session.AuthToken,
            conceptItems: JSON.stringify(conceptItems),
            queryTypes: Leaf.PatientList.Configuration.Datasets,
            projectName: $("#project").val(),
            savedQueryId: Leaf.Status.CurrentSavedQueryID
        };

        Leaf.Ui.openUpdatingModal("REDCap Export", "Beginning Export...");

        $.ajax({
            type: "POST",
            url: uriPrefix + "GetDataExport",
            contentType: "application/json; charset=utf-8",
            async: true,
            cache: false,
            data: JSON.stringify(panelObject),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);

            },
            complete: function () {

                clearInterval(interval);
                if (Leaf.Xhr.ProgressModal.readyState == 1) {
                    Leaf.Xhr.ProgressModal.abort();
                }

                $("#modal-patientlist-updating").modal("hide");
            },
            success: function (data) {
                console.log(data);

                var resultData = data["GetDataExportResult"],
                    savedQuery = Leaf.SavedQueries.List[panelObject.savedQueryId];


                if (resultData.isSuccess) {

                    savedQuery.REDCapProjectID = resultData.ProjectId;
                    savedQuery.AccessUrl = resultData.AccessUrl;
                    savedQuery.ProjectTitle = resultData.ProjectTitle;

                    $("#ExportNew").remove();

                    $("#projectName")
                        .text(resultData.ProjectTitle);

                    $("#projectURL")
                        .attr("href", resultData.AccessUrl)
                        .text(resultData.AccessUrl);

                    $("#modal-RedcapProjectURL").modal("show");
                }
                else {

                    Leaf.Ui.openMessageModal("REDCap Export Failed", "Leaf experienced an error while trying to export data. Please try again later or contact a Leaf administrator.");
                }
            },
            error: function (xmlHttpRequest, status, errorThrown) {

                $("#modal-patientlist-updating").modal("hide");

                Leaf.Ui.openMessageModal("REDCap Export Failed", "Leaf experienced an error while trying to export data. Please try again later or contact a Leaf administrator.");
                console.log(errorThrown);
            }
        });


        var interval = setInterval(function () {

            Leaf.Ajax.getDataExchangeProgress("REDCap Export");
        }, 2000);

    };

Leaf.Ajax.getDataExchangeProgress = function (title) {

    var session = {
        authToken: Leaf.Session.AuthToken
    };
        

    // don't run if the process is already running now
   if (Leaf.Xhr.ProgressModal.readyState !== 1) {
       Leaf.Xhr.ProgressModal = $.ajax({
           type: "POST",
           url: uriPrefix + "GetDataExchangeProgress",
           contentType: "application/json; charset=utf-8",
           async: true,
           cache: false,
           data: JSON.stringify(session),
           beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);

                },
           complete: function () {

                },
           success: function (data) {


               Leaf.Ui.openUpdatingModal(title, data["GetDataExchangeProgressResult"] + "...");

           },
           error: function (xmlHttpRequest, status, errorThrown) {
                    console.log(errorThrown);
                }
       });
   }
};


/**
* This is called for adding and deleting custom filters.
* Also for adding right-click popups to the concept list.
*/
Leaf.Ajax.addCustomFilter = function (filterName, filterText, conceptID, isActive) {

        var customFilterObject = {
            authToken: Leaf.Session.AuthToken,
            filterName: filterName,
            filterText: filterText,
            conceptID: conceptID,
            isActive: isActive,
        };

        $.ajax({
            type: "POST",
            url: uriPrefix + "AddCustomFilter",
            contentType: "application/json; charset=utf-8",
            async: true,
            cache: false,
            data: JSON.stringify(customFilterObject),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);
            },
            success: function (data) {
                if (isActive) {
                    var filterID = "cf_" + conceptID;

                    var newPanel = new Leaf.Models.Panel(),
                        newSubpanel = new Leaf.Models.SubPanel(),
                        newPanelItem = new Leaf.Models.PanelItem();

                    newPanel.PanelItemCount = 1;
                    newPanel.PanelType = 1;
                    newPanel.includePanel = true;
                    newPanel.isDateFiltered = false;
                    newPanel.Domain = "Filter - " + filterName;

                    newPanelItem.ConceptID = conceptID;
                    newPanelItem.SqlSetName = Leaf.ConceptList[conceptID].sql_Set_Name;
                    newPanelItem.SqlWhereClause = Leaf.ConceptList[conceptID].sql_WhereClause;

                    newSubpanel.PanelItems.push(newPanelItem);
                    newPanel.SubPanels.push(newSubpanel);

                    Leaf.AuxiliaryQueries[filterID] = {
                        isChecked: true,
                        QueryText: filterName,
                        QueryDescription: filterText,
                        ID: filterID,
                        Panel: newPanel,
                        isActive: true,
                        isCustomFilter: true
                    };

                    Leaf.Utils.SetFilterPopups( Leaf.AuxiliaryQueries );
                }

            },
            error: function (xmlHttpRequest, status, errorThrown) {

                Leaf.Ui.openMessageModal("Cannot Save Custom Filter", "Leaf experienced an error while trying to save the custom filter. Please try again later or contact a Leaf administrator.");

                console.log(errorThrown);
            }
        });
    };

Leaf.Ajax.deleteREDCapProject = function (binding, callback) {

        var bindingObject = {
            binding: binding,
            authToken: Leaf.Session.AuthToken
        };

        Leaf.Ui.openUpdatingModal("Deleting Imported REDCap Project", "Deleting Data...");

        $.ajax({
            type: "POST",
            url: uriPrefix + "DeleteREDCapProject",
            contentType: "application/json; charset=utf-8",
            async: true,
            cache: false,
            data: JSON.stringify(bindingObject),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);
            },
            complete: function () {

                // hide the progress modal 
                $("#modal-patientlist-updating").modal("hide");
            },
            success: function (data) {

                var output = data["DeleteREDCapProjectResult"];


                if (output) {

                    // delete the project from the UI
                    delete Leaf.RCImport.Projects[binding.REDCapProjectID];


                    if (typeof (callback) != "undefined") {

                        callback();
                    }
                    // Leaf.RCImport.createProjectsTable();


                    // reset the concept list
                    $("#list-parent").jstree("destroy");
                    Leaf.Ui.initializeConceptTrees();


                    Leaf.Ui.openMessageModal("Project Successfully Deleted", "Your imported Project has been deleted.");
                }

                else {

                    Leaf.Ui.openMessageModal("Couldn't Delete Project", "Leaf encountered an error while trying to delete your Project. We are sorry for the inconvenience. " +
                        "Please try again later or contact a Leaf administrator.");
                }

            },
            error: function (xmlHttpRequest, status, errorThrown) {

                console.log(errorThrown);

                Leaf.Ui.openMessageModal("Couldn't Delete Project", "Leaf encountered an error while trying to delete your Project. We are sorry for the inconvenience. " +
                        "Please try again later or contact a Leaf administrator.");
            }
        });
    };

Leaf.Ajax.generateREDCapLeafBinding = function (ApiToken, callback) {

        var apiObject = {
            apiToken: ApiToken
        };

        Leaf.Ui.openUpdatingModal("Checking API token", "Giving REDCap a call...");

        $.ajax({
            type: "POST",
            url: uriPrefix + "GenerateREDCapLeafBinding",
            contentType: "application/json; charset=utf-8",
            async: true,
            cache: false,
            data: JSON.stringify(apiObject),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);
            },
            complete: function () {
        
                // hide the progress modal 
                $("#modal-patientlist-updating").modal("hide");
            },
            success: function (data) {

                console.log(data);

                var binding = data["GenerateREDCapLeafBindingResult"];


                if (binding.isValidToken) {


                    if (binding.isPreviouslyImported) {

                        var title = "Project Already Imported",
                            message = "Your Project appears to have been imported before. Are you sure you want to import it again? This will erase all previously imported data.",
                            onYesText = "Yes",
                            onNoText = "No, nevermind",
                            onYes = function () {

                                // set the binding
                                Leaf.RCImport.Binding = binding;


                                // run the callback
                                callback();
                            },
                            onNo = function () {

                                // do nothing
                            };

                        Leaf.Ui.openConfirmationModal(title, message, onYes, onNo, onYesText, onNoText);
                    }

                    else { 

                        // set the binding
                        Leaf.RCImport.Binding = binding;


                        // run the callback
                        callback();
                    }

                }

                else {

                    Leaf.Ui.openMessageModal("Invalid API Token", "The REDCap Project token appears to be invalid. Please check your REDCap token and try again.");
                }
            
            },
            error: function (xmlHttpRequest, status, errorThrown) {

                console.log(errorThrown);

                Leaf.Ui.openMessageModal("Couldn't Contact REDCap", "Leaf encountered an error while trying to get project information with your API token. We are sorry for the inconvenience, but please try again later.");
            }
        });
    };

Leaf.Ajax.importREDCapProject = function () {

        var apiObject = {
            binding: Leaf.RCImport.Binding,
            bindingJson: JSON.stringify(Leaf.RCImport.Binding),
            authToken: Leaf.Session.AuthToken
        };

        Leaf.Ui.openUpdatingModal("REDCap Import", "Beginning Import...");

        $.ajax({
            type: "POST",
            url: uriPrefix + "ImportREDCapProject",
            contentType: "application/json; charset=utf-8",
            async: true,
            cache: false,
            data: JSON.stringify(apiObject),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);
            },
            complete: function () {

                clearInterval(interval);
                if (Leaf.Xhr.ProgressModal.readyState == 1) {
                    Leaf.Xhr.ProgressModal.abort();
                }
                $("#modal-patientlist-updating").modal("hide");
            },
            success: function (data) {

                console.log(data);

                var stats = data["ImportREDCapProjectResult"];


                if (stats.TotalPatientsAdded > 0) {

                    var text = Leaf.HtmlGenerators.RCImportSummary(stats);
                    Leaf.Ui.openMessageModal("REDCap Project Successfully Imported", text);



                    // add the project to the project table
                    stats.ImportedProject.ProjectImporter = $("#user-name").text();
                    Leaf.RCImport.Projects[stats.ImportedProject.REDCapProjectID] = stats.ImportedProject;
                    Leaf.RCImport.createProjectsTable();


                    // reset the concept list
                    $("#list-parent").jstree("destroy");
                    Leaf.Ui.initializeConceptTrees();
                }

                else {

                    Leaf.Ui.openMessageModal("No Valid Patient MRNs", "The data from the REDCap Project MRN field provided did not match any MRNs in Amalga, " +
                        "and no data was imported. Please confirm that the MRN field contains valid MRNs and try again.");


                    // reopen the import model to let them try again
                    Leaf.RCImport.CurrentUiStep = 3;
                    $("#modal-rcimport").modal("show");
                }

            },
            error: function (xmlHttpRequest, status, errorThrown) {

                console.log(errorThrown);

                Leaf.Ui.openMessageModal("Error while exporting Project", "Leaf encountered an error while trying to export your REDCap Project. We are sorry for the inconvenience, but please try again later.");

                // reopen the import model to let them try again
                Leaf.RCImport.CurrentUiStep = 3;
                $("#modal-rcimport").modal("show");
            }
        });

        // set the progress modal to query the server for updates every two seconds
        var interval = setInterval(function () {

            Leaf.Ajax.getDataExchangeProgress("REDCap Import");
        }, 2000);
    };
