//Logic for API 1, (Neighbour API).
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
        url: 'libs/php/capital.php',
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#api2Input').val()
        },
        success: (result) => {
            if(!result['data']){
                $('#result').html('No data found. Try selecting a different country.');
            } else {
                $('#result').html(result['data'])
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
                $('#result').html('No data found. Try selecting a different country.');
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
            $('#api2Input').html(response)
        },
        error: (error) => {
            console.log(error);
            console.log('something went wrong')
            $('#result').html(error.responseText)
        }
    })
});