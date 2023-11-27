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
                $('#result').html('No data found. Try selecting a different country');
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
                $('#result').html('No data found. Try selecting a different country');
            } else {
                console.log(result)
                $('#result').html(result['data'])
            }
        },
        error: (error) => {
            $('#result').html(error.responseText)
        }
    });
})

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
            console.log('something else went wrong')
            $('#result').html(error.responseText)
        }
    })
});