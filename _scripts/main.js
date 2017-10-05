window.jQuery = window.$ = require('jquery');
window.Tether = require('tether');
require('bootstrap');
require('lazysizes');

const Setup = require('./setup.js').default;

$(function(){
  'use strict';

  const setup = new Setup();
  setup.init();
});