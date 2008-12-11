require "rubygems"
require "graticule"
# the hpricot truncate method uses this
require "active_support"
require "active_record"
$LOAD_PATH.unshift(File.dirname(__FILE__) + '/vendor/sinatra/lib')

db_config = YAML.load_file('config/database.yml')
ActiveRecord::Base.establish_connection(db_config["production"])

class Migrate < ActiveRecord::Migration
  def self.up
    create_table :tweets do |t|
      t.string :user, :body, :overlay_body
      t.integer :twitter_id
      t.column "latitude", :decimal, :precision => 15, :scale => 12
      t.column "longitude", :decimal, :precision => 15, :scale => 12
      t.datetime :published_at, :created_at
    end
  end
  
  def self.down
    drop_table :posts
  end
end

# This is only a "localhost"-Apikey: 
#GOOGLE_API_KEY = "2ABQIAAAAnfs7bKE82qgb3Zc2YyS-oBT2yXp_ZAY8_ufC3CFXhHIE1NvwkxSySz_REpPq-4WZA27OwgbtyR3VcA"
GOOGLE_API_KEY = "ABQIAAAA3hTMxebvnbMvuQzYVBzbKhSjSB4hbSIVmu7QqeR02zD68C5aUhSY0ElTBXNgn76EPHFLxoncuZZ4OQ"
GEOCODER = Graticule.service(:google).new(GOOGLE_API_KEY)

class Tweet < ActiveRecord::Base
  
  validates_presence_of :twitter_id, :body, :latitude, :longitude, :user
  validates_uniqueness_of :twitter_id
  before_validation_on_create :extract_geocodes
  
  def extract_geocodes
    puts "extracting geocode for #{self.body}"
    if query_match = self.body.match(/l:(.*)$/i)
      puts "matching"
      query = query_match[1]
      location = GEOCODER.locate(query)
      puts "#{location}"
      self.latitude = location.latitude
      self.longitude = location.longitude
      # remove the L: ... part?
      self.overlay_body = "<a href=\"http://twitter.com/#{self.user}\">#{self.user}</a>: #{self.body.gsub(/l:(.*)$/i,"").gsub(/^@rememberthebeer/,"")}"
    end
  rescue
    puts "Error extracting geo informations"
  end
end


Migrate.up unless Tweet.table_exists?