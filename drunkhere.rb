require "environment"
$LOAD_PATH.unshift(File.dirname(__FILE__) + '/vendor/sinatra/lib')
require 'sinatra'

get '/' do
  @tweets = Tweet.find(:all)
  erb :index
end

get '/random' do 
  @tweet = Tweet.find(:first, :order => "rand()")
  @tweet.to_json
end
