Leaf.Ajax.getDataExport_Tableau = function () {

    var conceptItems = Leaf.Utils.getCurrentQueryConceptItems(),
        queryMetadata = JSON.parse(JSON.stringify(Leaf.Panels));

    queryMetadata = Leaf.Utils.addSelectedAuxiliaryQueries(queryMetadata);


    var panelObject = {
        panels: queryMetadata,
        datasourceName: $("#newTBDatasourceName").val(),
        authToken: Leaf.Session.AuthToken,
        requestedDatasets: Leaf.PatientList.Configuration.Datasets,
        panelsJson: JSON.stringify(queryMetadata),
        conceptItems: JSON.stringify(conceptItems),
        savedQueryId: Leaf.Status.CurrentSavedQueryID
    };

    //Leaf.Ui.openUpdatingModal("Tableau Export", "Beginning Export...");

    $.ajax({
        type: "POST",
        url: uriPrefix + "GetVizExport",
        contentType: "application/json; charset=utf-8",
        async: true,
        cache: false,
        data: JSON.stringify(panelObject),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + Leaf.Session.AuthToken);

        },
        complete: function () {
            clearInterval(interval);
            //if (Leaf.Xhr.ProgressModal.readyState == 1) {
            //    Leaf.Xhr.ProgressModal.abort();
            //}

            //$(".export-content-TB").html($("#modal-patientlist-updating").find(".row"));
        },
        success: function (data) {
            console.log(data);
            var resultData = data["GetVizExportResult"];
            if (resultData.isSuccess) {

                var tableau_success = "<form class='form-inline row export-row export-success'>Tableau Datasource Successfully Uploaded</form>" +
                    "<form class='form-inline row export-row'>" +
                    "<div class='col-md-3 export-success'>" + resultData.DataSourceName + "</div>" +
                    "<div class='col-md-9'><a id='datasourceURL' target='_blank'>" + resultData.AccessUrl + "</a></div></form>";
                    
                $("#datasourceURL")
                    .attr("href", resultData.AccessUrl);
                $(".export-content-TB").html(tableau_success);
                //$("modal-TableauDatasourceURL").modal("show");
            }
            else {

                $(".export-content-TB").html("<h4>Tableau Export Failed</h4><h5>Leaf experienced an error while trying to export data. Please try again later or contact a Leaf administrator.</h5>");
            }
        },
        error: function (xmlHttpRequest, status, errorThrown) {

            //$("#modal-exportOption").find(".export-content-TB").html(Leaf.Ui.openMessageModal("Tableau Export Failed", "Leaf experienced an error while trying to export data. Please try again later or contact a Leaf administrator."));
            $(".export-content-TB").html("<h4>Tableau Export Failed</h4><h5>Leaf experienced an error while trying to export data. Please try again later or contact a Leaf administrator.</h5>");
            console.log(errorThrown);
        }
    });
    var interval = setInterval(function () {

        Leaf.Ajax.getDataExchangeProgress("Tableau Export", ".export-content-TB");
    }, 2000);
}
