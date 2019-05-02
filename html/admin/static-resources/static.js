function validate_login(json, username, password){
    if(find_user(json, username, password).length == 0){
        return false;
    }
    return true;
} 

function login_click(){
    
    var json;
    var username = $('.login_form form input:first-child').val();
    var password = $('.login_form form input:nth-child(2)').val();

    // $.getJSON("https://api.myjson.com/bins/crg0w",
    //     function(input){
    //         json=input;
    //     }
    // );


    $.ajax({
        url: "https://api.myjson.com/bins/crg0w",
        async: false,
        dataType: 'json',
    }).done(function(data){
        json=data;
    });

    if(validate_login(json, username, password)){
        sessionStorage.setItem("username", username);
        window.location.href = "./adminDash.html";
    } else{
        $('.login_form #error_message').html("ERROR: Username or Password were incorrect!");
    }

}

function find_user(json ,username, password){
    return json.users.filter(
        e => (e.username == username 
        && e.password == password));    
}

function book_form_submit(){
    var title = $('.adminTable * .form-group.row:nth-child(2) * input').val();
    var author = $('.adminTable * .form-group.row:nth-child(3) * input').val();
    var publisher = $('.adminTable * .form-group.row:nth-child(4) * input').val();
    var json;
    $.ajax({
        url: "https://api.myjson.com/bins/crg0w",
        async: false,
        dataType: 'json',
    }).done(function(data){
        json=data;
    });

    var author_valid = validate_author(author, json);
    var publisher_valid = validate_publisher(publisher, json);

    if(!author_valid){
        if (publisher_valid) {
            $("#error_message").html("Author does not exist!");
            return;
        } else {
            $("#error_message").html("Author and publisher do not exist!");
            return;
        }
    }
    if(!publisher_valid){
        $("#error_message").html("Publisher does not exist!");
        return;
    }

    var book = new Book(title, author, publisher);
    json.books.push(book);

    var url = "https://api.myjson.com/bins/crg0w";
    $.ajax({
        url: url,
        type:"PUT",
        data: JSON.stringify(json),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data, textStatus, jqXHR){
            window.location.href = "./adminBooks.html";
        }
    });

    // if(!add_book(book, json)){
    //     $("#error_message").html("An unexpected error occurred. Please try again later.");
    // }else{
    //     window.location.href = "./adminBooks.html";
    // }
}

function validate_author(author, json){
    if(json.authors.filter(
        a => a.name == author
        ).length > 0){
        return true;
    } else{
        return false;
    }
}

function validate_publisher(publisher, json){
    if(json.publishers.filter(
        p => p.name == publisher
        ).length > 0){
        return true;
    } else{
        return false;
    }
}

function add_book(book, json){
    var url = "https://api.myjson.com/bins/crg0w";

    // books = json.books;
    // books.push(book);

    json.books.push(book);

    var success = false;

    $.ajax({
        url: url,
        type:"PUT",
        data: JSON.stringify(json),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data, textStatus, jqXHR){
            return true;
        }
    });
    return success;
}

function Book(title, author, publisher){
    this.title = title;
    this.author = author;
    this.publisher = publisher;
}

function update_form_submit(){
    var title = $('.adminTable * .form-group.row:nth-child(2) * input').val();
    var author = $('.adminTable * .form-group.row:nth-child(3) * input').val();
    var publisher = $('.adminTable * .form-group.row:nth-child(4) * input').val();
    var json;
    $.ajax({
        url: "https://api.myjson.com/bins/crg0w",
        async: false,
        dataType: 'json',
    }).done(function(data){
        json=data;
    });

    var book = new Book(title, author, publisher);
    var i = 0;
    var books = json.books;
    for(i=0; i<books.length; i++){
        if(books[i].title == title){
            books[i] = book;
        }
    }

    $.ajax({
        url: "https://api.myjson.com/bins/crg0w",
        type:"PUT",
        data: JSON.stringify(json),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data, textStatus, jqXHR){
            window.location.href = "./adminBooks.html";
        }
    });
}

function edit_click(title, author, publisher){
    localStorage.setItem("bookTitle", title);
    localStorage.setItem("bookAuthor", author);
    localStorage.setItem("bookPublisher", publisher);
    window.location.href = "./adminBooksEdit.html";
}

function delete_click(title){
    
    var json;
    $.ajax({
        url: "https://api.myjson.com/bins/crg0w",
        async: false,
        dataType: 'json',
    }).done(function(data){
        json=data;
    });


    var i = 0;
    var books = json.books;
    for(i=0; i<books.length; i++){
        if(books[i].title == title){
            books.splice(i, 1);
        }
    }

    $.ajax({
        url: "https://api.myjson.com/bins/crg0w",
        type:"PUT",
        data: JSON.stringify(json),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data, textStatus, jqXHR){
            window.location.href = "./adminBooks.html";
        }
    });
}
