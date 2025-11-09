# Tetris

This implementation of Tetris is inspired by [Pontus Alexander](https://twitter.com/pomle). You can watch the videos of how he creates Tetris [here](https://www.youtube.com/playlist?list=PLS8HfBXv9ZWW49tOAbvxmKy17gpsqWXaX).

This implementation though is slightly different:

- TypeScript is used to make sure everything (I hope) is type safe.
- Handling of state is done completely differently; State is hold outside of the components, which means it can be accessed easier and also can be serialized and deserialized more easily.
- The networking code is done differently; instead of sending every change (both player and board separately) and hoping it won't cause race conditions, we just send the whole state object and get one back. That means less network traffic, which is good.
- This version has a main menu (I know it's not pretty, I'm open to your ideas) which allows to choose which mode you want to play in.
- The rendering is done outside of the game logic classes. This helps to keep the code clean.
- Many other tweaks and improvements that help the code be more maintainable.

## How to run it

- clone repository
- Run `pnpm i`
- Run `pnpm dev`
- To play multiplayer, you also need to run `pnpm run server` in a separate terminal window
- Enter `http://localhost:5173` in your browser
