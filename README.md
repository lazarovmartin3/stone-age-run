# 2D Game

This is a 2D game built using **Pixi.js** and **Matter.js**. The game features a hero character, enemies, throwable axes, and various interactive elements such as platforms, food, and a scoring system.

## Table of Contents
1. [Game Controls](#game-controls)
2. [Installation](#installation)
3. [Running the Game](#running-the-game)
4. [Game Features](#game-features)
5. [Licenses](#licenses)

---

## Game Controls

- **Left/Right Arrow Keys**: Move the hero left or right.
- **Spacebar**: Jump.
- **Left Mouse Click**: Throw an axe at enemies.
- **Escape**: Pause the game (or trigger end screen in case of game over).

---

## Installation

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/your-repo-name/2d-game.git
    cd 2d-game
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

---

## Running the Game

To start the game in development mode, run:

```bash
npm run dev

## Game Features
Player:

Animated character with walk, jump, and throw axe animations.

The player can move, jump, and throw axes to attack enemies.

Enemy:

Simple AI using a state machine to handle animations (run, idle, jump).

The enemy moves around platforms and reacts to collisions with the player or thrown axes.

Start Screen and End Screen:

A start screen appears when the game begins, with a button to start the game.

An end screen appears when the player dies, displaying the final score and an option to restart the game.

Dynamic Level Generation: Platforms are created dynamically as the player moves through the level.

Food and Scoring: The player collects food to increase their score. The hunger UI displays the current score.

Throwable Axes: The player can throw axes at enemies, which are destroyed upon collision.

Assets Used
Sprites: Custom 2D sprites for the hero, enemies, and throwable axes.

Backgrounds: Parallax background that moves as the player advances.

Development Notes
This game uses Pixi.js for rendering and Matter.js for physics.

The game is controlled entirely through the keyboard and mouse.

Feel free to contribute to this project by forking the repository and submitting pull requests with improvements or bug fixes.
