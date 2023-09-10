FROM ruby:3.0
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs mariadb-client

ENV APP_PATH /myapp

RUN mkdir $APP_PATH
WORKDIR $APP_PATH

COPY Gemfile $APP_PATH/Gemfile
COPY Gemfile.lock $APP_PATH/Gemfile.lock
RUN gem install bundler
RUN bundle install

COPY . $APP_PATH

# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Start the main process.
#下記を一旦コメントアウト
#CMD ["rails", "server", "-b", "0.0.0.0"]
#以下を本番用に追加
CMD ["/bin/sh", "-c", "bundle exec rails db:create && bundle exec rails db:migrate && bundle exec unicorn -p 3000 -c /app/config/unicorn.rb -E production"]
