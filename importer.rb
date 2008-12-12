require "environment"
require "rubygems"
require "twitter"

Twitter::Base.new('PUTYOURTWITTERBOTNAMEHERE', 'PUTYOURTWITTERBOTPASSWORDHERE').replies.each do |tweet|
  puts "importing #{tweet.id}"
  Tweet.create!(:body => tweet.text, :twitter_id => tweet.id, :user => tweet.user.name, :screenname => tweet.user.screenname) rescue "error importing"
  puts "done #{tweet.id}"
end

# */6 * * * * bash -c 'cd /u/apps/partytweet/; ruby import_tweets.rb >> /log/import.log 2>&1'