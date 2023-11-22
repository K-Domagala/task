$('#submit1').click(function() {
    $.ajax({
        url: 'api.geonames.org/neighbours.php',
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#api1Input').val()
        },
        success: (result) => {
            console.log(JSON.stringify(result))
        },
        error: () => {
            console.log('something went wrong')
        }
    });
});