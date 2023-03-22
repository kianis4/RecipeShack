$(document).ready(function(){
    $(".addfavs").click(function(){
        const csrftoken = Cookies.get('csrftoken');
        var json = { "favourites" : [399, 400] }

        $.ajax({
            type: 'POST',
            url: '/addfavourites/',
            headers: { 'X-CSRFToken': csrftoken },
            contentType: 'application/json',
            data: JSON.stringify(json),
            success: function(){
                console.log("great!")
            },
            error: function(){
                console.log("wrong");
            }
        })
    });

    $(".getRecipes").click(function(){
        const csrftoken = Cookies.get('csrftoken');
        $.ajax({
            type: 'GET',
            url: '/getRecipes/',
            headers: { 'X-CSRFToken': csrftoken },
            success: function(){
                console.log("great!")
            },
            error: function(){
                console.log("wrong");
            }
        })
    });

});
