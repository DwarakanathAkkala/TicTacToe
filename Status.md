28/10/2023

1. Winning Scenarios
2. Logic for the game
3. Responsive Design for mobile

29/10/2023

1. Responsive UI for Choosing Game Preferences

30/10/2023

1. Game Preferences
2. Added Draw Scenario
3. Restart Game Functionality

Road block -> Get all elements based on 'input' element was selecting all the inputs including the Game Preferences inout values and blocking the reset values functionality after "Restart" button is clicked.

Work-around --> Used getElementsbyClassName by including separate class for all the grid inputs.

31/10/2023

1. Update Game Preferences only if user clicks "Game On!" button.
2. Added Change Preferences button to change choices between game.
3. Storing Players preferences and starting a new game with the same preferences when "Restart Game" is clicked.

Application Status

1. Click on Play Game to Start (Clicks doesn't function until button is clicked)
2. Game Preferences can be chosen by user.
3. Game Functionality working correctly.
4. Restart Game -> Resets Game Grid and stores Player's preferences.
5. Play Again -> Starts a fresh game with stored preferences.
6. Change Preference -> Dialog box to change the preferences appears.

To Do

1. Choosing preferences by user --> Done
2. Alerts if any player wins the game. --> Done
3. Reset Player Sign after reset button is clicked. --> Done.
