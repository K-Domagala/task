$('#submit1').click(function() {
    $.ajax({
        url: 'libs/php/neighbours.php',
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#api1Input').val()
        },
        success: (result) => {
            let resultString = '';
            resultString += result['data'][0]['countryName']
            for(let i = 1; i < result['data'].length; i++){
                resultString += ', ' + result['data'][i]['countryName'];
            }
            $('#result').html(resultString)
        },
        error: (error) => {
            console.log(error);
            console.log('something went wrong')
            $('#result').html(error.responseText)
        }
    });
});

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
            console.log(result['data'][0]['countryCode'])
            for(let i = 0; i < result['data'].length; i++){
                response += '<option value=' + result['data'][i]['countryCode'] + '>' + result['data'][i]['countryName'] + '</option>'
            }
            $('#api1Input').html(response)
        },
        error: (error) => {
            console.log(error);
            console.log('something else went wrong')
            $('#result').html(error.responseText)
        }
    })
});