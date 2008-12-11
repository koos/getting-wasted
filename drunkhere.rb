require "environment"
require 'sinatra'

get '/' do
  @tweets = Tweet.find(:all, :conditions => {:created_at => 1.day.ago..Time.now})
  erb :index
end

get '/random' do 
  @tweet = Tweet.find(:first, :conditions => {:created_at => 1.day.ago..Time.now}, :order => "rand()")
  @tweet.to_json
end
