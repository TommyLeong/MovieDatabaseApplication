# Project built and test under following environments
### Build with
- React Native 0.83
- NODE 25.2.1
- Java 17.0.12
- NPM 11.6.2

### Tested with Simulator
- iOS 26.2 (iPhone 17 Pro)
- Android API 36 (Medium size device)

# How to run the project?
In order to run the project successfully, you will need to do the following
- npm install && cd ios && pod install
- Update your TMDB_API_KEY value at .env (Please refer to .env.example for full .env list)
- Update your ACCOUNT_ID at ./movieDatabaseApplication/src/config/constants.js 

** Look for `!REQUIRED!` keyword, so you'll know what's expected from your end to run the project successfully.

# Imperfection place to enhance
- Load more's content viewing
- Dropdown sizes & iOS picker
- UI design + Color palletes