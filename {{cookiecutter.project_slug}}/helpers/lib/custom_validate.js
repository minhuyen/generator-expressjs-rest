var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var app = express();
app.use(expressValidator({
  customValidators: {
    checkDate: function(value) {
      var book_date = value;
      book_date = new Date(book_date);
      book_date = book_date.setHours(0,0,0,0);
      var current = new Date();
      current = current.setHours(0,0,0,0);
      console.log(book_date);
      console.log(current);
      if(book_date >= current){
        return true
      }
      return false
    },
    listEmail: function(value){
      var listEmail = value;
      var emails = listEmail.split(",");
      var valid = true;
      var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      for (var i = 0; i < emails.length; i++) {
        if( emails[i] == "" || ! regex.test(emails[i])){
          valid = false;
        }
      }

    }
  }
}));