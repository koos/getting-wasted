require 'rubygems'
$LOAD_PATH.unshift('/u/apps/gettingwasted/current/vendor/sinatra/lib')
require 'sinatra'

  
Sinatra::Application.default_options.merge!(
  :run => false,
  :env => :production
)
 
require 'drunkhere'
run Sinatra.application