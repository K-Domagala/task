//Map
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

//Handle what happens when a country is selected
$('#country-select').on('change',function() {
    const countryCode = this.value;
    updateInfo(countryCode);
})

var exchangeRate = 1;

$('#usd-input').on('change',function() {
    let newValue = (Math.round(($('#usd-input').val() * exchangeRate) * 100) / 100).toFixed(2)
    console.log(newValue)
    $('#target-input').val(newValue);
})

$('#target-input').on('change',function() {
    let newValue = (Math.round(($('#target-input').val() / exchangeRate) * 100) / 100).toFixed(2)
    console.log(newValue)
    $('#usd-input').val(newValue);
})

//Update info modal for given country
const updateInfo = (input) => {
    $('#country-flag').attr('src' , 'https://flagsapi.com/' + input + '/flat/64.png');
    $.ajax({
        url: 'libs/php/countryInfo.php',
        type: 'POST',
        dataType: 'json',
        data:{
            countryCode: input
        },
        success: (result) => {
            $('#country-name').html(result.data['countryName']);
            $('#country-capital').html(result.data['capital']);
            $('#country-continent').html(result.data['continentName']);
            var population = new Intl.NumberFormat().format(result.data['population']);
            $('#country-population').html(population);
            $('#country-currency').html(result.data['currencyCode']);
            updateCurrencyName(result.data['currencyCode']);
            getExchangeRate(result.data['currencyCode']);
            updateWeatherModal(result.data['currencyCode'], result.data['capital']);
        },
        error: (error) => {
            console.log(error.responseText)
        }
    })
}

//Updates name of currency in all relevant modals
const updateCurrencyName = (input) => {
    $.ajax({
        url: 'libs/php/currency.php',
        type: 'GET',
        dataType: 'json',
        success: (result) => {
            exchangeRate = result.data[input]
            $('#country-currency').html(result.data[input] + ' (' + input + ')');
            $('#currency-name').html(result.data[input] + ' (' + input + ')');
        },
        error: (error) => {
            console.log(error.responseText)
        }
    })
}

//Retrievs the current exchange rate of currency
const getExchangeRate = (currency) => {
    $.ajax({
        url: 'libs/php/exchangeRate.php',
        type: 'GET',
        dataType: 'json',
        success: (result) => {
            exchangeRate = result.data[currency];
            let formattedExchangeRate = new Intl.NumberFormat('en-GB', { style: 'currency', currency}).format(result.data[currency]);
            $('#exchange-rate').html(formattedExchangeRate);
            $('#converter-currency').html(currency);
            $('#target-input').val($('#usd-input').val() * result.data[currency]);
        },
        error: (error) => {
            console.log(error.responseText)
        }
    })
}

//Gets the lat and lon for the selected countries capital
const updateWeatherModal = (countryCode, capital) => {
    $.ajax({
        url: 'libs/php/latlon.php',
        type: 'POST',
        dataType: 'json',
        data: {
            countryCode,
            capital
        },
        success: (result) => {
            updateWeather(result.data)
        },
        error: (error) => {
            console.log(error.responseText)
        }
    })
}

//Update weather information for selected countries capital using the geocode
const updateWeather = (coordinates) => {
    console.log(coordinates)
    $.ajax({
        url: 'libs/php/weather.php',
        type: 'POST',
        dataType: 'json',
        data: {
            lat: coordinates['lat'],
            lon: coordinates['lon']
        },
        success: (result) => {
            console.log(result);
        },
        error: (error) => {
            console.log(error.responseText)
        }
    })
}

$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function () {
            $(this).remove();
        });
    }
    //Retrieve a list of all countries from GeoNames for the select field
    $.ajax({
        url: 'libs/php/countries.php',
        type: 'GET',
        dataType: 'json',
        success: (result) => {
            console.log(result)
            let response = '<option disabled selected value> -- select a country -- </option>'
            for(let i = 0; i < result['data'].length; i++){
                response += '<option value=' + result['data'][i]['countryCode'] + '>' + result['data'][i]['countryName'] + '</option>'
            }
            $('#country-select').html(response)
        },
        error: (error) => {
            console.log(error);
            console.log('something went wrong')
            $('#result').html(error.responseText)
        }
    })
});