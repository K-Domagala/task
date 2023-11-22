$('#submit1').click(function() {
    $.ajax({
        url: 'libs/php/neighbours.php',
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#api1Input').val()
        },
        success: (result) => {
            console.log(result['data'][0])
        },
        error: (error) => {
            console.log(error);
            console.log('something went wrong')
        }
    });
});