/* global $, flagImagePosition, d3, d3FDGMaker */


console.log(flagImagePosition.flag_us.flag_x_position);
console.log(flagImagePosition.flag_us.flag_y_position);




$(document).ready(function(){
    
    $.ajax({
        url: 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json',
        dataType: 'JSON',
        type: 'GET',
        success: function(data){
            d3FDGMaker(data)   
        }
    })
});
