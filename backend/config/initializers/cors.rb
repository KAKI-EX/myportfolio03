Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:4000",  "http://192.168.0.210:4000", "https://web.okaimonoportfolio.xyz" # どこからのリクエストを受け入れるか指定する。

    resource "*",
      headers: :any,
      expose: ["access-token", "expiry", "token-type", "uid", "client"],
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
