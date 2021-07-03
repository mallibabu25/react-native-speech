require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-speech"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-speech
                   DESC
  s.homepage     = "https://github.com/mallibabu25/react-native-speech"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "malleswarao" => "malli.babu@inventrix.co.in" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/mallibabu25/react-native-speech.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  # ...
  # s.dependency "..."
end

