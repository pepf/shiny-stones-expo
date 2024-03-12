# 💎 Shiny stones mobile

<img src="./screen_splash.png" width="200" >
<img src="./screen_level.png" width="200">

Taking my original [shiny-stones](https://github.com/pepf/shiny-stones) for web as starting point, I've ported the game to expo, allowing it to serve as an example of a multiplatform game, supporting **iOS, Android and Web from the same codebase**. To achieve this, [Expo Router](https://docs.expo.dev/router/introduction/) is used as a base.

Just like the original project, the graphics are still rendered using three.js and [react-three-fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) under the hood. This allows us to render the gameplay elements in a declarative way, which will look familiar for React Develoeprs. Furthermore the 3D canvas provided by three.js makes things look and feel more interesting, while using the devices' GPU to render the game. 

<div align="center">

[![view - DEMO](https://img.shields.io/badge/play-shiny_stones-blue?style=for-the-badge)](https://shiny-stones-xi.vercel.app/)

</div>

## How to run
### Web
Clone this repo and run `npx expo`, select the option to run the code on web.

### iOS / Android
The codebase is generated from an expo template, and is still completely compatible with Expo go. More about [Expo Go](https://docs.expo.dev/get-started/expo-go/#install-expo-go-on-your-device).
> ⚠️ This project depends heavily on expo-gl and expo-three. openGL does not work well on iOS simulator, therefore it is best to use real devices when running the application.


## Todo
- Scoring (incl combo bonusses)
- More gameplay elements, e.g. level with time limit, level with limited amount of moves or level where user needs to reach a certain score.
- Graphical improvements are done, uses dynamically generated environment maps to provide nice lightning. Improvements can be done by having some levels have different lightning or color schemes compared to others.