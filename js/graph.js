/*
 * Chart javascript to plot TC3G data
 * 
 */ 
$(document).ready(function(){
    //Filter data when click on Vehicle Park select box
    $("#vehiclePark,#RCVnumber,#SelectedData,#startDate,#startTime,#endDate,#endTime").on('change', function(){
        // Clean chart div
        $('#myChart').remove();
        $('#divChart').append('<canvas id="myChart"><canvas>');
        var vehiclePark = $("#vehiclePark").val();
        var RCVnumber = $("#RCVnumber").val();
        var SelectedData = $("#SelectedData").val();
        var startDateChoice = $("#startDate").val();
        var endDateChoice = $("#endDate").val();
        var startTimeChoice = $("#startTime").val();
        var endTimeChoice = $("#endTime").val();
        
        // Format new dates to match SQL timestamp format
        var newStartDateTime = startDateChoice + ' ' + startTimeChoice;
        var newEndDateTime = endDateChoice + ' ' + endTimeChoice;
        
        // console.log("Vehicle Park : " + vehiclePark);
        // console.log("RCV : " + RCVnumber);
        // console.log("Data name : " + SelectedData);
        // console.log("Start Date : " + startDateChoice);
        // console.log("End Date: " + endDateChoice);
        
        $.ajax({
            url: "graph_data.php",
            data: {vehicleParkID: vehiclePark, RCVnumberID: RCVnumber, SelectedDataID: SelectedData, startDateTime: newStartDateTime, endDateTime: newEndDateTime},
            method: "POST",
            success: function(data) {
                // console.log(data);
                
                var measureID = [];
                var RCV = [];
                var plate = [];
                var timestamp = [];
                var name = [];
                var unit = [];
                var value = [];
                for(var i in data) {
                    measureID.push(data[i].Measure_ID);
                    RCV.push(data[i].RCV_Number);
                    plate.push(data[i].Plate_Number);
                    timestamp.push(data[i].Timestamp);
                    name.push(data[i].Name);
                    unit.push(data[i].Unit);
                    value.push(data[i].Value);
                }
                // console.log(measureID)
                // console.log(RCV);
                // console.log(plate);
                // console.log(timestamp);
                // console.log(name);
                // console.log(unit);
                // console.log(value);
                $("#dataTable")
                    .find("tr")
                    .remove()
                    .end();
                var table = $('#dataTable');
                table.append(
                    $('<tr></tr>').append(
                        $('<th>ID</th>'),
                        $('<th>RCV NUMBER</th>'),
                        $('<th>PLATE NUMBER</th>'),
                        $('<th>TIMESTAMP</th>'),
                        $('<th>NAME</th>'),
                        $('<th>UNIT</th>'),
                        $('<th>VALUE</th>')
                    )
                );
                var lastItem = data.slice(-4).reverse();
                $.each(lastItem, function(){
                    table.append(
                        $('<tr></tr>').append(
                            $('<td></td>').text(this.Measure_ID),
                            $('<td></td>').text(this.RCV_Number),
                            $('<td></td>').text(this.Plate_Number),
                            $('<td></td>').text(this.Timestamp),
                            $('<td></td>').text(this.Name),
                            $('<td></td>').text(this.Unit),
                            $('<td></td>').text(this.Value)
                        )
                    );
                });
                
                // Plot graph
                var value2=[1,35,3,4,-6,-8,7];
                var chartdata = {
                    labels: timestamp,
                    datasets : [
                        {
                            label: $("#SelectedData").val(),
                            backgroundColor: 'rgba(100, 200, 255, 0)',
                            borderColor: 'rgba(0, 100, 200, 0.75)',
                            hoverBackgroundColor: 'rgba(200, 200, 200, 1)',
                            hoverBorderColor: 'rgba(200, 200, 200, 1)',
                            data: value
                        },
                        {
                            label: 'toto',
                            backgroundColor: 'rgba(100, 200, 255, 0)',
                            borderColor: 'rgba(100, 0, 200, 0.75)',
                            data: value2
                        }
                    ]
                };

                var ctx = $("#myChart");

                var barGaph = new Chart(ctx, {
                    type: 'line',
                    data: chartdata,
                    options: {
                        scales: {
                            yAxes: [{
                                position: 'right',
                                ticks: {
                                    min:Math.min(...value)-0.1*Math.abs(Math.max(...value)-Math.min(...value)),
                                    max:Math.max(...value)+0.1*Math.abs(Math.max(...value)-Math.min(...value)),
                                }
                            },
                            {
                                position: 'left',
                                ticks: {
                                    min:Math.min(...value2)-0.1*Math.abs(Math.max(...value2)-Math.min(...value2)),
                                    max:Math.max(...value2)+0.1*Math.abs(Math.max(...value2)-Math.min(...value2)),
                                }
                            }]
                        },
                        // tooltips: {
                        //     position: 'nearest',
                        //     mode: 'index',
                        //     intersect: false,
                        // }
                    }
                });
            },
            error: function(data) {
                console.log(data);
            }
        });
    });
});