require 'rubygems'
$LOAD_PATH.unshift(File.dirname(__FILE__) + '/vendor/sinatra/lib')
require 'sinatra'

  
Sinatra::Application.default_options.merge!(
  :run => false,
  :env => :production
)
 
require 'times'
run Sinatra.application