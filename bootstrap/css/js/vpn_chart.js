/*
 * VPN Chart javascript to plot vpn data on overview
 * 
 */ 
 
$(document).ready(function() {
    var parkID = <?php echo json_encode($_SESSION['vehicle_pool_Park_ID']) ?>;
    console.log(parkID);

    $.ajax({
        url: "vpn_info.php",
        data: {param_parkID: parkID},
        dataType: "json",
        method: "POST",
        success: function(data) {
            var serial_number = [];
            var status = [];

            for(var i in data) {
                serial_number.push(data[i].Serial_Number);
                status.push(data[i].Status);
            }
            var online = 1;
            var offline = 1;
            var VPNCanvas = document.getElementById("ChartVPN");
            Chart.defaults.global.defaultFontSize = 12;
            
            //creating new labels to print modem serial number and status
            var i;
            var newLabel = [];
            for (i = 0; i < serial_number.length; i++)
            {
                newLabel.push(serial_number[i] + ': ' + status[i]);
            }
            
            //Creating new data set to replace serial number by 1
            var j;
            var newData = [];
            for (j = 0; j < serial_number.length; j++)
            {
                newData.push(1);
            }
            
            //Adjusting background color according to modem status: green = online, red = offline
            var k;
            var newBackground = [];
            for (k = 0; k < serial_number.length; k++)
            {
                var pos = status[k].toString();
                console.log(pos);
                if(status[k].toString().search("Online"))
                {
                    newBackground.push("#ff4d4d");
                }
                else
                {
                    newBackground.push("#5cd65c");
                }
            }
            
            var VPNData = {
                
                labels: newLabel,
                datasets: 
                [
                    {
                        data: newData,
                        backgroundColor: newBackground
                    },
                ]
            };
            var pieChart = new Chart(VPNCanvas, {
              type: 'pie',
              data: VPNData,
              options: {
                legend: {
                    display: true,
                    position: 'right'
                }
              }
            });
        },
        error: function(data) {
            console.log(data);
        }
    });
});