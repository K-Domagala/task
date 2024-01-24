//Logic for API 1, (Neighbour API).

var satelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var street = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});

var map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13,
    layers: [street]
});

var baseMaps = {
    'Satelite': satelite,
    'Street': street
}

var layerControl = L.control.layers(baseMaps).addTo(map);



$('#submit1').click(function() {
    $('#result').html('Working on it...')
    $.ajax({
        url: 'libs/php/neighbours.php',
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#api1Input').val()
        },
        success: (result) => {
            let resultString = '';
            if(!result['data']){
                $('#result').html('No data found. Try selecting a different country.');
            } else if(!result['data'][0]){
                $('#result').html('This country has no neighbours');
            } else {
                resultString += result['data'][0]['countryName']
                for(let i = 1; i < result['data'].length; i++){
                    resultString += ', ' + result['data'][i]['countryName'];
                }
                $('#result').html(resultString)
            }
        },
        error: (error) => {
            $('#result').html(error.responseText)
        }
    });
});

//Logic for API 2, (Capital API).
$('#submit2').click(() => {
    $('#result').html('Working on it...')
    $.ajax({
        url: 'libs/php/wiki.php',
        type: 'POST',
        dataType: 'json',
        data: {
            string: $('#api2Input').val()
        },
        success: (result) => {
            console.log(result)
            if(!result['data']){
                $('#result').html('No data found. Try searching a different location.');
            } else {
                $('#result').html(result['data']['summary'])
            }
        },
        error: (error) => {
            $('#result').html(error.responseText)
        }
    });
})

//Logic for API 3, (Which Country).
$('#submit3').click(() => {
    $('#result').html('Working on it...')
    $.ajax({
        url: 'libs/php/search.php',
        type: 'POST',
        dataType: 'json',
        data: {
            string: $('#api3Input').val()
        },
        success: (result) => {
            if(!result['data']){
                $('#result').html('No data found. Try searching a different location.');
            } else if(result['data']['resultsCount'] == 0){
                $('#result').html('No places found with this name.');
            } else {
                $('#result').html(result['data']['resultsCount'] + ' places found with this name. Top result is in ' + result['data'][0]['countryName'] + '.');
            }
        },
        error: (error) => {
            $('#result').html(error.responseText)
        }
    });
})

//Retrieve a list of all countries from GeoNames. Used to create a list of countries for the first 2 APIs.
$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function () {
            $(this).remove();
        });
    }
    $.ajax({
        url: 'libs/php/countries.php',
        type: 'GET',
        dataType: 'json',
        success: (result) => {
            let response = ''
            for(let i = 0; i < result['data'].length; i++){
                response += '<option value=' + result['data'][i]['countryCode'] + '>' + result['data'][i]['countryName'] + '</option>'
            }
            $('#api1Input').html(response)
        },
        error: (error) => {
            console.log(error);
            console.log('something went wrong')
            $('#result').html(error.responseText)
        }
    })
});